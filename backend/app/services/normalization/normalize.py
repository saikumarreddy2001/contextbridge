from app.models.events import NormalizedWorkEvent, RawWorkEvent
from app.services.ingestion.adapters import adapt


def normalize_events(events: list[RawWorkEvent]) -> list[NormalizedWorkEvent]:
    normalized = [adapt(event) for event in events]
    return sorted(normalized, key=lambda event: (event.timestamp, event.id))
