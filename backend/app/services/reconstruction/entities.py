from app.models.domain import Entity
from app.models.events import NormalizedWorkEvent
from app.services.ingestion.adapters import ENTITY_NAMES


def resolve_entities(events: list[NormalizedWorkEvent]) -> list[Entity]:
    found: dict[str, list[str]] = {}
    for event in events:
        for entity_id in event.entity_ids:
            found.setdefault(entity_id, []).append(event.id)
    entities: list[Entity] = []
    for entity_id, event_ids in found.items():
        name, kind = ENTITY_NAMES.get(entity_id, (entity_id, "topic"))
        entities.append(Entity(id=entity_id, name=name, kind=kind, event_ids=event_ids))
    return sorted(entities, key=lambda entity: entity.id)
