from app.services.ranking.rank import noise_importance
from app.services.reconstruction.pipeline import reconstruct
from app.services.reconstruction.stories import MILESTONE_TYPES


def test_normalization_keeps_stable_ids_and_people():
    rec = reconstruct("project-atlas")
    meeting = next(event for event in rec.events if event.id == "raw-meeting-0916")
    assert meeting.source == "meeting"
    assert "Sarah Kim" in meeting.actors
    assert "Jordan Lee" in meeting.actors
    assert meeting.entity_ids[0] == "entity-enterprise-sso"
    assert rec.raw_count >= 40


def test_entity_resolution_covers_the_atlas_story():
    rec = reconstruct("atlas")
    ids = {entity.id for entity in rec.entities}
    for entity_id in [
        "entity-authentication",
        "entity-enterprise-sso",
        "entity-auth0",
        "entity-auth-142",
        "entity-pr-184",
        "entity-payment-sandbox",
        "entity-api-contract",
        "entity-alex-morgan",
        "entity-project-atlas",
    ]:
        assert entity_id in ids


def test_authentication_chain():
    rec = reconstruct("project-atlas")
    by_id = {event.id: event for event in rec.events}
    ordered = [by_id[event_id].event_type for event_id in rec.milestone_ids]
    assert ordered == MILESTONE_TYPES
    titles = [by_id[event_id].title for event_id in rec.milestone_ids]
    assert titles[0].startswith("Launch requirements") or "SSO" in by_id[rec.milestone_ids[0]].content
    assert "Auth0" in titles[2]
    assert "AUTH-142" in titles[3]
    assert "PR #184" in titles[4]
    assert "token" in titles[5].lower()
    assert "revised" in titles[6].lower()
    linked = {(rel.source_event_id, rel.target_event_id) for rel in rec.relationships}
    chain = [
        "raw-meeting-0916",
        "raw-doc-launch",
        "raw-discussion-0917",
        "raw-decision-auth0",
        "raw-jira-auth-142",
        "raw-pr-184",
        "raw-problem-0921",
        "raw-decision-revised",
        "raw-decision-custom",
    ]
    assert set(chain) <= {event.id for event in rec.events}
    for source_id, target_id in zip(chain, chain[1:], strict=False):
        assert (source_id, target_id) in linked


def test_decision_change_keeps_provenance():
    rec = reconstruct("project-atlas")
    decision = next(change for change in rec.changes if change.category == "decision_changed")
    cited = set(decision.source_ids)
    assert {"raw-meeting-0916", "raw-jira-auth-142", "raw-pr-184", "raw-discussion-0921"} <= cited
    assert decision.score >= 5
    assert any("Decision changed" in reason for reason in decision.reasons)


def test_noise_ranks_below_main_catch_up():
    rec = reconstruct("project-atlas")
    top = rec.changes[0]
    assert top.category == "decision_changed"
    noise = [event for event in rec.events if event.event_type == "noise"]
    assert len(noise) >= 10
    assert all(noise_importance(event) < top.score for event in noise)
    assert all(event.id not in change.source_ids for event in noise for change in rec.changes)
