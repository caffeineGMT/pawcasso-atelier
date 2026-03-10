# Pinterest Image Scraper

Lightweight FastAPI microservice that scrapes Pinterest for art reference images. Designed to be called by n8n automation workflows as part of the Pawcasso Atelier pipeline.

## How It Works

The service tries three scraping strategies in order and returns results from the first one that succeeds:

| Strategy | Method | Notes |
|----------|--------|-------|
| A | Google Image Search (`site:pinterest.com`) | Most reliable; extracts pinimg URLs from Google's response |
| B | Pinterest search page HTML parsing | Parses embedded JSON and `<img>` tags from Pinterest directly |
| C | Pinterest RSS / JSON endpoints | Tries unofficial API-style endpoints |

Results are deduplicated and capped at the requested `limit`.

## Setup

### Local (Python)

```bash
cd services/pinterest-scraper

# Create a virtual environment (recommended)
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python app.py
# or
uvicorn app:app --host 0.0.0.0 --port 8100 --reload
```

### Docker

```bash
cd services/pinterest-scraper

# Build
docker build -t pinterest-scraper .

# Run
docker run -d -p 8100:8100 --name pinterest-scraper pinterest-scraper
```

## API

### `GET /health`

Health check endpoint.

```json
{"status": "ok"}
```

### `GET /search?q={query}&limit={limit}`

Search Pinterest for images matching the query.

**Parameters:**

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `q` | string | yes | - | Search query (1-200 chars) |
| `limit` | int | no | 20 | Max images to return (1-100) |

**Response (200):**

```json
{
  "query": "watercolor cat painting",
  "images": [
    {
      "url": "https://i.pinimg.com/736x/ab/cd/ef.jpg",
      "source": "pinterest",
      "width": null,
      "height": null
    }
  ]
}
```

**Response (200, no results):**

```json
{
  "query": "...",
  "images": [],
  "message": "No images found. The upstream sources may be rate-limiting or blocking automated requests."
}
```

**Response (502):**

Returned when all scraping strategies throw unrecoverable errors.

## n8n Integration

In your n8n workflow, add an **HTTP Request** node:

- **Method:** GET
- **URL:** `http://pinterest-scraper:8100/search`
- **Query Parameters:**
  - `q`: `{{ $json.search_term }}`
  - `limit`: `10`

The response `images` array can then be fed into downstream nodes for downloading, processing, or style transfer.

## Testing

```bash
# Unit tests only (no network)
python test_scraper.py --skip-network

# Unit tests + live network smoke test
python test_scraper.py

# Full integration test (start the server first)
python app.py &
python test_scraper.py --live http://localhost:8100
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `HOST` | `0.0.0.0` | Bind address |
| `PORT` | `8100` | Bind port |
| `LOG_LEVEL` | `INFO` | Logging level (`DEBUG`, `INFO`, `WARNING`, `ERROR`) |

## Caveats

- Google and Pinterest actively block automated scraping. Results may be empty if requests are rate-limited.
- This service is intended for personal/hobby use in the Pawcasso Atelier pipeline. Do not use it for high-volume commercial scraping.
- Consider adding a proxy rotation layer if you need more reliable results at scale.
