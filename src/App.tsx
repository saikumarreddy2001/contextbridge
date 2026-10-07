import { lazy, Suspense } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { DataNotice } from "@/components/common/data-notice"
import { AppShell } from "@/layout/app-shell"
import { AskPage } from "@/pages/ask-page"
import { CatchUpPage } from "@/pages/catch-up-page"
import { DecisionsPage } from "@/pages/decisions-page"
import { HelpPage } from "@/pages/help-page"
import { NotFoundPage } from "@/pages/not-found-page"
import { OverviewPage } from "@/pages/overview-page"
import { SearchPage } from "@/pages/search-page"
import { SettingsPage } from "@/pages/settings-page"
import { SourcesPage } from "@/pages/sources-page"

const GraphPage = lazy(() => import("@/pages/graph-page").then((module) => ({ default: module.GraphPage })))
const TimelinePage = lazy(() => import("@/pages/timeline-page").then((module) => ({ default: module.TimelinePage })))

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Navigate to="/overview" replace />} />
          <Route path="overview" element={<OverviewPage />} />
          <Route path="catch-up" element={<CatchUpPage />} />
          <Route
            path="timeline"
            element={
              <Suspense fallback={<DataNotice status="loading" />}>
                <TimelinePage />
              </Suspense>
            }
          />
          <Route
            path="graph"
            element={
              <Suspense fallback={<DataNotice status="loading" />}>
                <GraphPage />
              </Suspense>
            }
          />
          <Route path="decisions" element={<DecisionsPage />} />
          <Route path="sources" element={<SourcesPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="ask" element={<AskPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="help" element={<HelpPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
