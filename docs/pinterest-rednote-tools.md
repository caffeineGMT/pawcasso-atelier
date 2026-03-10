# Pinterest & RedNote/Xiaohongshu Image Scraping Tools Research

> Research date: 2026-03-09
> Purpose: Find open-source tools to search Pinterest and RedNote for style reference
> images (e.g. "Renaissance pet portrait oil painting") for AI image generation.

---

## Table of Contents

1. [Pinterest Tools](#pinterest-tools)
   - [pinscrape (RECOMMENDED)](#1-pinscrape-recommended)
   - [py3-pinterest](#2-py3-pinterest)
   - [Pinterest-infinite-crawler](#3-pinterest-infinite-crawler)
   - [pinterest-web-scraper](#4-pinterest-web-scraper)
   - [social-media-profile-scrapers](#5-social-media-profile-scrapers)
   - [pinterest-image-scrap](#6-pinterest-image-scrap)
2. [RedNote/Xiaohongshu Tools](#rednotexiaohongshu-tools)
   - [xhs (RECOMMENDED)](#1-xhs-recommended)
   - [MediaCrawler](#2-mediacrawler)
   - [redbooks](#3-redbooks)
3. [Comparison Matrix](#comparison-matrix)
4. [Recommendation for Pawcasso](#recommendation-for-pawcasso)

---

## Pinterest Tools

### 1. pinscrape (RECOMMENDED)

| Field | Value |
|-------|-------|
| **GitHub** | https://github.com/iamatulsingh/pinscrape |
| **Stars** | ~133 |
| **License** | MIT |
| **Last Release** | v5.1.0 (January 22, 2026) |
| **API Key Required** | No |
| **Pinterest Login Required** | No |
| **Install** | `pip install pinscrape` |

**Why this is the top pick:** Simple pip-installable library, actively maintained (2026
release), no API key or login needed, returns image URLs directly, supports keyword
search out of the box.

**Usage Example:**

```python
from pinscrape import Pinterest

# Initialize (no credentials needed)
p = Pinterest(proxies={}, sleep_time=2)

# Search by keyword -- returns list of image URLs
images_url = p.search("Renaissance pet portrait oil painting", 20)

# images_url is a list of direct image URLs you can use as style references
for url in images_url:
    print(url)

# Optional: download images locally
p.download(
    url_list=images_url,
    number_of_workers=10,
    output_folder="output"
)

# Optional: get board details
board_details = p.get_pin_details(username='canva', board='design-trends')
```

**Key Points:**
- Returns image URLs without downloading (perfect for our use case)
- `p.search(keyword, count)` returns a plain list of URLs
- Multi-threaded download support if we ever need local copies
- Proxy support for avoiding rate limits
- Configurable sleep time between requests
- No browser/Selenium dependency -- pure HTTP requests

---

### 2. py3-pinterest

| Field | Value |
|-------|-------|
| **GitHub** | https://github.com/bstoilov/py3-pinterest |
| **Stars** | ~358 |
| **License** | MIT |
| **Last Commit** | June 2024 |
| **API Key Required** | No (unofficial API) |
| **Pinterest Login Required** | YES (email + password) |
| **Install** | `pip install py3-pinterest` |

**Why it's notable:** Most popular Pinterest library by stars. Full Pinterest API
coverage including visual search. However, requires a Pinterest account login.

**Usage Example:**

```python
from py3pin.Pinterest import Pinterest

pinterest = Pinterest(
    email='your.email@example.com',
    password='your_password',
    username='your_username',
    cred_root='./pinterest_credentials'
)

# Search for pins by keyword
search_results = pinterest.search(scope='pins', query='Renaissance pet portrait oil painting')

# Visual search (find similar images to a specific pin)
pin_data = pinterest.load_pin(pin_id='some_pin_id')
similar = pinterest.visual_search(pin_data, x=10, y=50, w=100, h=100)

# Other useful methods
boards = pinterest.boards()
feed = pinterest.home_feed()
```

**Key Points:**
- Requires Chrome browser installed (Selenium for login/reCAPTCHA)
- Cookies valid for ~15 days after login
- Visual search feature is unique and powerful for finding style references
- Rate limits: ~300 follow actions/day
- More complex setup but more powerful features
- Not updated since mid-2024; may have compatibility issues

---

### 3. Pinterest-infinite-crawler

| Field | Value |
|-------|-------|
| **GitHub** | https://github.com/mirusu400/Pinterest-infinite-crawler |
| **Stars** | ~89 |
| **License** | MIT |
| **Last Release** | v1.1 (September 2021) |
| **API Key Required** | No |
| **Pinterest Login Required** | YES (email + password) |
| **Install** | `git clone` + `pip install -r requirements.txt` |

**Usage Example:**

```bash
# Clone and install
git clone https://github.com/mirusu400/Pinterest-infinite-crawler.git
cd Pinterest-infinite-crawler
pip install -r requirements.txt

# Run with arguments
python main.py -e your_email@example.com -p password -d ./images -l "https://pinterest.com/search/pins/?q=Renaissance+pet+portrait" -g 50

# Or batch mode via batch.json
python main.py -b
```

**Key Points:**
- Requires Pinterest credentials and Chrome + ChromeDriver
- Selenium-based (infinite scroll simulation)
- Good for bulk downloading from search result pages or boards
- Downloads JPG only (no video support)
- Older project (2021), may need updates for current Pinterest layout
- Not ideal for our use case (CLI-focused, no library API)

---

### 4. pinterest-web-scraper

| Field | Value |
|-------|-------|
| **GitHub** | https://github.com/SwatiModi/pinterest-web-scraper |
| **Stars** | ~38 |
| **License** | Not specified |
| **API Key Required** | No |
| **Pinterest Login Required** | No |
| **Install** | `git clone` + `pip install -r requirements.txt` + ChromeDriver |

**Usage Example:**

```bash
# Search for images by category/keyword
python pinterest.py --category "Renaissance pet portrait oil painting"

# Download visually similar images
python dowload_similar_images.py
```

**Key Points:**
- Unique feature: finds visually similar images (useful for style matching)
- Outputs CSV with pin URLs
- Organizes downloaded images in folders by source pin
- Requires ChromeDriver setup
- Older project, may need maintenance

---

### 5. social-media-profile-scrapers

| Field | Value |
|-------|-------|
| **GitHub** | https://github.com/shaikhsajid1111/social-media-profile-scrapers |
| **Stars** | ~518 |
| **License** | Not specified |
| **API Key Required** | No |
| **Pinterest Login Required** | No |
| **Install** | `pip install -r requirement.txt` |

**Usage:**

```bash
# Scrape Pinterest user profile
python pinterest.py username
```

**Key Points:**
- Multi-platform scraper (Instagram, Facebook, Twitter, Pinterest, etc.)
- Pinterest module is simpler -- profile-focused, not keyword search
- No browser needed for Pinterest (unlike other platform scrapers)
- Not ideal for keyword-based image search

---

### 6. pinterest-image-scrap

| Field | Value |
|-------|-------|
| **GitHub** | https://github.com/iamatulsingh/pinterest-image-scrap |
| **Stars** | ~73 |
| **License** | MIT |
| **API Key Required** | No |
| **Pinterest Login Required** | No |
| **Install** | `pip install -r requirements.txt` |

**Usage Example:**

```python
from pinterest import PinterestImageScraper

p_scraper = PinterestImageScraper()
is_downloaded = p_scraper.make_ready("Renaissance pet portrait oil painting")
```

**Key Points:**
- Same author as pinscrape (this is the predecessor)
- Uses BeautifulSoup for HTML parsing
- Author recommends using `pinscrape` instead (newer, cleaner API)
- No API key needed

---

## RedNote/Xiaohongshu Tools

### 1. xhs (RECOMMENDED)

| Field | Value |
|-------|-------|
| **GitHub** | https://github.com/ReaJason/xhs |
| **Stars** | ~2,100 |
| **License** | MIT |
| **API Key Required** | No |
| **Login/Cookies Required** | YES (3 cookie fields: `a1`, `web_session`, `webId`) |
| **Install** | `pip install xhs` |

**Why it's the top pick for XHS:** Most popular and actively maintained XHS library.
Clean pip-installable package. Supports keyword search and note retrieval.

**Setup Requirements:**

```bash
pip install xhs
pip install playwright
playwright install
# Download stealth.min.js for anti-detection
```

**Authentication:**
You must provide three cookie fields obtained from a logged-in browser session:
- `a1`
- `web_session`
- `webId`

**Capabilities:**
- Keyword-based note/post searching
- Note/post detail retrieval (includes image URLs)
- User profile and follower data
- Like, bookmark, comment actions
- Creator tools (publishing)
- Homepage feed crawling

**Key Points:**
- Requires Playwright for browser-based signature generation
- Can be deployed as a Flask-based signature service for multi-account use
- Docker deployment option available
- Documentation primarily in Chinese
- Active development with 188+ commits
- Legal disclaimer: web scraping may violate platform TOS

---

### 2. MediaCrawler

| Field | Value |
|-------|-------|
| **GitHub** | https://github.com/NanmiCoder/MediaCrawler |
| **Stars** | ~45,200 (!) |
| **License** | Not specified |
| **API Key Required** | No |
| **Login Required** | YES (QR code login) |
| **Install** | Uses `uv` package manager |

**Supported Platforms:** Xiaohongshu, Douyin, Kuaishou, Bilibili, Weibo, Baidu Tieba,
Zhihu. (Does NOT support Pinterest.)

**Setup:**

```bash
cd MediaCrawler
uv sync
uv run playwright install
```

**Usage:**

```bash
# Search Xiaohongshu by keyword
uv run main.py --platform xhs --lt qrcode --type search

# Get specific post details
uv run main.py --platform xhs --lt qrcode --type detail
```

**Key Points:**
- Massively popular (45k+ stars) -- most battle-tested option
- Supports keyword search across all platforms
- Uses Playwright browser automation
- QR code login (scan with phone)
- Has a WebUI at http://localhost:8080
- SQLite storage, Excel export
- Proxy pool support
- Designed for learning/research only; prohibits commercial use
- Documentation in Chinese
- Heavier setup than `xhs` library but more comprehensive

---

### 3. redbooks

| Field | Value |
|-------|-------|
| **GitHub** | https://github.com/xiaofuqing13/redbooks |
| **Stars** | ~4 |
| **License** | MIT |
| **Last Update** | February 2026 |
| **API Key Required** | No |
| **Login Required** | YES (browser-based) |
| **Install** | `pip install -r requirements.txt` |

**Usage:**

```bash
python crawler_ultimate.py
```

**Key Points:**
- GUI application (not a library)
- Keyword search, homepage feed, creator profile crawling
- Batch image and video downloading
- SQLite storage with Excel export
- Built-in image preview
- Uses DrissionPage for browser automation
- Windows 10/11 focused (may work on macOS with adjustments)
- Very small community (4 stars)
- Recently updated (Feb 2026)

---

## Comparison Matrix

| Tool | Platform | Stars | pip install | No Login | Keyword Search | Returns URLs | Active (2025+) |
|------|----------|-------|-------------|----------|----------------|-------------|-----------------|
| **pinscrape** | Pinterest | 133 | Yes | Yes | Yes | Yes | Yes (Jan 2026) |
| py3-pinterest | Pinterest | 358 | Yes | No | Yes | Yes | No (Jun 2024) |
| Pinterest-infinite-crawler | Pinterest | 89 | No | No | Yes | No (downloads) | No (2021) |
| pinterest-web-scraper | Pinterest | 38 | No | Yes | Yes | CSV | No |
| social-media-profile-scrapers | Pinterest+ | 518 | No | Yes | No (profile only) | Yes | Yes |
| pinterest-image-scrap | Pinterest | 73 | No | Yes | Yes | No (downloads) | No |
| **xhs** | Xiaohongshu | 2.1k | Yes | No | Yes | Yes | Yes |
| MediaCrawler | XHS+6 more | 45.2k | No | No | Yes | Yes | Yes |
| redbooks | Xiaohongshu | 4 | No | No | Yes | Yes | Yes (Feb 2026) |

---

## Recommendation for Pawcasso

### Pinterest: Use `pinscrape`

```bash
pip install pinscrape
```

**Integration sketch:**

```python
from pinscrape import Pinterest

def search_pinterest_references(query: str, count: int = 20) -> list[str]:
    """Search Pinterest for style reference image URLs."""
    p = Pinterest(proxies={}, sleep_time=2)
    image_urls = p.search(query, count)
    return image_urls

# Example usage for Pawcasso
refs = search_pinterest_references("Renaissance pet portrait oil painting", 10)
# refs is a list of direct image URLs ready to use as style references
```

**Pros:**
- Zero configuration, no API key, no login
- Returns URLs directly (no need to download)
- pip-installable, actively maintained
- Perfect for our use case: keyword -> image URLs -> style reference

**Cons:**
- No official API (may break if Pinterest changes their site)
- Rate limiting possible without proxies
- Image quality/relevance depends on Pinterest search ranking

### Xiaohongshu (Optional/Future): Use `xhs`

```bash
pip install xhs
```

**Caveat:** Requires manual cookie extraction from a logged-in browser session. More
complex setup. Best suited as a future enhancement, not a v1 requirement.

If we want a heavier but more robust XHS solution, MediaCrawler (45k stars) is the
most battle-tested option but requires QR-code phone login and has a more complex
deployment.

### Suggested Priority

1. **Phase 1:** Integrate `pinscrape` for Pinterest keyword search (simplest, no auth)
2. **Phase 2:** Optionally add `xhs` for Xiaohongshu if Chinese art reference styles
   are needed (requires cookie management)
3. **Phase 3:** Consider `py3-pinterest` if we need visual similarity search
   (find images similar to a given reference)
