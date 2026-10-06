from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

SourceName = Literal["meeting", "github", "jira", "document", "discussion"]


class RawWorkEvent(BaseModel):
    id: str
    source: SourceName
    source_id: str
    project_id: str
    timestamp: datetime
    actor: str
    title: str
    content: str
    event_type: str
    metadata: dict[str, str | list[str]] = Field(default_factory=dict)


class NormalizedWorkEvent(BaseModel):
    id: str
    source: SourceName
    source_id: str
    project_id: str
    timestamp: datetime
    actors: list[str]
    title: str
    content: str
    event_type: str
    references: list[str]
    entity_ids: list[str]
    metadata: dict[str, str | list[str]] = Field(default_factory=dict)
