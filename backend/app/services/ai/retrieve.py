import re

from app.models.events import NormalizedWorkEvent
from app.services.ai.embeddings import EXPANSIONS
from app.services.ai.models import ContextEvent, ContextRelationship, RetrievedContext
from app.services.reconstruction.pipeline import Reconstruction

_STOP = {
    "why",
    "did",
    "what",
    "is",
    "currently",
    "the",
    "a",
    "an",
    "my",
    "me",
    "while",
    "was",
    "were",
    "after",
    "which",
    "needs",
    "need",
    "you",
    "want",
    "understand",
    "how",
    "for",
    "and",
    "that",
    "this",
    "been",
    "from",
    "with",
    "have",
    "has",
    "into",
    "about",
    "does",
    "happened",
}
_TOKEN = re.compile(r"[a-z0-9+#.-]+")
_WHY_TYPES = {
    "decision_auth0",
    "decision_revised",
    "decision_custom",
    "problem_discovered",
    "pull_request",
    "requirement_recorded",
    "architecture_discussion",
}


def retrieve_events(question: str, reconstruction: Reconstruction, limit: int = 8) -> list[NormalizedWorkEvent]:
    """Keyword, entity, and story match. Never the full event log."""
    asked = question.lower()
    tokens = [token for token in _TOKEN.findall(asked) if token not in _STOP and len(token) > 2]
    expanded = set(tokens)
    for token in list(expanded):
        expanded.update(EXPANSIONS.get(token, []))
    names = {entity.id: entity.name.lower() for entity in reconstruction.entities}
    ranked: list[tuple[int, str, NormalizedWorkEvent]] = []
    for event in reconstruction.events:
        if event.event_type == "noise":
            continue
        entity_text = " ".join(names.get(entity_id, "") for entity_id in event.entity_ids)
        haystack = f"{event.title} {event.content} {event.event_type} {' '.join(event.actors)} {entity_text}".lower()
        title = event.title.lower()
        score = 0
        for term in expanded:
            needle = term.replace("-", " ")
            if term in title or needle in title:
                score += 3
            elif term in haystack or needle in haystack:
                score += 1
        for story in reconstruction.stories:
            if event.id in story.event_ids and any(term in story.title.lower() for term in expanded):
                score += 1
        if any(word in asked for word in ("why", "change", "changed", "decision", "auth0")) and event.event_type in _WHY_TYPES:
            score += 2
        if any(word in asked for word in ("block", "blocked", "payment")) and event.event_type in {
            "blocker_opened",
            "access_requested",
            "access_pending",
            "payment_scheduled",
        }:
            score += 3
        if any(word in asked for word in ("attention", "review", "alex")) and (
            event.event_type == "review_requested" or "Alex Morgan" in event.actors
        ):
            score += 3
        if score > 0:
            ranked.append((score, event.timestamp.isoformat(), event))
    ranked.sort(key=lambda item: (-item[0], item[1], item[2].id))
    return [event for _, _, event in ranked[:limit]]


def build_context(events: list[NormalizedWorkEvent], reconstruction: Reconstruction) -> RetrievedContext:
    allowed = {event.id for event in events}
    entity_ids = {entity_id for event in events for entity_id in event.entity_ids}
    relationships = [
        ContextRelationship(
            source_event_id=item.source_event_id,
            target_event_id=item.target_event_id,
            relationship_type=item.relationship_type,
        )
        for item in reconstruction.relationships
        if item.source_event_id in allowed and item.target_event_id in allowed
    ]
    return RetrievedContext(
        project_id=reconstruction.project_id,
        events=[
            ContextEvent(
                id=event.id,
                title=event.title,
                date=event.timestamp.date().isoformat(),
                actors=event.actors,
                event_type=event.event_type,
                source=event.source,
                content=event.content,
                entity_ids=event.entity_ids,
            )
            for event in events
        ],
        entities=[
            {"id": entity.id, "name": entity.name, "kind": entity.kind}
            for entity in reconstruction.entities
            if entity.id in entity_ids
        ],
        relationships=relationships,
    )
