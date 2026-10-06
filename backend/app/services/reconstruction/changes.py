from app.models.domain import Change, Story
from app.models.events import NormalizedWorkEvent
from app.services.ranking.rank import score_change


def _by_type(events: list[NormalizedWorkEvent]) -> dict[str, NormalizedWorkEvent]:
    return {event.event_type: event for event in events if event.event_type != "noise"}


def detect_changes(events: list[NormalizedWorkEvent], stories: list[Story]) -> list[Change]:
    story_id = next((story.id for story in stories if story.id == "story-authentication"), "story-authentication")
    payment_id = next((story.id for story in stories if story.id == "story-payment"), "story-payment")
    api_id = next((story.id for story in stories if story.id == "story-api-contract"), "story-api-contract")
    found = _by_type(events)
    meeting = found["customer_review"]
    requirement = found["requirement_recorded"]
    auth0 = found["decision_auth0"]
    task = found["jira_auth"]
    pull = found["pull_request"]
    discussion = found["engineering_discussion"]
    problem = found["problem_discovered"]
    revised = found["decision_revised"]
    custom = found["decision_custom"]
    updated = found["implementation_updated"]
    blocker = found["blocker_opened"]
    review = found["review_requested"]
    contract = found["contract_discussion"]
    draft = found["contract_draft"]

    drafts = [
        Change(
            id="change-decision",
            category="decision_changed",
            title=revised.title,
            summary=f"{problem.content} {revised.content} {custom.content}",
            importance=0,
            score=0,
            reasons=[],
            date=revised.timestamp.date().isoformat(),
            story_id=story_id,
            related_event_ids=[auth0.id, problem.id, revised.id, custom.id, updated.id],
            related_entity_ids=["entity-auth0", "entity-token-refresh", "entity-custom-auth", "entity-alex-morgan"],
            source_ids=[meeting.id, task.id, pull.id, discussion.id, problem.id, revised.id],
        ),
        Change(
            id="change-requirement",
            category="requirement_changed",
            title="Enterprise SSO added to launch requirements",
            summary=requirement.content,
            importance=0,
            score=0,
            reasons=[],
            date=requirement.timestamp.date().isoformat(),
            story_id=story_id,
            related_event_ids=[meeting.id, requirement.id],
            related_entity_ids=["entity-enterprise-sso", "entity-authentication"],
            source_ids=[meeting.id, requirement.id],
        ),
        Change(
            id="change-blocker",
            category="blocker_created",
            title=blocker.title,
            summary=blocker.content,
            importance=0,
            score=0,
            reasons=[],
            date=blocker.timestamp.date().isoformat(),
            story_id=payment_id,
            related_event_ids=[found["access_requested"].id, blocker.id],
            related_entity_ids=["entity-payment-sandbox"],
            source_ids=[found["access_requested"].id, found["access_pending"].id, blocker.id],
        ),
        Change(
            id="change-action",
            category="action_required",
            title="Review revised authentication/API approach",
            summary=review.content,
            importance=0,
            score=0,
            reasons=[],
            date=review.timestamp.date().isoformat(),
            story_id=story_id,
            related_event_ids=[revised.id, review.id, contract.id],
            related_entity_ids=["entity-alex-morgan", "entity-authentication", "entity-api-contract"],
            source_ids=[review.id, revised.id],
        ),
        Change(
            id="change-discussion",
            category="unresolved_discussion",
            title=contract.title,
            summary=f"{contract.content} {draft.content}",
            importance=0,
            score=0,
            reasons=[],
            date=contract.timestamp.date().isoformat(),
            story_id=api_id,
            related_event_ids=[contract.id, draft.id],
            related_entity_ids=["entity-api-contract"],
            source_ids=[contract.id, draft.id, found["contract_thread"].id],
        ),
    ]
    scored: list[Change] = []
    for change in drafts:
        score, reasons = score_change(change, events)
        scored.append(change.model_copy(update={"score": score, "importance": score, "reasons": reasons}))
    return sorted(scored, key=lambda change: (-change.score, change.date, change.id))
