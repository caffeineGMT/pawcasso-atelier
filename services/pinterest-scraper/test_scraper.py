#!/usr/bin/env python3
"""
Test script for the Pinterest scraper microservice.

Usage:
    # Unit-style tests (no running server required)
    python test_scraper.py

    # Integration test against a running server
    python test_scraper.py --live http://localhost:8100
"""

import argparse
import json
import sys

# --------------------------------------------------------------------------
# Unit / module-level tests (import the scraper directly)
# --------------------------------------------------------------------------


def test_imports():
    """Verify all modules can be imported without errors."""
    print("[TEST] Importing modules ... ", end="")
    from scraper import (
        search_pinterest,
        scrape_google_images,
        scrape_pinterest_search,
        scrape_pinterest_rss,
        ImageResult,
        _is_valid_image_url,
        _is_pinterest_image,
        _upgrade_pinimg_url,
        _deduplicate,
    )
    from app import app  # noqa: F401

    print("OK")


def test_is_valid_image_url():
    """Check the URL validation helper."""
    from scraper import _is_valid_image_url

    print("[TEST] _is_valid_image_url ... ", end="")

    assert _is_valid_image_url("https://i.pinimg.com/736x/ab/cd/ef.jpg") is True
    assert _is_valid_image_url("") is False
    assert _is_valid_image_url("data:image/png;base64,...") is False
    assert _is_valid_image_url("https://gstatic.com/images/x.png") is False
    assert _is_valid_image_url("not-a-url") is False
    assert _is_valid_image_url("https://example.com/favicon.ico") is False

    print("OK")


def test_is_pinterest_image():
    """Check Pinterest domain detection."""
    from scraper import _is_pinterest_image

    print("[TEST] _is_pinterest_image ... ", end="")

    assert _is_pinterest_image("https://i.pinimg.com/736x/ab/cd/ef.jpg") is True
    assert _is_pinterest_image("https://example.com/photo.jpg") is False
    assert _is_pinterest_image("https://www.pinterest.com/pin/123") is True

    print("OK")


def test_upgrade_pinimg_url():
    """Verify thumbnail URL upgrade logic."""
    from scraper import _upgrade_pinimg_url

    print("[TEST] _upgrade_pinimg_url ... ", end="")

    original = "https://i.pinimg.com/236x/ab/cd/ef.jpg"
    upgraded = _upgrade_pinimg_url(original)
    assert "/736x/" in upgraded, f"Expected /736x/ in {upgraded}"

    already_big = "https://i.pinimg.com/originals/ab/cd/ef.jpg"
    assert _upgrade_pinimg_url(already_big) == already_big

    print("OK")


def test_deduplicate():
    """Verify deduplication and limit enforcement."""
    from scraper import _deduplicate, ImageResult

    print("[TEST] _deduplicate ... ", end="")

    items = [
        ImageResult(url="https://a.com/1.jpg"),
        ImageResult(url="https://a.com/2.jpg"),
        ImageResult(url="https://a.com/1.jpg"),  # duplicate
        ImageResult(url="https://a.com/3.jpg"),
    ]
    result = _deduplicate(items, limit=10)
    assert len(result) == 3, f"Expected 3, got {len(result)}"

    result_limited = _deduplicate(items, limit=2)
    assert len(result_limited) == 2, f"Expected 2, got {len(result_limited)}"

    print("OK")


def test_search_returns_list():
    """
    Run an actual search (hits the network).
    This is a smoke test -- it may return 0 results if Google/Pinterest
    blocks the request, which is acceptable.
    """
    from scraper import search_pinterest

    print("[TEST] search_pinterest (live network call) ... ", end="")

    results = search_pinterest("watercolor cat painting", limit=5)
    assert isinstance(results, list), f"Expected list, got {type(results)}"

    for item in results:
        assert "url" in item, f"Missing 'url' key in {item}"
        assert "source" in item, f"Missing 'source' key in {item}"
        assert item["url"].startswith("http"), f"Bad URL: {item['url']}"

    print(f"OK ({len(results)} images found)")
    if results:
        print(f"       Sample: {results[0]['url'][:80]}...")


# --------------------------------------------------------------------------
# Integration tests (against a running server)
# --------------------------------------------------------------------------


def test_live_server(base_url: str):
    """Hit the actual HTTP endpoints and verify response shapes."""
    import requests as req

    print(f"\n=== Integration tests against {base_url} ===\n")

    # Health check
    print("[LIVE] GET /health ... ", end="")
    r = req.get(f"{base_url}/health", timeout=5)
    assert r.status_code == 200, f"Status {r.status_code}"
    body = r.json()
    assert body.get("status") == "ok", f"Unexpected body: {body}"
    print("OK")

    # Search endpoint
    print("[LIVE] GET /search?q=dog+portrait+painting&limit=5 ... ", end="")
    r = req.get(
        f"{base_url}/search",
        params={"q": "dog portrait painting", "limit": 5},
        timeout=30,
    )
    assert r.status_code == 200, f"Status {r.status_code}"
    body = r.json()
    assert "query" in body, f"Missing 'query' in response"
    assert "images" in body, f"Missing 'images' in response"
    assert isinstance(body["images"], list), "images should be a list"
    print(f"OK ({len(body['images'])} images)")
    print(f"       Response:\n{json.dumps(body, indent=2)[:500]}")

    # Missing query parameter
    print("[LIVE] GET /search (no query) ... ", end="")
    r = req.get(f"{base_url}/search", timeout=5)
    assert r.status_code == 422, f"Expected 422, got {r.status_code}"
    print("OK (422 as expected)")

    # Limit validation
    print("[LIVE] GET /search?q=test&limit=0 ... ", end="")
    r = req.get(
        f"{base_url}/search",
        params={"q": "test", "limit": 0},
        timeout=5,
    )
    assert r.status_code == 422, f"Expected 422, got {r.status_code}"
    print("OK (422 as expected)")

    print("\n=== All integration tests passed ===")


# --------------------------------------------------------------------------
# Main
# --------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="Test the Pinterest scraper service"
    )
    parser.add_argument(
        "--live",
        metavar="URL",
        help="Run integration tests against a live server (e.g. http://localhost:8100)",
    )
    parser.add_argument(
        "--skip-network",
        action="store_true",
        help="Skip tests that make real network requests",
    )
    args = parser.parse_args()

    print("=== Pinterest Scraper Tests ===\n")

    # Always run pure unit tests
    test_imports()
    test_is_valid_image_url()
    test_is_pinterest_image()
    test_upgrade_pinimg_url()
    test_deduplicate()

    if not args.skip_network:
        test_search_returns_list()
    else:
        print("[SKIP] Skipping network tests (--skip-network)")

    if args.live:
        test_live_server(args.live)

    print("\n=== All tests passed ===")


if __name__ == "__main__":
    main()
