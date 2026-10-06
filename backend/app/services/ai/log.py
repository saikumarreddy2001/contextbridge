import logging
import time

logger = logging.getLogger("contextbridge.ai")


def log_ai(
    request_type: str,
    provider: str,
    started: float,
    *,
    success: bool,
    fallback: bool = False,
    validation_failure: bool = False,
) -> None:
    latency_ms = int((time.perf_counter() - started) * 1000)
    logger.info(
        "ai request_type=%s provider=%s latency_ms=%s success=%s fallback=%s validation_failure=%s",
        request_type,
        provider,
        latency_ms,
        success,
        fallback,
        validation_failure,
    )
