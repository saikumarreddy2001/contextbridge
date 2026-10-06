# ContextBridge reconstruction

Deterministic pipeline: raw workplace events become normalized events, entities, relationships, stories, and ranked changes. An optional AI layer can explain those results. It does not replace the pipeline.

`AI_PROVIDER=none` (the default in `.env.example`) does not call a model. `AI_PROVIDER=mock` is deterministic and offline. `AI_PROVIDER=openai` and `AI_PROVIDER=gemini` use `AI_API_KEY` and `AI_MODEL` on the server only. A missing key falls back to `none` for that request. Gemini embeddings stay on the local concept vector.

`GET /health` returns `{"status":"healthy","service":"contextbridge-api"}` and does not call a provider. `GET /api/health` still returns `{"status":"ok"}`. `GET /api/capabilities` reports whether a provider will actually run. The container listens on `$PORT` (default 8080). Local uvicorn stays on 8077.

Dev CORS allows `http://127.0.0.1:43123` and `http://localhost:43123`. `ENVIRONMENT=production` uses `ALLOWED_ORIGINS` and drops `*`.

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

The Vite app on port 43123 calls this origin through `VITE_API_BASE_URL`.

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

`GET /api/projects/{project_id}/search?q=&mode=keyword|hybrid&type=&person=&status=&start_date=&end_date=`

`mode=keyword` is the Phase 5 match. `mode=hybrid` adds semantic similarity. Each result can include `score` and `scoreBreakdown` (`keyword`, `semantic`, `importance`, `recency`).

`POST /api/projects/{project_id}/explain-change/{change_id}`

`available`, `message`, and when the provider is on: `summary`, `reason`, `whatChanged`, `previousState`, `currentState`, `contributingFactors`, `supportingEventIds`, `confidence`, `evidence`.

`POST /api/projects/{project_id}/ask` with `{ "question", "history": [{ "question", "answer" }] }`

`available`, `insufficientEvidence`, `message`, `answer`, `confidence`, `evidence`, `related`, `graphNodeId`.

`GET /api/projects/{project_id}/stories/{story_id}/summary`

`available`, `headline`, `summary`, `keyDecisions`, `openQuestions`, `actionItems`, `supportingEventIds`, `evidence`.

Keyword `results` items: `id`, `type`, `title`, `snippet`, `date`, `projectId`, `people`, `status`, `sourceLabel`, `graphNodeId`, `timelineEventId`.

Graph edges include `confidenceSource` (`deterministic` or `ai_inferred`). Inferred edges are dashed and never replace a deterministic edge.

`GET /api/context/{node_id}`

`node`, `incoming`, `outgoing`, `evidence`, `relatedEvents`.
