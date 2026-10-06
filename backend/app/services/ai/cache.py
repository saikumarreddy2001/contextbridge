import hashlib

_cache: dict[str, dict] = {}


def cache_key(kind: str, event_ids: list[str], contents: list[str]) -> str:
    joined = kind + "\n" + "\n".join(sorted(event_ids)) + "\n" + "\n".join(contents)
    return hashlib.sha256(joined.encode("utf-8")).hexdigest()


def cache_get(key: str) -> dict | None:
    hit = _cache.get(key)
    return None if hit is None else dict(hit)


def cache_set(key: str, value: dict) -> dict:
    _cache[key] = dict(value)
    return value


def clear_cache() -> None:
    _cache.clear()
