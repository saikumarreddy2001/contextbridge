import logging
import os
import time

from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.routes.context import router as context_router
from app.api.routes.projects import router as projects_router
from app.services.ai.provider import provider_will_run

logger = logging.getLogger("contextbridge.api")

DEV_ORIGINS = ["http://127.0.0.1:43123", "http://localhost:43123"]


def cors_origins() -> list[str]:
    """Dev keeps the Vite origins. Production uses ALLOWED_ORIGINS and never `*`."""
    environment = os.environ.get("ENVIRONMENT", "").strip().lower()
    configured = [
        origin.strip()
        for origin in os.environ.get("ALLOWED_ORIGINS", "").split(",")
        if origin.strip() and origin.strip() != "*"
    ]
    if environment == "production":
        return configured
    if not os.environ.get("ALLOWED_ORIGINS", "").strip():
        return list(DEV_ORIGINS)
    return list(dict.fromkeys([*DEV_ORIGINS, *configured]))


app = FastAPI(title="ContextBridge reconstruction", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins(),
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)
app.include_router(projects_router, prefix="/api")
app.include_router(context_router, prefix="/api")


@app.middleware("http")
async def log_request(request: Request, call_next):
    started = time.perf_counter()
    response = await call_next(request)
    latency_ms = int((time.perf_counter() - started) * 1000)
    logger.info("path=%s status=%s latency_ms=%s", request.url.path, response.status_code, latency_ms)
    return response


@app.get("/health")
def health() -> dict:
    return {"status": "healthy", "service": "contextbridge-api"}


@app.get("/api/health")
def api_health() -> dict:
    return {"status": "ok"}


@app.get("/api/capabilities")
def capabilities() -> dict:
    return {
        "ai": provider_will_run(),
        "semanticSearch": True,
        "contextReconstruction": True,
    }


@app.exception_handler(HTTPException)
def http_error(_request: Request, exc: HTTPException) -> JSONResponse:
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail}, headers=exc.headers)


@app.exception_handler(RequestValidationError)
def invalid_request(_request: Request, _exc: RequestValidationError) -> JSONResponse:
    return JSONResponse(status_code=422, content={"detail": "The request was not valid."})


@app.exception_handler(Exception)
def unhandled_error(request: Request, exc: Exception) -> JSONResponse:
    logger.error("error path=%s type=%s", request.url.path, type(exc).__name__)
    return JSONResponse(status_code=500, content={"detail": "The request could not be completed."})
