# ContextBridge reconstruction

Deterministic pipeline: raw workplace events become normalized events, entities, relationships, stories, and ranked changes. No language model and no embeddings.

## Run

```bash
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8077
```

From this directory:

```bash
.venv/bin/pytest
```

The Vite app on port 43123 calls this origin. CORS allows only `http://127.0.0.1:43123` and `http://localhost:43123`.

`atlas` and `project-atlas` are the same project.

## Endpoints

`GET /api/projects/{project_id}/catch-up?user_id=&start_date=&end_date=`

```json
{
  "projectId": "atlas",
  "userId": "alex-morgan",
  "absencePeriod": { "start": "2026-09-16", "end": "2026-09-23", "label": "Sep 16 — Sep 23" },
  "eventsAnalyzed": 0,
  "meaningfulChanges": [],
  "catchUpItems": [],
  "actionItems": [],
  "unresolvedDiscussions": []
}
```

`catchUpItems` matches the frontend `CatchUpItem` fields (`id`, `slug`, `projectId`, `kind`, `kindLabel`, `completionLabel`, `title`, `summary`, `navigatorLabel`, `guided`, `priority`, `dateLabel`, `steps`, `change`, `details`, `reason`, `action`, `evidence`, `contextFocusId`).

`GET /api/projects/{project_id}/graph`

`nodes` match `ContextNode` (`id`, `type`, `title`, `date`, `status`, `description`, `projectId`, `people`, `sourceRefs`). `edges` match `ContextEdge` (`id`, `source`, `target`, `relationshipType`, `label`, `description`).

`GET /api/projects/{project_id}/timeline?start_date=&end_date=&event_type=&person=`

`lanes` (`id`, `title`, `summary`, `from`, `to`) and `events` (`id`, `storyLaneId`, `graphNodeId`, `sourceIds`, `relatedEventIds`, `type`, `title`, `date`, `description`, `status`, `people`, `projectId`, `sources`, `evolution`).

`GET /api/projects/{project_id}/search?q=&type=&person=&status=&start_date=&end_date=`

`results` items: `id`, `type`, `title`, `snippet`, `date`, `projectId`, `people`, `status`, `sourceLabel`, `graphNodeId`, `timelineEventId`.

`GET /api/context/{node_id}`

`node`, `incoming`, `outgoing`, `evidence`, `relatedEvents`.
