# Interview notes

Short notes on what this repo actually does.

## The problem

After time away, a stream of messages is the wrong object. The useful object is the change: what was decided, what replaced it, and what is still blocked. ContextBridge builds that object from scattered project records.

## Why React

The product is a multi-view workspace: overview, catch-up, graph, timeline, search, and ask. React Router keeps those as URLs, so refresh and deep links work once Hosting rewrites to `index.html`. Components stay close to the feature they render.

## Why React Flow

The context graph is a node-and-edge canvas with pan, zoom, fit, and a minimap. `@xyflow/react` does that interaction. The API returns plain nodes and edges. Positions are computed in the browser. The attribution stays visible.

## How state works

There is no Redux. Theme, sidebar, workspace, and project selection use `useSyncExternalStore` and `localStorage`. The reconstruction bundle uses the same pattern: one load, then subscribers. Catch-up story, graph focus, timeline focus, and search filters live in the URL. Panel selection is component state.

## Why FastAPI

The reconstruction and the model call are server work. FastAPI plus Pydantic gives typed request and response models, and the React app never sees an API key. `GET /health` does not call a provider.

## Why normalize

Raw records use different shapes: a meeting, a Jira issue, a pull request, a document. Normalization gives them one event shape with a stable id, time, actors, and type, so later steps do not special-case each source.

## Entity resolution

The same thing appears under different wordings. Resolution attaches events to stable entity ids such as `entity-auth0` and `entity-enterprise-sso`, so a decision and the ticket that implemented it refer to the same object.

## Relationships

Rules connect event types: customer feedback triggered the SSO requirement, the discussion resulted in Auth0, AUTH-142 was implemented by PR #184, the token-refresh problem triggered the revision, and Auth0 was superseded by the custom architecture. Those links are the graph.

## Stories

Events that share an entity become a story. Authentication, the payment sandbox, and the API contract are separate stories so the timeline can show lanes instead of one flat list.

## Ranking

Not every event belongs in the catch-up. Decision changes, requirement changes, blockers, direct impact on the returning person, mixed sources, and unresolved items score higher. Noise scores at the bottom and is not cited.

## Trace Why

From a selected node, Trace Why walks incoming causal edges (`triggered`, `resulted_in`, `implemented_by`) back toward what led there. `superseded_by` is not treated as a cause, so Auth0 being replaced does not become a step that led to the revision.

## Trace Impact

Trace Impact walks outward, including `superseded_by`, so you can see what a decision changed or replaced. Fit view then frames the highlighted nodes.

## Timeline and graph

Both read the same reconstruction. A timeline event carries `graphNodeId`. Explore Context goes to `/graph?focus=`. Graph detail can return to `/timeline?focus=`. The date window for the demo is September 16–23.

## Search

Keyword search matches the reconstructed text. Hybrid search adds a local semantic score, plus importance and recency. The weights live in the backend. Results highlight matches with `<mark>`, not HTML injection. View in Timeline and Explore Context reuse the same ids.

## Where AI helps

When a provider is on, it writes a change explanation, a story summary, an Ask answer, and candidate relationships. Ask retrieves at most eight events. One inferred edge can be added as a dashed line. It does not overwrite a deterministic edge.

## Why the fallback exists

A recruiter, or a demo with no key, still needs the product. `AI_PROVIDER=none` leaves the deterministic screens working and tells Ask that AI reasoning is unavailable. If the API cannot be reached on the first load, or `VITE_API_BASE_URL` is empty, the UI uses the saved Atlas demo. If a configured API fails after it had connected, the failure stays visible and offers “Use demo data”.

## How evidence checks limit hallucinations

The provider is instructed to cite ids from the payload. Validation drops unknown ids, clips string length, and marks an answer insufficient when no supporting id survives. The UI then says the project evidence is not enough. Instruction-like text inside an event is treated as data.

## How deploy is set up

`firebase.json` points Hosting at `dist` and rewrites routes to `index.html`. The API Dockerfile listens on `$PORT` as a non-root user and does not copy `.env`. GitHub Actions installs, builds, and runs pytest. It does not deploy. Billing, Firebase project creation, and `gcloud run deploy` are still manual.

## Hard parts

Keeping one story across four views without letting the API return React Flow objects. Deciding which edges are causal for Trace Why so a superseded decision does not look like a cause. Making Ask refuse an answer when the cited ids are not in the retrieval set.

## Tradeoffs

The demo data is synthetic, so the pipeline is real and the sources are not. The rate limit is per process, in memory. Embeddings are a small local vector, which keeps hybrid search offline and limits how semantic it is. Graph and timeline are lazy-loaded; the rest of the shell is not split further.

## What a real enterprise version would add next

Live connectors for the systems people already use, authentication, and a real embedding model. Those are not in this repo.
