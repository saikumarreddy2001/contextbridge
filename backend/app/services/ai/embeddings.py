import hashlib
import json
import math
import re
from pathlib import Path

# Concept axes. Synonyms fold onto these so "login architecture problems"
# sits near authentication, Auth0, SSO, and token-refresh without those words.
CONCEPTS = [
    "authentication",
    "sso",
    "auth0",
    "token-refresh",
    "payment",
    "api-contract",
    "decision",
    "requirement",
    "blocker",
    "implementation",
    "alex",
    "architecture",
]

EXPANSIONS: dict[str, list[str]] = {
    "login": ["authentication", "sso", "auth0"],
    "logins": ["authentication", "sso"],
    "signin": ["authentication"],
    "sign-in": ["authentication"],
    "architecture": ["authentication", "auth0", "sso", "architecture"],
    "problem": ["token-refresh"],
    "problems": ["token-refresh"],
    "limitation": ["token-refresh"],
    "limitations": ["token-refresh"],
    "issue": ["token-refresh"],
    "issues": ["token-refresh"],
    "blocked": ["blocker", "payment"],
    "blocks": ["blocker", "payment"],
    "blocker": ["blocker", "payment"],
    "sandbox": ["payment", "blocker"],
    "sso": ["sso", "authentication"],
    "auth0": ["auth0", "authentication", "sso"],
    "token": ["token-refresh"],
    "refresh": ["token-refresh"],
    "authentication": ["authentication", "sso"],
    "decision": ["decision"],
    "decisions": ["decision"],
    "requirement": ["requirement", "sso"],
    "requirements": ["requirement", "sso"],
    "payment": ["payment"],
    "payments": ["payment"],
    "alex": ["alex"],
}

HASH_DIMS = 16
VECTOR_DIM = len(CONCEPTS) + HASH_DIMS

_TOKEN = re.compile(r"[a-z0-9][a-z0-9+#.-]*")


def content_hash(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def local_embedding(text: str) -> list[float]:
    """Deterministic vector. No network. Used by the mock provider and as the keyless fallback."""
    vector = [0.0] * VECTOR_DIM
    tokens = _TOKEN.findall(text.lower())
    expanded: list[str] = []
    for token in tokens:
        expanded.append(token)
        expanded.extend(EXPANSIONS.get(token, []))
    for token in expanded:
        if token in CONCEPTS:
            vector[CONCEPTS.index(token)] += 1.0
        else:
            bucket = int(hashlib.sha256(token.encode("utf-8")).hexdigest(), 16) % HASH_DIMS
            vector[len(CONCEPTS) + bucket] += 0.35
    norm = math.sqrt(sum(value * value for value in vector))
    if norm == 0:
        return vector
    return [value / norm for value in vector]


def cosine(left: list[float], right: list[float]) -> float:
    if not left or not right or len(left) != len(right):
        return 0.0
    return sum(a * b for a, b in zip(left, right, strict=False))


class EmbeddingStore:
    def __init__(self, path: Path | None = None):
        self.path = path
        self.rows: dict[str, dict] = {}
        if path and path.exists():
            loaded = json.loads(path.read_text(encoding="utf-8"))
            if isinstance(loaded, dict):
                self.rows = loaded

    def get(self, item_id: str, digest: str) -> list[float] | None:
        row = self.rows.get(item_id)
        if not row or row.get("content_hash") != digest:
            return None
        embedding = row.get("embedding")
        return list(embedding) if isinstance(embedding, list) else None

    def put(self, item_id: str, digest: str, embedding: list[float]) -> None:
        self.rows[item_id] = {"id": item_id, "content_hash": digest, "embedding": embedding}
        if self.path:
            self.path.parent.mkdir(parents=True, exist_ok=True)
            self.path.write_text(json.dumps(self.rows), encoding="utf-8")


_store: EmbeddingStore | None = None


def get_store() -> EmbeddingStore:
    global _store
    if _store is None:
        _store = EmbeddingStore(Path(__file__).resolve().parents[2] / "data" / "embedding-index.json")
    return _store


def reset_store(path: Path | None = None) -> EmbeddingStore:
    global _store
    _store = EmbeddingStore(path)
    return _store


def embed_text(text: str, item_id: str, embedder) -> list[float]:
    digest = content_hash(text)
    cached = get_store().get(item_id, digest)
    if cached is not None:
        return cached
    vector = embedder(text)
    get_store().put(item_id, digest, vector)
    return vector
