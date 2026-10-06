from functools import lru_cache

from app.repositories.event_repository import canonical_project_id, load_raw_events
from app.services.normalization.normalize import normalize_events
from app.services.reconstruction.changes import detect_changes
from app.services.reconstruction.entities import resolve_entities
from app.services.reconstruction.present import catch_up_items, graph_payload, search_records, timeline_payload
from app.services.reconstruction.relationships import build_relationships
from app.services.reconstruction.stories import authentication_milestone_ids, build_stories


class Reconstruction:
    def __init__(self, project_id: str):
        raw = load_raw_events(project_id)
        self.project_id = canonical_project_id(project_id)
        self.raw_count = len(raw)
        self.events = normalize_events(raw)
        self.entities = resolve_entities(self.events)
        self.relationships = build_relationships(self.events)
        self.stories = build_stories(self.events)
        self.changes = detect_changes(self.events, self.stories)
        self.milestone_ids = authentication_milestone_ids(self.events)

    def in_window(self, start: str | None, end: str | None):
        selected = self.events
        if start:
            selected = [event for event in selected if event.timestamp.date().isoformat() >= start]
        if end:
            selected = [event for event in selected if event.timestamp.date().isoformat() <= end]
        return selected


@lru_cache(maxsize=4)
def reconstruct(project_id: str) -> Reconstruction:
    return Reconstruction(project_id)


def catch_up_response(project_id: str, user_id: str, start: str | None, end: str | None) -> dict:
    rec = reconstruct(project_id)
    window = rec.in_window(start, end)
    analyzed_ids = {event.id for event in window}
    changes = [change for change in rec.changes if any(event_id in analyzed_ids for event_id in change.source_ids)]
    items = catch_up_items(window, changes)
    return {
        "projectId": "atlas" if rec.project_id == "project-atlas" else rec.project_id,
        "userId": user_id,
        "absencePeriod": {"start": start or "2026-09-16", "end": end or "2026-09-23", "label": "Sep 16 — Sep 23"},
        "eventsAnalyzed": len(window),
        "meaningfulChanges": [change.model_dump() for change in changes],
        "catchUpItems": items,
        "actionItems": [item for item in items if item["kind"] == "action"],
        "unresolvedDiscussions": [item for item in items if item["kind"] == "discussion"],
    }


def graph_response(project_id: str) -> dict:
    rec = reconstruct(project_id)
    return graph_payload(rec.events, rec.relationships)


def timeline_response(project_id: str, start: str | None, end: str | None, event_type: str | None, person: str | None) -> dict:
    rec = reconstruct(project_id)
    payload = timeline_payload(rec.events, rec.relationships)
    events = payload["events"]
    if start:
        events = [event for event in events if event["date"] >= start]
    if end:
        events = [event for event in events if event["date"] <= end]
    if event_type and event_type != "all":
        events = [event for event in events if event["type"] == event_type or (event_type == "task" and event["type"] in {"jira", "task"})]
    if person and person != "all":
        events = [event for event in events if person in event["people"]]
    return {**payload, "events": events}


def search_response(project_id: str, query: str, type_name: str | None, person: str | None, status: str | None, start: str | None, end: str | None) -> dict:
    rec = reconstruct(project_id)
    records = search_records(rec.events, rec.relationships)
    terms = [term.lower() for term in query.split() if term]
    def matches(record: dict) -> bool:
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
        if not terms:
            return True
        haystack = " ".join([record["title"], record["snippet"], record["status"], record["sourceLabel"], *record["people"]]).lower()
        return all(term in haystack for term in terms)

    return {"query": query, "results": [record for record in records if matches(record)]}


def context_response(node_id: str) -> dict | None:
    rec = reconstruct("project-atlas")
    graph = graph_payload(rec.events, rec.relationships)
    node = next((item for item in graph["nodes"] if item["id"] == node_id), None)
    if not node:
        return None
    incoming = [edge for edge in graph["edges"] if edge["target"] == node_id]
    outgoing = [edge for edge in graph["edges"] if edge["source"] == node_id]
    related_ids = {edge["source"] for edge in incoming} | {edge["target"] for edge in outgoing}
    related = [item for item in graph["nodes"] if item["id"] in related_ids]
    evidence = node["sourceRefs"]
    return {"node": node, "incoming": incoming, "outgoing": outgoing, "evidence": evidence, "relatedEvents": related}
