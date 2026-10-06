from pydantic import ValidationError

from app.services.ai.models import AIAnswer, AIChangeExplanation, AIRelationshipCandidate, AIStorySummary


def _known(ids: list[str], allowed: set[str]) -> list[str]:
    return [item for item in ids if item in allowed]


def validate_explanation(payload: object, allowed_events: set[str]) -> AIChangeExplanation | None:
    try:
        model = payload if isinstance(payload, AIChangeExplanation) else AIChangeExplanation.model_validate(payload)
    except ValidationError:
        return None
    model.supporting_event_ids = _known(model.supporting_event_ids, allowed_events)
    if not model.supporting_event_ids or not model.summary.strip():
        return None
    return model


def validate_summary(payload: object, allowed_events: set[str]) -> AIStorySummary | None:
    try:
        model = payload if isinstance(payload, AIStorySummary) else AIStorySummary.model_validate(payload)
    except ValidationError:
        return None
    model.supporting_event_ids = _known(model.supporting_event_ids, allowed_events)
    if not model.supporting_event_ids or not model.headline.strip():
        return None
    return model


def validate_answer(payload: object, allowed_events: set[str], allowed_entities: set[str]) -> AIAnswer | None:
    try:
        model = payload if isinstance(payload, AIAnswer) else AIAnswer.model_validate(payload)
    except ValidationError:
        return None
    model.supporting_event_ids = _known(model.supporting_event_ids, allowed_events)
    model.related_entity_ids = _known(model.related_entity_ids, allowed_entities)
    if model.insufficient_evidence:
        model.supporting_event_ids = _known(model.supporting_event_ids, allowed_events)
        return model
    if not model.supporting_event_ids or not model.answer.strip():
        model.insufficient_evidence = True
        model.answer = ""
        model.supporting_event_ids = []
    return model


def validate_candidates(payload: object, allowed_events: set[str]) -> list[AIRelationshipCandidate]:
    if not isinstance(payload, list):
        return []
    kept: list[AIRelationshipCandidate] = []
    for item in payload:
        try:
            model = item if isinstance(item, AIRelationshipCandidate) else AIRelationshipCandidate.model_validate(item)
        except ValidationError:
            continue
        if model.source_event_id not in allowed_events or model.target_event_id not in allowed_events:
            continue
        model.supporting_event_ids = _known(model.supporting_event_ids, allowed_events)
        if not model.supporting_event_ids:
            continue
        kept.append(model)
    return kept
