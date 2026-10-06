from app.services.ai.embeddings import local_embedding
from app.services.ai.models import (
    AIAnswer,
    AIChangeExplanation,
    AIRelationshipCandidate,
    AIStorySummary,
    ContextEvent,
    RetrievedContext,
)


class MockProvider:
    """Deterministic answers from the supplied slice. Event content is never treated as instructions."""

    name = "mock"
    calls = 0
    last_event_count = 0

    def __init__(self) -> None:
        self.calls = 0

    def _touch(self, context: RetrievedContext) -> None:
        MockProvider.calls += 1
        self.calls += 1
        MockProvider.last_event_count = len(context.events)

    def generate_summary(self, context: RetrievedContext) -> AIStorySummary:
        self._touch(context)
        by_type = _by_type(context.events)
        ids: list[str] = []
        clauses: list[str] = []
        if "customer_review" in by_type and "requirement_recorded" in by_type:
            clauses.append("SSO became required after customer feedback")
            ids.extend([by_type["customer_review"].id, by_type["requirement_recorded"].id])
        elif "requirement_recorded" in by_type:
            clauses.append(f"{by_type['requirement_recorded'].title} on {by_type['requirement_recorded'].date}")
            ids.append(by_type["requirement_recorded"].id)
        if "decision_auth0" in by_type:
            clauses.append("the team picked Auth0")
            ids.append(by_type["decision_auth0"].id)
        if "pull_request" in by_type:
            clauses.append("started implementation")
            ids.append(by_type["pull_request"].id)
        if "problem_discovered" in by_type:
            clauses.append("found token-refresh limits")
            ids.append(by_type["problem_discovered"].id)
        if "decision_revised" in by_type or "decision_custom" in by_type:
            clauses.append("and revised the architecture")
            if "decision_revised" in by_type:
                ids.append(by_type["decision_revised"].id)
            if "decision_custom" in by_type:
                ids.append(by_type["decision_custom"].id)
        headline = "; ".join(clauses).strip() or "The supplied records do not form a story summary."
        if headline and not headline.endswith("."):
            headline = headline[0].upper() + headline[1:] + "."
        decisions = [by_type[name].title for name in ("decision_auth0", "decision_revised", "decision_custom") if name in by_type]
        open_questions = [event.title for event in context.events if event.event_type in {"contract_discussion", "blocker_opened"}]
        actions = [event.title for event in context.events if event.event_type == "review_requested"]
        return AIStorySummary(
            headline=headline,
            summary=headline,
            key_decisions=decisions,
            open_questions=open_questions,
            action_items=actions,
            supporting_event_ids=_unique(ids),
        )

    def generate_explanation(self, context: RetrievedContext) -> AIChangeExplanation:
        self._touch(context)
        by_type = _by_type(context.events)
        ids = [event.id for event in context.events]
        factors = [f"{event.date}: {event.title}" for event in context.events]
        previous = by_type["decision_auth0"].title if "decision_auth0" in by_type else ""
        current = ""
        if "decision_custom" in by_type:
            current = by_type["decision_custom"].title
        elif "decision_revised" in by_type:
            current = by_type["decision_revised"].title
        elif "blocker_opened" in by_type:
            current = by_type["blocker_opened"].title
        parts: list[str] = []
        if "requirement_recorded" in by_type and "decision_auth0" in by_type:
            parts.append("Auth0 was selected after SSO became required")
        if "pull_request" in by_type and "problem_discovered" in by_type:
            parts.append(f"{by_type['pull_request'].title} exposed token-refresh behavior")
        if "decision_revised" in by_type:
            parts.append("the decision was revised")
        if "blocker_opened" in by_type and not parts:
            parts.append(by_type["blocker_opened"].title)
        if "review_requested" in by_type and not parts:
            parts.append(by_type["review_requested"].title)
        summary = "; ".join(parts) + "." if parts else "The supplied records describe this change."
        what = current or (context.events[-1].title if context.events else "")
        return AIChangeExplanation(
            summary=summary,
            reason=summary,
            supporting_event_ids=ids,
            confidence=0.86 if ids else 0,
            what_changed=what,
            previous_state=previous or "No earlier state is in this slice.",
            current_state=current or what,
            contributing_factors=factors,
        )

    def extract_relationships(self, context: RetrievedContext) -> list[AIRelationshipCandidate]:
        self._touch(context)
        by_type = _by_type(context.events)
        pull = by_type.get("pull_request")
        discussion = by_type.get("engineering_discussion")
        if not pull or not discussion:
            return []
        existing = {(item.source_event_id, item.target_event_id) for item in context.relationships}
        if (pull.id, discussion.id) in existing or (discussion.id, pull.id) in existing:
            return []
        evidence = [pull.id, discussion.id]
        note = by_type.get("implementation_note")
        if note:
            evidence.append(note.id)
        return [
            AIRelationshipCandidate(
                source_event_id=pull.id,
                target_event_id=discussion.id,
                relationship_type="discussed_in",
                reason="The #project-atlas thread discusses token-refresh behavior found while PR #184 was open. The rules never drew that edge.",
                confidence=0.84,
                supporting_event_ids=evidence,
            )
        ]

    def answer_question(self, context: RetrievedContext, question: str, history: list[dict[str, str]]) -> AIAnswer:
        self._touch(context)
        # Titles, types, dates, and ids only. Content is workplace data and is ignored here,
        # including any note that tries to name a different event id.
        del history
        by_type = _by_type(context.events)
        asked = question.lower()
        entities = [entity["id"] for entity in context.entities if entity.get("id")]

        def pack(event_types: list[str], text: str, confidence: float = 0.84) -> AIAnswer:
            ids = [by_type[name].id for name in event_types if name in by_type]
            if len(ids) < 1:
                return _insufficient()
            related = [entity_id for entity_id in entities if entity_id.startswith("entity-")][:6]
            return AIAnswer(
                answer=text,
                supporting_event_ids=_unique(ids),
                related_entity_ids=related,
                confidence=confidence,
                insufficient_evidence=False,
            )

        if any(phrase in asked for phrase in ("auth0", "dropped", "authentication change", "why did authentication")):
            text = _join_present(
                by_type,
                [
                    ("requirement_recorded", "enterprise SSO became required"),
                    ("decision_auth0", "Auth0 was selected"),
                    ("pull_request", "PR #184 started the implementation"),
                    ("problem_discovered", "token-refresh behavior blocked that approach"),
                    ("decision_revised", "the authentication decision was revised"),
                ],
            )
            return pack(
                ["requirement_recorded", "decision_auth0", "pull_request", "problem_discovered", "decision_revised", "decision_custom"],
                text,
            )
        if "away" in asked or "while alex" in asked or "what changed" in asked:
            titles = [f"{event.date} {event.title}" for event in context.events[:6]]
            return pack(
                [event.event_type for event in context.events[:6]],
                "While Alex was away, the record shows: " + "; ".join(titles) + ".",
            )
        if "payment" in asked or "blocked" in asked or "block" in asked:
            return pack(
                ["access_requested", "access_pending", "blocker_opened", "payment_scheduled"],
                "Payment integration is blocked because sandbox access is still pending.",
            )
        if "decision" in asked:
            return pack(
                ["decision_auth0", "decision_revised", "decision_custom"],
                _join_present(
                    by_type,
                    [
                        ("decision_auth0", "Auth0 was selected"),
                        ("decision_revised", "that decision was revised"),
                        ("decision_custom", "custom authentication is the current architecture"),
                    ],
                ),
            )
        if "attention" in asked or "needs alex" in asked or "my attention" in asked:
            return pack(
                ["review_requested", "decision_revised", "contract_discussion"],
                "Alex needs to review the revised authentication approach and the open API claims.",
            )
        if "sso" in asked or "after" in asked:
            return pack(
                ["requirement_recorded", "architecture_discussion", "decision_auth0", "jira_auth", "pull_request"],
                "After SSO became required, the team discussed the architecture, selected Auth0, and opened AUTH-142 and PR #184.",
            )
        if not context.events:
            return _insufficient()
        return _insufficient()

    def create_embedding(self, text: str) -> list[float]:
        MockProvider.calls += 1
        self.calls += 1
        return local_embedding(text)


def _by_type(events: list[ContextEvent]) -> dict[str, ContextEvent]:
    found: dict[str, ContextEvent] = {}
    for event in events:
        found.setdefault(event.event_type, event)
    return found


def _unique(ids: list[str]) -> list[str]:
    seen: list[str] = []
    for item in ids:
        if item not in seen:
            seen.append(item)
    return seen


def _join_present(by_type: dict[str, ContextEvent], clauses: list[tuple[str, str]]) -> str:
    parts = [text for event_type, text in clauses if event_type in by_type]
    if not parts:
        return ""
    sentence = "; ".join(parts)
    return sentence[0].upper() + sentence[1:] + "."


def _insufficient() -> AIAnswer:
    return AIAnswer(answer="", supporting_event_ids=[], related_entity_ids=[], confidence=0, insufficient_evidence=True)
