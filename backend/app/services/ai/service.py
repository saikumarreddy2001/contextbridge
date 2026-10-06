import time

from app.services.ai.cache import cache_get, cache_key, cache_set
from app.services.ai.log import log_ai
from app.services.ai.models import RetrievedContext
from app.services.ai.provider import get_provider
from app.services.ai.retrieve import build_context, retrieve_events
from app.services.ai.validate import validate_answer, validate_candidates, validate_explanation, validate_summary
from app.services.reconstruction.pipeline import reconstruct
from app.services.reconstruction.present import EDGE_LABELS, GRAPH_NODE_IDS

FALLBACK = "AI explanation is temporarily unavailable. Showing the reconstructed project evidence instead."
INSUFFICIENT = "ContextBridge doesn't have enough project evidence to answer this confidently."


def enrich_catch_up(project_id: str, payload: dict) -> dict:
    provider = get_provider()
    if provider is None:
        return payload
    reconstruction = reconstruct(project_id)
    changes = {change.id: change for change in reconstruction.changes}
    for item in payload.get("catchUpItems", []):
        change = changes.get(item.get("id"))
        if not change:
            continue
        explanation = _cached_explanation(project_id, change.source_ids, "catch-up-summary")
        if explanation and explanation.get("available"):
            item["aiSummary"] = explanation["summary"]
    return payload


def explain_change(project_id: str, change_id: str) -> dict | None:
    reconstruction = reconstruct(project_id)
    change = next((item for item in reconstruction.changes if item.id == change_id), None)
    if change is None:
        return None
    return _cached_explanation(project_id, change.source_ids, "explain-change")


def story_summary(project_id: str, story_id: str) -> dict | None:
    reconstruction = reconstruct(project_id)
    story = next((item for item in reconstruction.stories if item.id == story_id), None)
    if story is None:
        return None
    provider = get_provider()
    events = [event for event in reconstruction.events if event.id in story.event_ids and event.event_type != "noise"]
    order = [
        "customer_review",
        "requirement_recorded",
        "architecture_discussion",
        "decision_auth0",
        "jira_auth",
        "pull_request",
        "problem_discovered",
        "decision_revised",
        "decision_custom",
        "implementation_updated",
    ]
    ranked = [event for name in order for event in events if event.event_type == name]
    ranked.extend(event for event in events if event not in ranked)
    chosen = ranked[:10]
    if provider is None:
        started = time.perf_counter()
        log_ai("story-summary", "none", started, success=True, fallback=True)
        return {"available": False, "storyId": story_id}
    started = time.perf_counter()
    context = build_context(chosen, reconstruction)
    key = cache_key("story", [event.id for event in chosen], [event.content for event in chosen])
    cached = cache_get(key)
    if cached is not None:
        log_ai("story-summary", provider.name, started, success=True)
        return cached
    try:
        raw = provider.generate_summary(context)
        summary = validate_summary(raw, {event.id for event in chosen})
    except Exception:
        log_ai("story-summary", provider.name, started, success=False, fallback=True)
        return {"available": False, "storyId": story_id}
    if summary is None:
        log_ai("story-summary", provider.name, started, success=False, fallback=True, validation_failure=True)
        return {"available": False, "storyId": story_id}
    payload = {
        "available": True,
        "storyId": story_id,
        "headline": summary.headline,
        "summary": summary.summary,
        "keyDecisions": summary.key_decisions,
        "openQuestions": summary.open_questions,
        "actionItems": summary.action_items,
        "supportingEventIds": summary.supporting_event_ids,
        "evidence": _evidence(reconstruction, summary.supporting_event_ids),
    }
    log_ai("story-summary", provider.name, started, success=True)
    return cache_set(key, payload)


def ask(project_id: str, question: str, history: list[dict[str, str]]) -> dict:
    reconstruction = reconstruct(project_id)
    turns = [turn for turn in history if turn.get("question") and turn.get("answer")][-3:]
    events = retrieve_events(question, reconstruction, limit=8)
    evidence = _evidence(reconstruction, [event.id for event in events])
    provider = get_provider()
    if provider is None:
        started = time.perf_counter()
        log_ai("ask", "none", started, success=True, fallback=True)
        return {
            "available": False,
            "insufficientEvidence": False,
            "message": FALLBACK,
            "answer": "",
            "confidence": 0,
            "evidence": evidence,
            "related": [],
            "graphNodeId": None,
        }
    started = time.perf_counter()
    context = build_context(events, reconstruction)
    allowed_events = {event.id for event in events}
    allowed_entities = {entity["id"] for entity in context.entities}
    try:
        raw = provider.answer_question(context, question, turns)
        answer = validate_answer(raw, allowed_events, allowed_entities)
    except Exception:
        log_ai("ask", provider.name, started, success=False, fallback=True)
        return {
            "available": False,
            "insufficientEvidence": False,
            "message": FALLBACK,
            "answer": "",
            "confidence": 0,
            "evidence": evidence,
            "related": [],
            "graphNodeId": None,
        }
    if answer is None or answer.insufficient_evidence or not answer.supporting_event_ids:
        log_ai("ask", provider.name, started, success=True, validation_failure=answer is None)
        return {
            "available": True,
            "insufficientEvidence": True,
            "message": INSUFFICIENT,
            "answer": "",
            "confidence": 0,
            "evidence": [],
            "related": [],
            "graphNodeId": None,
        }
    cited = _evidence(reconstruction, answer.supporting_event_ids)
    related = _related(reconstruction, answer.related_entity_ids, answer.supporting_event_ids)
    graph_node = next((item["graphNodeId"] for item in related if item.get("graphNodeId")), None)
    log_ai("ask", provider.name, started, success=True)
    return {
        "available": True,
        "insufficientEvidence": False,
        "message": "",
        "answer": answer.answer,
        "confidence": answer.confidence,
        "evidence": cited,
        "related": related,
        "graphNodeId": graph_node,
    }


def enrich_graph(project_id: str, payload: dict) -> dict:
    for edge in payload.get("edges", []):
        edge.setdefault("confidenceSource", "deterministic")
    payload["edges"] = [*payload.get("edges", []), *inferred_edges(project_id)]
    return payload


def inferred_edges(project_id: str) -> list[dict]:
    provider = get_provider()
    if provider is None:
        return []
    reconstruction = reconstruct(project_id)
    wanted = {"pull_request", "engineering_discussion", "implementation_note", "problem_discovered"}
    events = [event for event in reconstruction.events if event.event_type in wanted]
    by_id = {event.id: event for event in reconstruction.events}
    started = time.perf_counter()
    context = build_context(events, reconstruction)
    try:
        raw = provider.extract_relationships(context)
        candidates = validate_candidates(raw, {event.id for event in events})
    except Exception:
        log_ai("relationships", provider.name, started, success=False, fallback=True)
        return []
    if not candidates and raw:
        log_ai("relationships", provider.name, started, success=False, validation_failure=True)
    deterministic_events = {(item.source_event_id, item.target_event_id) for item in reconstruction.relationships}
    node_pairs: set[tuple[str, str]] = set()
    for item in reconstruction.relationships:
        source = _node_for(item.source_event_id, by_id)
        target = _node_for(item.target_event_id, by_id)
        if source and target:
            node_pairs.add((source, target))
    edges: list[dict] = []
    for candidate in candidates:
        pair = (candidate.source_event_id, candidate.target_event_id)
        if pair in deterministic_events or candidate.confidence < 0.7:
            continue
        source = _node_for(candidate.source_event_id, by_id)
        target = _node_for(candidate.target_event_id, by_id)
        if not source or not target or source == target or (source, target) in node_pairs:
            continue
        edges.append(
            {
                "id": f"ai-{source}-{target}-{candidate.relationship_type}",
                "source": source,
                "target": target,
                "relationshipType": candidate.relationship_type,
                "label": EDGE_LABELS.get(candidate.relationship_type, "Inferred"),
                "description": f"AI inferred this relationship based on {candidate.reason}",
                "confidenceSource": "ai_inferred",
                "reason": candidate.reason,
                "evidenceIds": candidate.supporting_event_ids,
                "evidence": [
                    {"id": event_id, "title": by_id[event_id].title}
                    for event_id in candidate.supporting_event_ids
                    if event_id in by_id
                ],
                "confidence": candidate.confidence,
            }
        )
        if len(edges) == 2:
            break
    log_ai("relationships", provider.name, started, success=True)
    return edges


def _cached_explanation(project_id: str, source_ids: list[str], request_type: str) -> dict:
    reconstruction = reconstruct(project_id)
    by_id = {event.id: event for event in reconstruction.events}
    events = [by_id[event_id] for event_id in source_ids if event_id in by_id]
    evidence = _evidence(reconstruction, [event.id for event in events])
    provider = get_provider()
    if provider is None:
        started = time.perf_counter()
        log_ai(request_type, "none", started, success=True, fallback=True)
        return {"available": False, "message": FALLBACK, "evidence": evidence}
    key = cache_key("explain", [event.id for event in events], [event.content for event in events])
    cached = cache_get(key)
    started = time.perf_counter()
    if cached is not None:
        log_ai(request_type, provider.name, started, success=True)
        return cached
    context: RetrievedContext = build_context(events, reconstruction)
    try:
        raw = provider.generate_explanation(context)
        explanation = validate_explanation(raw, {event.id for event in events})
    except Exception:
        log_ai(request_type, provider.name, started, success=False, fallback=True)
        return {"available": False, "message": FALLBACK, "evidence": evidence}
    if explanation is None:
        log_ai(request_type, provider.name, started, success=False, fallback=True, validation_failure=True)
        return {"available": False, "message": FALLBACK, "evidence": evidence}
    payload = {
        "available": True,
        "message": "",
        "summary": explanation.summary,
        "reason": explanation.reason,
        "whatChanged": explanation.what_changed,
        "previousState": explanation.previous_state,
        "currentState": explanation.current_state,
        "contributingFactors": explanation.contributing_factors,
        "supportingEventIds": explanation.supporting_event_ids,
        "confidence": explanation.confidence,
        "evidence": _evidence(reconstruction, explanation.supporting_event_ids),
    }
    log_ai(request_type, provider.name, started, success=True)
    return cache_set(key, payload)


def _node_for(event_id: str, by_id: dict) -> str | None:
    event = by_id.get(event_id)
    if event is None:
        return None
    if event.event_type == "review_requested":
        return None
    return GRAPH_NODE_IDS.get(event.event_type)


def _evidence(reconstruction, event_ids: list[str]) -> list[dict]:
    by_id = {event.id: event for event in reconstruction.events}
    rows = []
    for event_id in event_ids:
        event = by_id.get(event_id)
        if event is None:
            continue
        rows.append(
            {
                "id": event.id,
                "kind": event.source,
                "kindLabel": event.source,
                "dateLabel": event.timestamp.strftime("%b ") + str(event.timestamp.day),
                "title": event.title,
                "author": event.actors[0] if event.actors else "",
                "projectName": "Project Atlas",
                "excerpt": event.content,
                "relationship": "Cited from the project record.",
                "meta": [{"label": "Event", "value": event.id}],
            }
        )
    return rows


def _related(reconstruction, entity_ids: list[str], event_ids: list[str]) -> list[dict]:
    by_id = {event.id: event for event in reconstruction.events}
    rows = []
    seen: set[str] = set()
    for event_id in event_ids:
        event = by_id.get(event_id)
        if event is None:
            continue
        node_id = GRAPH_NODE_IDS.get(event.event_type)
        if not node_id or node_id in seen:
            continue
        seen.add(node_id)
        rows.append({"id": node_id, "title": event.title, "type": event.event_type, "graphNodeId": node_id})
    for entity in reconstruction.entities:
        if entity.id in entity_ids and entity.id not in seen:
            seen.add(entity.id)
            rows.append({"id": entity.id, "title": entity.name, "type": entity.kind, "graphNodeId": None})
    return rows[:8]
