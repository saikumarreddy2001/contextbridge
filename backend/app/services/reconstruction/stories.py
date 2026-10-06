from app.models.domain import Story
from app.models.events import NormalizedWorkEvent

MILESTONE_TYPES = [
    "requirement_recorded",
    "architecture_discussion",
    "decision_auth0",
    "jira_auth",
    "pull_request",
    "problem_discovered",
    "decision_revised",
    "implementation_updated",
]


def build_stories(events: list[NormalizedWorkEvent]) -> list[Story]:
    groups = {
        "story-authentication": ("entity-authentication", "Authentication architecture"),
        "story-payment": ("entity-payment-sandbox", "Payment sandbox"),
        "story-api-contract": ("entity-api-contract", "API contract"),
    }
    stories: list[Story] = []
    for story_id, (entity_id, title) in groups.items():
        matched = [event for event in events if entity_id in event.entity_ids and event.event_type != "noise"]
        if story_id == "story-authentication":
            matched = [event for event in matched if "entity-payment-sandbox" not in event.entity_ids]
        stories.append(
            Story(
                id=story_id,
                project_id=events[0].project_id if events else "project-atlas",
                title=title,
                event_ids=[event.id for event in matched],
                entity_ids=sorted({entity for event in matched for entity in event.entity_ids}),
            )
        )
    return stories


def authentication_milestone_ids(events: list[NormalizedWorkEvent]) -> list[str]:
    by_type = {event.event_type: event for event in events}
    return [by_type[event_type].id for event_type in MILESTONE_TYPES if event_type in by_type]
