from app.models.domain import Relationship
from app.models.events import NormalizedWorkEvent

# source event type, target event type, relationship, entities (source, target), description
RULES: list[tuple[str, str, str, str, str, str]] = [
    (
        "customer_review",
        "requirement_recorded",
        "triggered",
        "entity-enterprise-sso",
        "entity-enterprise-sso",
        "Customer feedback introduced enterprise SSO as a launch requirement.",
    ),
    (
        "requirement_recorded",
        "architecture_discussion",
        "triggered",
        "entity-enterprise-sso",
        "entity-authentication",
        "The new SSO requirement opened the authentication architecture discussion.",
    ),
    (
        "requirement_recorded",
        "architecture_discussion",
        "discussed_in",
        "entity-enterprise-sso",
        "entity-authentication",
        "The new SSO requirement was discussed before an approach was chosen.",
    ),
    (
        "architecture_discussion",
        "decision_auth0",
        "resulted_in",
        "entity-authentication",
        "entity-auth0",
        "The discussion settled on Auth0 as the way to meet enterprise SSO.",
    ),
    (
        "requirement_recorded",
        "decision_auth0",
        "resulted_in",
        "entity-enterprise-sso",
        "entity-auth0",
        "Authentication architecture was selected to satisfy the enterprise SSO requirement.",
    ),
    (
        "decision_auth0",
        "jira_auth",
        "resulted_in",
        "entity-auth0",
        "entity-auth-142",
        "AUTH-142 was opened to implement the Auth0 decision.",
    ),
    (
        "jira_auth",
        "pull_request",
        "implemented_by",
        "entity-auth-142",
        "entity-pr-184",
        "PR #184 started the Auth0 implementation described in AUTH-142.",
    ),
    (
        "pull_request",
        "problem_discovered",
        "resulted_in",
        "entity-pr-184",
        "entity-token-refresh",
        "Implementation on PR #184 revealed the token-refresh limitation.",
    ),
    (
        "problem_discovered",
        "decision_revised",
        "triggered",
        "entity-token-refresh",
        "entity-authentication",
        "The token-refresh limitation triggered the revised authentication decision.",
    ),
    (
        "decision_revised",
        "decision_custom",
        "resulted_in",
        "entity-authentication",
        "entity-custom-auth",
        "The revised decision established the custom authentication architecture.",
    ),
    (
        "decision_auth0",
        "decision_custom",
        "superseded_by",
        "entity-auth0",
        "entity-custom-auth",
        "Auth0 was superseded. The current approach is the custom authentication architecture.",
    ),
    (
        "decision_custom",
        "implementation_updated",
        "resulted_in",
        "entity-custom-auth",
        "entity-auth-142",
        "Implementation tasks were rewritten to follow the custom architecture.",
    ),
    (
        "engineering_discussion",
        "problem_discovered",
        "evidence_for",
        "entity-token-refresh",
        "entity-token-refresh",
        "The engineering discussion is evidence of the token-refresh limitation.",
    ),
    (
        "access_requested",
        "blocker_opened",
        "blocked_by",
        "entity-payment-sandbox",
        "entity-payment-sandbox",
        "Sandbox integration testing cannot start while vendor access is pending.",
    ),
    (
        "decision_custom",
        "contract_discussion",
        "discussed_in",
        "entity-custom-auth",
        "entity-api-contract",
        "The revised architecture left the API claims shape unresolved.",
    ),
    (
        "contract_draft",
        "contract_discussion",
        "evidence_for",
        "entity-api-contract",
        "entity-api-contract",
        "The draft shows the contract is still unsigned.",
    ),
    (
        "decision_revised",
        "review_requested",
        "assigned_to",
        "entity-authentication",
        "entity-alex-morgan",
        "Alex Morgan was asked to review the revised authentication approach.",
    ),
    (
        "customer_review",
        "customer_review",
        "assigned_to",
        "entity-enterprise-sso",
        "entity-sarah-kim",
        "Sarah Kim represented the design partner in the customer review.",
    ),
    (
        "requirement_recorded",
        "requirement_recorded",
        "assigned_to",
        "entity-enterprise-sso",
        "entity-jordan-lee",
        "Jordan Lee recorded the enterprise SSO launch requirement.",
    ),
    (
        "architecture_discussion",
        "architecture_discussion",
        "assigned_to",
        "entity-authentication",
        "entity-priya-shah",
        "Priya Shah led the authentication architecture discussion.",
    ),
    (
        "jira_auth",
        "jira_auth",
        "assigned_to",
        "entity-auth-142",
        "entity-riley-chen",
        "Riley Chen owns AUTH-142.",
    ),
    (
        "pull_request",
        "pull_request",
        "assigned_to",
        "entity-pr-184",
        "entity-maya-chen",
        "Maya Chen authored PR #184.",
    ),
]


def build_relationships(events: list[NormalizedWorkEvent]) -> list[Relationship]:
    by_type: dict[str, list[NormalizedWorkEvent]] = {}
    for event in events:
        by_type.setdefault(event.event_type, []).append(event)
    relationships: list[Relationship] = []
    for source_type, target_type, relationship_type, source_entity, target_entity, description in RULES:
        for source in by_type.get(source_type, []):
            for target in by_type.get(target_type, []):
                if source.timestamp > target.timestamp:
                    continue
                relationships.append(
                    Relationship(
                        id=f"rel-{source.id}-{target.id}-{relationship_type}",
                        source_event_id=source.id,
                        target_event_id=target.id,
                        source_entity_id=source_entity,
                        target_entity_id=target_entity,
                        relationship_type=relationship_type,
                        description=description,
                    )
                )
    return relationships
