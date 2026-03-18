FROM python:3.12-slim AS builder

WORKDIR /build
COPY requirements.txt .

RUN pip install --no-cache-dir --prefix=/install -r requirements.txt


FROM python:3.12-slim AS runtime

# Security: non-root user
RUN groupadd --gid 1001 worker \
 && useradd  --uid 1001 --gid worker --shell /bin/sh --create-home worker

WORKDIR /app

# Copy installed packages from builder stage
COPY --from=builder /install /usr/local

# Copy worker source — only what's needed at runtime
COPY --chown=worker:worker worker.py .

USER worker


ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1


CMD ["python", "-u", "worker.py"]