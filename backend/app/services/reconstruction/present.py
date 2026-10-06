from app.models.domain import Change, Relationship
from app.models.events import NormalizedWorkEvent

GRAPH_NODE_IDS = {
    "customer_review": "enterprise-customer-feedback",
    "requirement_recorded": "enterprise-sso-requirement",
    "architecture_discussion": "authentication-architecture-discussion",
    "decision_auth0": "auth0-selected",
    "jira_auth": "auth-142",
    "pull_request": "pr-184",
    "problem_discovered": "token-refresh-limitation",
    "engineering_discussion": "project-atlas-discussion",
    "decision_revised": "authentication-decision-revised",
    "decision_custom": "custom-authentication-architecture",
    "implementation_updated": "implementation-updated",
    "access_requested": "pay-88",
    "blocker_opened": "payment-sandbox-blocker",
    "contract_discussion": "api-contract-discussion",
    "contract_draft": "session-contract-draft",
}

NODE_TYPES = {
    "customer_review": "meeting",
    "requirement_recorded": "requirement",
    "architecture_discussion": "discussion",
    "decision_auth0": "decision",
    "jira_auth": "jira",
    "pull_request": "github",
    "problem_discovered": "problem",
    "engineering_discussion": "discussion",
    "decision_revised": "decision",
    "decision_custom": "decision",
    "implementation_updated": "jira",
    "access_requested": "jira",
    "blocker_opened": "blocker",
    "contract_discussion": "discussion",
    "contract_draft": "document",
}

NODE_STATUS = {
    "decision_auth0": "Superseded",
    "decision_custom": "Current",
    "decision_revised": "Recorded",
    "blocker_opened": "Still unresolved",
    "jira_auth": "In Progress",
    "pull_request": "Open",
    "problem_discovered": "Discovered",
    "access_requested": "Blocked",
    "contract_discussion": "Open",
    "contract_draft": "Unresolved",
    "implementation_updated": "In Progress",
    "customer_review": "Recorded",
    "requirement_recorded": "In launch scope",
    "architecture_discussion": "Closed",
    "engineering_discussion": "Recorded",
}

LANES = {
    "enterprise-customer-feedback": "authentication",
    "enterprise-sso-requirement": "authentication",
    "authentication-architecture-discussion": "authentication",
    "auth0-selected": "authentication",
    "auth-142": "authentication",
    "pr-184": "authentication",
    "token-refresh-limitation": "authentication",
    "project-atlas-discussion": "authentication",
    "authentication-decision-revised": "authentication",
    "custom-authentication-architecture": "authentication",
    "implementation-updated": "authentication",
    "alex-review": "authentication",
    "pay-88": "payment",
    "payment-sandbox-blocker": "payment",
    "api-contract-discussion": "api-contract",
    "session-contract-draft": "api-contract",
}

PERSON_NODES = {
    "entity-sarah-kim": ("sarah-kim", "Sarah Kim"),
    "entity-jordan-lee": ("jordan-lee", "Jordan Lee"),
    "entity-priya-shah": ("priya-shah", "Priya Shah"),
    "entity-riley-chen": ("riley-chen", "Riley Chen"),
    "entity-maya-chen": ("maya-chen", "Maya Chen"),
    "entity-alex-morgan": ("alex-morgan", "Alex Morgan"),
}

EDGE_LABELS = {
    "triggered": "Triggered",
    "resulted_in": "Led to",
    "implemented_by": "Implemented by",
    "discussed_in": "Discussed in",
    "blocked_by": "Blocked by",
    "superseded_by": "Superseded by",
    "evidence_for": "Evidence for",
    "assigned_to": "Assigned to",
}


def _month_day(iso_date: str) -> str:
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    month, day = iso_date.split("-")[1:]
    return f"{months[int(month) - 1]} {int(day)}"


def graph_payload(events: list[NormalizedWorkEvent], relationships: list[Relationship]) -> dict:
    by_id = {event.id: event for event in events}
    nodes = []
    event_to_node: dict[str, str] = {}
    for event in events:
        node_id = GRAPH_NODE_IDS.get(event.event_type)
        if not node_id:
            continue
        event_to_node[event.id] = node_id
        nodes.append(
            {
                "id": node_id,
                "type": NODE_TYPES[event.event_type],
                "title": event.title,
                "date": event.timestamp.date().isoformat(),
                "status": NODE_STATUS.get(event.event_type, "Recorded"),
                "description": event.content,
                "projectId": "atlas",
                "people": event.actors,
                "sourceRefs": [{"id": event.id, "label": f"{event.source} · {event.title}"}],
            }
        )
    edges = []
    person_dates: dict[str, str] = {}
    for relationship in relationships:
        source = event_to_node.get(relationship.source_event_id)
        target = event_to_node.get(relationship.target_event_id)
        person = PERSON_NODES.get(relationship.target_entity_id)
        if relationship.relationship_type == "assigned_to" and person:
            target = person[0]
            source_event = by_id.get(relationship.source_event_id)
            if source_event:
                person_dates[person[0]] = source_event.timestamp.date().isoformat()
        if not source or not target or source == target:
            continue
        edges.append(
            {
                "id": relationship.id,
                "source": source,
                "target": target,
                "relationshipType": relationship.relationship_type,
                "label": EDGE_LABELS.get(relationship.relationship_type, relationship.relationship_type),
                "description": relationship.description,
            }
        )
    for entity_id, (node_id, name) in PERSON_NODES.items():
        if node_id not in person_dates:
            continue
        nodes.append(
            {
                "id": node_id,
                "type": "person",
                "title": name,
                "date": person_dates[node_id],
                "status": "Recorded",
                "description": f"{name} is named on the Project Atlas work this node connects to.",
                "projectId": "atlas",
                "people": [name],
                "sourceRefs": [{"id": entity_id, "label": f"person · {name}"}],
            }
        )
    return {"nodes": nodes, "edges": edges}


def timeline_payload(events: list[NormalizedWorkEvent], relationships: list[Relationship]) -> dict:
    graph = graph_payload(events, relationships)
    nodes = {node["id"]: node for node in graph["nodes"] if node["type"] != "person"}
    related: dict[str, list[str]] = {node_id: [] for node_id in nodes}
    for edge in graph["edges"]:
        if edge["source"] in related and edge["target"] in related:
            related[edge["source"]].append(edge["target"])
            related[edge["target"]].append(edge["source"])
    timeline_events = []
    for node_id, node in nodes.items():
        timeline_events.append(
            {
                "id": node_id,
                "storyLaneId": LANES[node_id],
                "graphNodeId": node_id,
                "sourceIds": [ref["id"] for ref in node["sourceRefs"]],
                "relatedEventIds": list(dict.fromkeys(related[node_id])),
                "type": "jira" if node["type"] == "jira" else node["type"],
                "title": node["title"],
                "date": node["date"],
                "description": node["description"],
                "status": node["status"],
                "people": node["people"],
                "projectId": "atlas",
                "sources": node["sourceRefs"],
                "evolution": "superseded" if node["status"] == "Superseded" else "current" if node["status"] == "Current" else None,
            }
        )
    review = next(event for event in events if event.event_type == "review_requested")
    timeline_events.append(
        {
            "id": "alex-review",
            "storyLaneId": "authentication",
            "graphNodeId": "alex-morgan",
            "sourceIds": [review.id],
            "relatedEventIds": ["authentication-decision-revised", "api-contract-discussion"],
            "type": "task",
            "title": "Review revised authentication/API approach",
            "date": review.timestamp.date().isoformat(),
            "description": review.content,
            "status": "Waiting on you",
            "people": ["Alex Morgan"],
            "projectId": "atlas",
            "sources": [{"id": review.id, "label": f"{review.source} · {review.title}"}],
            "evolution": None,
        }
    )
    lanes = [
        {
            "id": "authentication",
            "title": "Authentication",
            "summary": "Sep 16 – Sep 22, through the revision",
            "from": "2026-09-16",
            "to": "2026-09-22",
        },
        {
            "id": "payment",
            "title": "Payment integration",
            "summary": "Sandbox access requested Sep 19, still blocked Sep 23",
            "from": "2026-09-19",
            "to": "2026-09-23",
        },
        {
            "id": "api-contract",
            "title": "API contract",
            "summary": "Identity claims still unresolved",
            "from": "2026-09-23",
            "to": "2026-09-23",
        },
    ]
    return {"lanes": lanes, "events": timeline_events, "projectPeriod": {"from": "2026-09-16", "to": "2026-09-23"}}


def _evidence(event: NormalizedWorkEvent, relationship: str) -> dict:
    return {
        "id": event.id,
        "kind": event.source,
        "kindLabel": event.source.capitalize() if event.source != "github" else "GitHub",
        "dateLabel": _month_day(event.timestamp.date().isoformat()),
        "title": event.title,
        "author": event.actors[0],
        "projectName": "Project Atlas",
        "excerpt": event.content,
        "relationship": relationship,
        "meta": [{"label": "Source", "value": event.source_id}],
    }


def _steps(events: list[NormalizedWorkEvent]) -> list[dict]:
    return [
        {"id": event.id, "dateLabel": _month_day(event.timestamp.date().isoformat()), "title": event.title}
        for event in events
    ]


def catch_up_items(events: list[NormalizedWorkEvent], changes: list[Change]) -> list[dict]:
    by_id = {event.id: event for event in events}
    items = []
    catalog = {
        "change-decision": {
            "slug": "authentication-architecture",
            "kind": "decision",
            "kindLabel": "Decision changed",
            "completionLabel": "Decision Changed",
            "navigatorLabel": "Authentication decision",
            "contextFocusId": "authentication-decision-revised",
            "before": "Auth0",
            "after": "Custom authentication architecture",
        },
        "change-requirement": {
            "slug": "enterprise-sso",
            "kind": "requirement",
            "kindLabel": "Requirement changed",
            "completionLabel": "Requirement Changed",
            "navigatorLabel": "Enterprise SSO",
            "contextFocusId": "enterprise-sso-requirement",
            "before": "Standard authentication",
            "after": "Enterprise SSO at launch",
        },
        "change-blocker": {
            "slug": "payment-sandbox",
            "kind": "blocker",
            "kindLabel": "Blocker",
            "completionLabel": "Blocker",
            "navigatorLabel": "Payment blocker",
            "contextFocusId": "payment-sandbox-blocker",
            "before": None,
            "after": None,
        },
        "change-action": {
            "slug": "review-auth-approach",
            "kind": "action",
            "kindLabel": "Action required",
            "completionLabel": "Action Required",
            "navigatorLabel": "Your review",
            "contextFocusId": "authentication-decision-revised",
            "before": None,
            "after": None,
        },
        "change-discussion": {
            "slug": "api-contract",
            "kind": "discussion",
            "kindLabel": "Unresolved discussion",
            "completionLabel": "Unresolved Discussion",
            "navigatorLabel": "API contract",
            "contextFocusId": "api-contract-discussion",
            "before": None,
            "after": None,
        },
    }
    for change in changes:
        spec = catalog[change.id]
        cited = [by_id[event_id] for event_id in change.source_ids if event_id in by_id]
        evidence = [
            _evidence(event, f"Cited by {change.category.replace('_', ' ')}.")
            for event in cited
        ]
        change_block = None
        if spec["before"] and spec["after"]:
            change_block = {
                "beforeLabel": "Before",
                "beforeValue": spec["before"],
                "afterLabel": "After",
                "afterValue": spec["after"],
            }
        action = None
        if change.category == "action_required":
            action = {"ask": change.summary, "dueLabel": "Sep 24", "statusLabel": "Waiting on you"}
        items.append(
            {
                "id": change.id,
                "slug": spec["slug"],
                "projectId": "atlas",
                "kind": spec["kind"],
                "kindLabel": spec["kindLabel"],
                "completionLabel": spec["completionLabel"],
                "title": "Review revised authentication/API approach" if change.id == "change-action" else change.title,
                "summary": change.summary,
                "navigatorLabel": spec["navigatorLabel"],
                "guided": True,
                "priority": "high",
                "dateLabel": _month_day(change.date),
                "steps": _steps(cited),
                "change": change_block,
                "details": [
                    {"id": f"{change.id}-score", "label": "Importance", "value": f"{change.score} — {'; '.join(change.reasons)}"},
                    {"id": f"{change.id}-sources", "label": "Sources", "value": ", ".join(change.source_ids)},
                ],
                "reason": {
                    "prompt": "Why did this change?",
                    "summary": change.summary,
                    "points": [{"id": f"{change.id}-r{index}", "label": "Signal", "detail": reason} for index, reason in enumerate(change.reasons)],
                },
                "action": action,
                "evidence": evidence,
                "contextFocusId": spec["contextFocusId"],
            }
        )
    return items


def search_records(events: list[NormalizedWorkEvent], relationships: list[Relationship]) -> list[dict]:
    timeline = timeline_payload(events, relationships)
    records = []
    for event in timeline["events"]:
        records.append(
            {
                "id": event["id"],
                "type": event["type"],
                "title": event["title"],
                "snippet": event["description"],
                "date": event["date"],
                "projectId": event["projectId"],
                "people": event["people"],
                "status": event["status"],
                "sourceLabel": event["sources"][0]["label"] if event["sources"] else event["type"],
                "graphNodeId": event.get("graphNodeId"),
                "timelineEventId": event["id"],
            }
        )
    return records
