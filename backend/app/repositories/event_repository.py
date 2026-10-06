from app.data.raw_events import all_raw_events
from app.models.events import RawWorkEvent

CANONICAL = {"atlas": "project-atlas", "project-atlas": "project-atlas"}


def canonical_project_id(project_id: str) -> str:
    return CANONICAL.get(project_id, project_id)


def load_raw_events(project_id: str) -> list[RawWorkEvent]:
    canonical = canonical_project_id(project_id)
    return [RawWorkEvent.model_validate(row) for row in all_raw_events() if row["project_id"] == canonical]
