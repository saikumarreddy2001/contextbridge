import time

WINDOW_SECONDS = 60
LIMIT = 20
MAX_QUESTION_LENGTH = 500

_hits: dict[str, list[float]] = {}


def reset_limits() -> None:
    _hits.clear()


def allow(ip: str) -> bool:
    now = time.monotonic()
    recent = [stamp for stamp in _hits.get(ip, []) if now - stamp < WINDOW_SECONDS]
    if len(recent) >= LIMIT:
        _hits[ip] = recent
        return False
    recent.append(now)
    _hits[ip] = recent
    return True
