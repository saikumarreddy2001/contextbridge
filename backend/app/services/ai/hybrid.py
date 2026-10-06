from app.services.ai.embeddings import cosine, embed_text, local_embedding
from app.services.ai.provider import get_provider
from app.services.reconstruction.pipeline import reconstruct
from app.services.reconstruction.present import search_records

# Hybrid score = 0.40 * keyword relevance + 0.35 * semantic similarity
# + 0.15 * importance + 0.10 * recency. Each part is 0..1 before weighting.
KEYWORD_WEIGHT = 0.40
SEMANTIC_WEIGHT = 0.35
IMPORTANCE_WEIGHT = 0.15
RECENCY_WEIGHT = 0.10

_IMPORTANCE = {
    "decision": 1.0,
    "requirement": 0.9,
    "problem": 0.85,
    "blocker": 0.8,
    "discussion": 0.55,
    "document": 0.55,
    "meeting": 0.5,
    "github": 0.5,
    "jira": 0.45,
    "task": 0.4,
    "person": 0.2,
}
_WINDOW_START = "2026-09-16"
_WINDOW_END = "2026-09-23"


def hybrid_search(
    project_id: str,
    query: str,
    type_name: str | None,
    person: str | None,
    status: str | None,
    start: str | None,
    end: str | None,
) -> dict:
    reconstruction = reconstruct(project_id)
    records = search_records(reconstruction.events, reconstruction.relationships)
    selected = [record for record in records if _filters(record, type_name, person, status, start, end)]
    terms = [term.lower() for term in query.split() if term]
    embed = _embedder()
    query_vector = embed_text(query, f"query:{query.lower()}", embed) if terms else []
    scored = []
    for record in selected:
        keyword = _keyword(record, terms)
        text = f"{record['title']} {record['snippet']}"
        semantic = cosine(query_vector, embed_text(text, f"record:{record['id']}", embed)) if query_vector else 0.0
        if semantic < 0:
            semantic = 0.0
        importance = _IMPORTANCE.get(record["type"], 0.3)
        recency = _recency(record["date"])
        score = (
            KEYWORD_WEIGHT * keyword
            + SEMANTIC_WEIGHT * semantic
            + IMPORTANCE_WEIGHT * importance
            + RECENCY_WEIGHT * recency
        )
        if terms and score <= 0:
            continue
        scored.append(
            {
                **record,
                "score": round(score, 4),
                "scoreBreakdown": {
                    "keyword": round(keyword, 4),
                    "semantic": round(semantic, 4),
                    "importance": round(importance, 4),
                    "recency": round(recency, 4),
                },
            }
        )
    scored.sort(key=lambda item: (-item["score"], item["date"], item["id"]))
    return {"query": query, "mode": "hybrid", "results": scored[:12]}


def _embedder():
    provider = get_provider()
    if provider is None:
        return local_embedding
    return provider.create_embedding


def _filters(record: dict, type_name: str | None, person: str | None, status: str | None, start: str | None, end: str | None) -> bool:
    if type_name and type_name not in {"", "all"}:
        if type_name in {"task", "tasks"} and record["type"] not in {"jira", "task"}:
            return False
        if type_name in {"code", "github"} and record["type"] != "github":
            return False
        if type_name in {"decision", "decisions"} and record["type"] != "decision":
            return False
        if type_name not in {"task", "tasks", "code", "github", "decision", "decisions", "all", ""} and record["type"] != type_name:
            return False
    if person and person not in {"", "all"} and person not in record["people"]:
        return False
    if status and status not in {"", "all"} and record["status"] != status:
        return False
    if start and record["date"] < start:
        return False
    if end and record["date"] > end:
        return False
    return True


def _keyword(record: dict, terms: list[str]) -> float:
    if not terms:
        return 0.0
    haystack = " ".join([record["title"], record["snippet"], record["status"], record["sourceLabel"], *record["people"]]).lower()
    hits = sum(1 for term in terms if term in haystack)
    return hits / len(terms)


def _recency(iso_date: str) -> float:
    if iso_date <= _WINDOW_START:
        return 0.0
    if iso_date >= _WINDOW_END:
        return 1.0
    start = _ordinal(_WINDOW_START)
    end = _ordinal(_WINDOW_END)
    current = _ordinal(iso_date)
    if end == start:
        return 1.0
    return (current - start) / (end - start)


def _ordinal(iso_date: str) -> int:
    year, month, day = (int(part) for part in iso_date.split("-"))
    return year * 372 + month * 31 + day
