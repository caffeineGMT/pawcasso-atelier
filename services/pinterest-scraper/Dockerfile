FROM python:3.12-slim

LABEL maintainer="pawcasso-atelier"
LABEL description="Pinterest image scraper microservice"

WORKDIR /app

# Install dependencies first for better Docker layer caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Non-root user for security
RUN adduser --disabled-password --gecos "" appuser
USER appuser

EXPOSE 8100

ENV HOST=0.0.0.0
ENV PORT=8100
ENV LOG_LEVEL=INFO

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8100"]
