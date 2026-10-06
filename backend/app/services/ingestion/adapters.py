from app.models.events import NormalizedWorkEvent, RawWorkEvent

ENTITY_RULES: dict[str, list[str]] = {
    "customer_review": ["entity-enterprise-sso", "entity-authentication", "entity-project-atlas"],
    "requirement_recorded": ["entity-enterprise-sso", "entity-authentication", "entity-project-atlas"],
    "architecture_discussion": ["entity-authentication", "entity-enterprise-sso"],
    "decision_auth0": ["entity-auth0", "entity-authentication"],
    "jira_auth": ["entity-auth-142", "entity-auth0", "entity-authentication"],
    "pull_request": ["entity-pr-184", "entity-auth-142", "entity-authentication"],
    "implementation_note": ["entity-pr-184", "entity-authentication"],
    "engineering_discussion": ["entity-token-refresh", "entity-authentication"],
    "problem_discovered": ["entity-token-refresh", "entity-auth0", "entity-authentication"],
    "decision_revised": ["entity-authentication", "entity-auth0", "entity-custom-auth"],
    "decision_custom": ["entity-custom-auth", "entity-authentication"],
    "implementation_updated": ["entity-auth-142", "entity-custom-auth", "entity-authentication"],
    "review_requested": ["entity-alex-morgan", "entity-authentication", "entity-api-contract"],
    "payment_scheduled": ["entity-payment-sandbox", "entity-project-atlas"],
    "access_requested": ["entity-payment-sandbox"],
    "access_pending": ["entity-payment-sandbox"],
    "blocker_opened": ["entity-payment-sandbox"],
    "contract_discussion": ["entity-api-contract", "entity-authentication"],
    "contract_draft": ["entity-api-contract"],
    "contract_thread": ["entity-api-contract"],
    "noise": [],
}

ENTITY_NAMES = {
    "entity-authentication": ("Authentication", "topic"),
    "entity-enterprise-sso": ("Enterprise SSO", "requirement"),
    "entity-auth0": ("Auth0", "decision"),
    "entity-auth-142": ("AUTH-142", "task"),
    "entity-pr-184": ("PR #184", "change"),
    "entity-token-refresh": ("Token refresh", "problem"),
    "entity-custom-auth": ("Custom authentication", "decision"),
    "entity-project-atlas": ("Project Atlas", "project"),
    "entity-payment-sandbox": ("Payment sandbox", "blocker"),
    "entity-api-contract": ("API contract", "discussion"),
    "entity-alex-morgan": ("Alex Morgan", "person"),
    "entity-sarah-kim": ("Sarah Kim", "person"),
    "entity-jordan-lee": ("Jordan Lee", "person"),
    "entity-priya-shah": ("Priya Shah", "person"),
    "entity-riley-chen": ("Riley Chen", "person"),
    "entity-maya-chen": ("Maya Chen", "person"),
}


def adapt(event: RawWorkEvent) -> NormalizedWorkEvent:
    actors = [event.actor]
    attendees = event.metadata.get("attendees")
    if isinstance(attendees, str):
        actors.extend(name.strip() for name in attendees.split(",") if name.strip() and name.strip() not in actors)
    assignee = event.metadata.get("assignee")
    if isinstance(assignee, str) and assignee not in actors:
        actors.append(assignee)
    references: list[str] = []
    number = event.metadata.get("number")
    issue = event.metadata.get("issue")
    if isinstance(number, str):
        references.append(f"github:{number}")
    if isinstance(issue, str):
        references.append(f"jira:{issue}")
    return NormalizedWorkEvent(
        id=event.id,
        source=event.source,
        source_id=event.source_id,
        project_id=event.project_id,
        timestamp=event.timestamp,
        actors=actors,
        title=event.title,
        content=event.content,
        event_type=event.event_type,
        references=references,
        entity_ids=list(ENTITY_RULES.get(event.event_type, [])),
        metadata=event.metadata,
    )
