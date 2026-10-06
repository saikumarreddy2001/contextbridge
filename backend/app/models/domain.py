from pydantic import BaseModel, Field


class Entity(BaseModel):
    id: str
    name: str
    kind: str
    event_ids: list[str] = Field(default_factory=list)


class Relationship(BaseModel):
    id: str
    source_event_id: str
    target_event_id: str
    source_entity_id: str
    target_entity_id: str
    relationship_type: str
    description: str


class Story(BaseModel):
    id: str
    project_id: str
    title: str
    event_ids: list[str]
    entity_ids: list[str]


class Change(BaseModel):
    id: str
    category: str
    title: str
    summary: str
    importance: int
    score: int
    reasons: list[str]
    date: str
    story_id: str
    related_event_ids: list[str]
    related_entity_ids: list[str]
    source_ids: list[str]
