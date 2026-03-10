"""
Pinterest image scraper with multiple fallback strategies.

Strategy A: Google Image Search filtered to pinterest.com
Strategy B: Pinterest search page HTML parsing
Strategy C: Pinterest RSS/widget endpoints
"""

from __future__ import annotations

import re
import json
import time
import random
import logging
import urllib.parse
from dataclasses import dataclass, asdict
from typing import List, Optional, Union

import requests
from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)

# Rotate user agents to reduce blocking risk
USER_AGENTS = [
    (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/122.0.0.0 Safari/537.36"
    ),
    (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/121.0.0.0 Safari/537.36"
    ),
    (
        "Mozilla/5.0 (X11; Linux x86_64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    ),
    (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/605.1.15 (KHTML, like Gecko) "
        "Version/17.2 Safari/605.1.15"
    ),
]

REQUEST_TIMEOUT = 15  # seconds


@dataclass
class ImageResult:
    url: str
    source: str = "pinterest"
    width: Optional[int] = None
    height: Optional[int] = None


def _get_session() -> requests.Session:
    """Build a requests session with realistic browser headers."""
    session = requests.Session()
    ua = random.choice(USER_AGENTS)
    session.headers.update(
        {
            "User-Agent": ua,
            "Accept": (
                "text/html,application/xhtml+xml,application/xml;"
                "q=0.9,image/avif,image/webp,*/*;q=0.8"
            ),
            "Accept-Language": "en-US,en;q=0.9",
            "Accept-Encoding": "gzip, deflate, br",
            "DNT": "1",
            "Connection": "keep-alive",
            "Upgrade-Insecure-Requests": "1",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "none",
            "Sec-Fetch-User": "?1",
            "Cache-Control": "max-age=0",
        }
    )
    return session


def _is_valid_image_url(url: str) -> bool:
    """Check whether a URL looks like a real image we want to keep."""
    if not url or not url.startswith("http"):
        return False
    # Skip tiny icons, tracking pixels, and data URIs
    skip_patterns = [
        "gstatic.com/images",
        "google.com/images",
        "1x1",
        "transparent",
        "favicon",
        "logo",
        "icon",
        "sprite",
        "data:image",
        "googleusercontent.com/s16",  # tiny google thumbnails
    ]
    url_lower = url.lower()
    return not any(p in url_lower for p in skip_patterns)


def _is_pinterest_image(url: str) -> bool:
    """Check if the URL is hosted on a Pinterest CDN domain."""
    pinterest_domains = [
        "pinimg.com",
        "pinterest.com",
    ]
    return any(d in url for d in pinterest_domains)


def _deduplicate(images: list[ImageResult], limit: int) -> list[ImageResult]:
    """Remove duplicate URLs and enforce the limit."""
    seen: set[str] = set()
    unique: list[ImageResult] = []
    for img in images:
        if img.url not in seen:
            seen.add(img.url)
            unique.append(img)
        if len(unique) >= limit:
            break
    return unique


# ---------------------------------------------------------------------------
# Strategy A -- Google Image Search (site:pinterest.com)
# ---------------------------------------------------------------------------

def scrape_google_images(query: str, limit: int = 20) -> list[ImageResult]:
    """
    Search Google Images restricted to pinterest.com and extract image URLs.

    Google embeds image metadata as JSON blobs inside <script> tags.  We look
    for patterns that contain direct image URLs (usually starting with
    ``https://i.pinimg.com``).
    """
    encoded_q = urllib.parse.quote_plus(f"site:pinterest.com {query}")
    url = (
        f"https://www.google.com/search?q={encoded_q}"
        f"&tbm=isch&tbs=isz:l&ijn=0"
    )
    logger.info("Strategy A: fetching %s", url)

    session = _get_session()
    resp = session.get(url, timeout=REQUEST_TIMEOUT)
    resp.raise_for_status()
    html = resp.text

    images: list[ImageResult] = []

    # --- Method 1: extract URLs from embedded AF_initDataCallback JSON ---
    # Google wraps image data in AF_initDataCallback calls.  Inside those
    # blobs the full-size image URL often appears as the first element of a
    # three-element array: ["https://....jpg", width, height].
    json_blocks = re.findall(
        r"AF_initDataCallback\(\{[^}]*data:(\[.+?\])\s*\}\s*\);",
        html,
        re.DOTALL,
    )
    for block in json_blocks:
        # Pull all URLs that look like pinimg CDN links
        urls = re.findall(
            r'"(https?://i\.pinimg\.com/[^"]+)"',
            block,
        )
        for u in urls:
            if _is_valid_image_url(u):
                images.append(ImageResult(url=u))

    # --- Method 2: broader regex sweep for pinimg URLs in the page ---
    if len(images) < limit:
        all_pinimg = re.findall(
            r'(https?://i\.pinimg\.com/originals/[^"\'&\s]+)',
            html,
        )
        all_pinimg += re.findall(
            r'(https?://i\.pinimg\.com/736x/[^"\'&\s]+)',
            html,
        )
        for u in all_pinimg:
            u = u.split("\\")[0]  # trim any JSON escapes
            if _is_valid_image_url(u):
                images.append(ImageResult(url=u))

    # --- Method 3: data-src / data-iurl attributes (older markup) ---
    if len(images) < limit:
        soup = BeautifulSoup(html, "html.parser")
        for tag in soup.find_all(["img", "div"], attrs={"data-src": True}):
            src = tag.get("data-src", "")
            if _is_valid_image_url(src) and _is_pinterest_image(src):
                images.append(ImageResult(url=src))
        for tag in soup.find_all(attrs={"data-iurl": True}):
            src = tag.get("data-iurl", "")
            if _is_valid_image_url(src) and _is_pinterest_image(src):
                images.append(ImageResult(url=src))

    logger.info("Strategy A: found %d raw results", len(images))
    return _deduplicate(images, limit)


# ---------------------------------------------------------------------------
# Strategy B -- Direct Pinterest search page scraping
# ---------------------------------------------------------------------------

def scrape_pinterest_search(query: str, limit: int = 20) -> list[ImageResult]:
    """
    Fetch Pinterest's search results page and extract image URLs from the
    server-rendered HTML / embedded JSON state.
    """
    encoded_q = urllib.parse.quote_plus(query)
    url = f"https://www.pinterest.com/search/pins/?q={encoded_q}&rs=typed"
    logger.info("Strategy B: fetching %s", url)

    session = _get_session()
    resp = session.get(url, timeout=REQUEST_TIMEOUT)
    resp.raise_for_status()
    html = resp.text

    images: list[ImageResult] = []

    # Pinterest embeds initial pin data inside a <script id="__PWS_DATA__">
    # tag or similar JSON blobs.
    soup = BeautifulSoup(html, "html.parser")

    # Try the PWS_DATA script tag first
    pws_script = soup.find("script", id="__PWS_DATA__")
    if pws_script and pws_script.string:
        try:
            data = json.loads(pws_script.string)
            _extract_from_pws(data, images)
        except json.JSONDecodeError:
            logger.debug("Failed to parse __PWS_DATA__ JSON")

    # Fallback: scan all <script> tags for image URLs
    if len(images) < limit:
        for script in soup.find_all("script"):
            if not script.string:
                continue
            urls = re.findall(
                r'"(https?://i\.pinimg\.com/[^"]+)"',
                script.string,
            )
            for u in urls:
                u = u.replace("\\u002F", "/")
                if _is_valid_image_url(u):
                    images.append(ImageResult(url=u))

    # Also grab <img> tags that point to pinimg
    for img_tag in soup.find_all("img", src=True):
        src = img_tag["src"]
        if _is_pinterest_image(src) and _is_valid_image_url(src):
            # Attempt to upgrade thumbnail to 736x version
            upgraded = _upgrade_pinimg_url(src)
            images.append(ImageResult(url=upgraded))

    logger.info("Strategy B: found %d raw results", len(images))
    return _deduplicate(images, limit)


def _extract_from_pws(data: dict | list, results: list[ImageResult]):
    """Recursively walk the PWS JSON tree looking for image URL fields."""
    if isinstance(data, dict):
        # Pinterest stores images under keys like "orig" or "736x"
        if "orig" in data and isinstance(data["orig"], dict):
            url = data["orig"].get("url")
            if url and _is_valid_image_url(url):
                results.append(
                    ImageResult(
                        url=url,
                        width=data["orig"].get("width"),
                        height=data["orig"].get("height"),
                    )
                )
                return
        if "url" in data and isinstance(data["url"], str):
            u = data["url"]
            if _is_pinterest_image(u) and _is_valid_image_url(u):
                results.append(ImageResult(url=u))
        for v in data.values():
            _extract_from_pws(v, results)
    elif isinstance(data, list):
        for item in data:
            _extract_from_pws(item, results)


def _upgrade_pinimg_url(url: str) -> str:
    """Try to swap a small thumbnail size for a larger variant."""
    # Common Pinterest CDN size prefixes
    size_re = r"/(75x|150x|236x|474x|564x)/"
    if re.search(size_re, url):
        return re.sub(size_re, "/736x/", url)
    return url


# ---------------------------------------------------------------------------
# Strategy C -- Pinterest RSS / unofficial JSON endpoints
# ---------------------------------------------------------------------------

def scrape_pinterest_rss(query: str, limit: int = 20) -> list[ImageResult]:
    """
    Some Pinterest boards and topics expose an RSS feed.  We try the
    ``/source/`` and ``/search/`` feeds that historically worked.
    """
    images: list[ImageResult] = []
    encoded_q = urllib.parse.quote_plus(query)
    feed_urls = [
        f"https://www.pinterest.com/search/pins/?q={encoded_q}&rs=typed&format=json",
        f"https://www.pinterest.com/resource/BaseSearchResource/get/"
        f"?source_url=/search/pins/?q={encoded_q}"
        f"&data=%7B%22options%22%3A%7B%22query%22%3A%22{encoded_q}%22%7D%7D",
    ]

    session = _get_session()
    session.headers["X-Requested-With"] = "XMLHttpRequest"
    session.headers["Accept"] = "application/json"

    for feed_url in feed_urls:
        logger.info("Strategy C: trying %s", feed_url)
        try:
            resp = session.get(feed_url, timeout=REQUEST_TIMEOUT)
            if resp.status_code != 200:
                continue
            try:
                data = resp.json()
            except (json.JSONDecodeError, ValueError):
                # Maybe it is RSS/XML
                _parse_rss(resp.text, images)
                continue
            _extract_from_pws(data, images)
        except requests.RequestException as exc:
            logger.warning("Strategy C feed failed: %s", exc)
            continue

        if images:
            break

    logger.info("Strategy C: found %d raw results", len(images))
    return _deduplicate(images, limit)


def _parse_rss(text: str, results: list[ImageResult]):
    """Parse an RSS/XML feed for <media:content> or <enclosure> image URLs."""
    soup = BeautifulSoup(text, "html.parser")
    for tag in soup.find_all(["media:content", "enclosure"]):
        url = tag.get("url", "")
        if _is_valid_image_url(url) and _is_pinterest_image(url):
            results.append(ImageResult(url=url))
    # Also look for <img> in description CDATA
    for desc in soup.find_all("description"):
        urls = re.findall(r'src="(https?://i\.pinimg\.com/[^"]+)"', str(desc))
        for u in urls:
            if _is_valid_image_url(u):
                results.append(ImageResult(url=u))


# ---------------------------------------------------------------------------
# Orchestrator -- runs strategies in order, returns first good result set
# ---------------------------------------------------------------------------

def search_pinterest(query: str, limit: int = 20) -> list[dict]:
    """
    Run scraping strategies in order (A -> B -> C).  Returns as soon as
    one strategy yields results.  Merges partial results across strategies
    if individually they fall short of the requested limit.
    """
    all_images: list[ImageResult] = []
    strategies = [
        ("A (Google Images)", scrape_google_images),
        ("B (Pinterest HTML)", scrape_pinterest_search),
        ("C (Pinterest RSS/JSON)", scrape_pinterest_rss),
    ]

    for name, fn in strategies:
        try:
            results = fn(query, limit=limit)
            if results:
                logger.info("Strategy %s returned %d images", name, len(results))
                all_images.extend(results)
                if len(_deduplicate(all_images, limit)) >= limit:
                    break
        except Exception:
            logger.exception("Strategy %s failed", name)

        # Small politeness delay between strategies
        time.sleep(random.uniform(0.3, 0.8))

    final = _deduplicate(all_images, limit)
    logger.info(
        "search_pinterest(query=%r) returning %d images", query, len(final)
    )
    return [asdict(img) for img in final]
