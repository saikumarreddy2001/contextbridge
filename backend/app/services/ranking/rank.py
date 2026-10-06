from app.models.domain import Change
from app.models.events import NormalizedWorkEvent

CATEGORY_WEIGHTS = {
    "decision_changed": (5, "Decision changed"),
    "requirement_changed": (4, "Requirement changed"),
    "blocker_created": (4, "Blocker created"),
}


def score_change(change: Change, events: list[NormalizedWorkEvent]) -> tuple[int, list[str]]:
    by_id = {event.id: event for event in events}
    score = 0
    reasons: list[str] = []
    if change.category in CATEGORY_WEIGHTS:
        weight, label = CATEGORY_WEIGHTS[change.category]
        score += weight
        reasons.append(f"{label} (+{weight})")
    if "entity-alex-morgan" in change.related_entity_ids or change.category == "action_required":
        score += 3
        reasons.append("User directly affected (+3)")
    sources = {by_id[event_id].source for event_id in change.source_ids if event_id in by_id}
    if len(sources) > 1:
        score += 2
        reasons.append("Multiple source types (+2)")
    if change.category in {"blocker_created", "unresolved_discussion"}:
        score += 2
        reasons.append("Unresolved (+2)")
    return score, reasons


def noise_importance(event: NormalizedWorkEvent) -> int:
    if event.event_type == "noise":
        return 0
    return 1
