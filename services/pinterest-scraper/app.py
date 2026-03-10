"""
Pinterest Image Scraper -- FastAPI microservice.

Designed to be called by n8n automation workflows.
Single endpoint: GET /search?q={query}&limit={limit}
"""

import logging
import os
from typing import Optional

from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from scraper import search_pinterest

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(
    level=LOG_LEVEL,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------
app = FastAPI(
    title="Pinterest Image Scraper",
    description=(
        "Lightweight microservice that scrapes Pinterest for art reference "
        "images.  Intended to be called by n8n automation workflows."
    ),
    version="1.0.0",
)

# Allow n8n (or any local caller) to hit this service without CORS issues.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------
@app.get("/health")
async def health():
    return {"status": "ok"}


# ---------------------------------------------------------------------------
# Main search endpoint
# ---------------------------------------------------------------------------
@app.get("/search")
async def search(
    q: str = Query(
        ...,
        min_length=1,
        max_length=200,
        description="Search query for Pinterest images",
    ),
    limit: Optional[int] = Query(
        20,
        ge=1,
        le=100,
        description="Maximum number of images to return",
    ),
):
    """
    Search Pinterest for images matching the query.

    Returns a JSON payload with the query and a list of image objects,
    each containing a ``url`` and ``source`` field.
    """
    logger.info("GET /search  q=%r  limit=%d", q, limit)

    try:
        images = search_pinterest(query=q, limit=limit)
    except Exception:
        logger.exception("Unhandled error during scraping")
        raise HTTPException(
            status_code=502,
            detail="All scraping strategies failed. Pinterest or Google may be blocking requests.",
        )

    if not images:
        logger.warning("No images found for query=%r", q)
        return JSONResponse(
            status_code=200,
            content={
                "query": q,
                "images": [],
                "message": (
                    "No images found. The upstream sources may be rate-limiting "
                    "or blocking automated requests."
                ),
            },
        )

    return {
        "query": q,
        "images": images,
    }


# ---------------------------------------------------------------------------
# Entrypoint (for running directly with `python app.py`)
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    import uvicorn

    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8100"))
    uvicorn.run(app, host=host, port=port)
