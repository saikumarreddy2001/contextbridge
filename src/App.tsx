import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { AppShell } from "@/layout/app-shell"
import { CatchUpPage } from "@/pages/catch-up-page"
import { DecisionsPage } from "@/pages/decisions-page"
import { GraphPage } from "@/pages/graph-page"
import { HelpPage } from "@/pages/help-page"
import { NotFoundPage } from "@/pages/not-found-page"
import { OverviewPage } from "@/pages/overview-page"
import { SearchPage } from "@/pages/search-page"
import { SettingsPage } from "@/pages/settings-page"
import { SourcesPage } from "@/pages/sources-page"
import { TimelinePage } from "@/pages/timeline-page"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Navigate to="/overview" replace />} />
          <Route path="overview" element={<OverviewPage />} />
          <Route path="catch-up" element={<CatchUpPage />} />
          <Route path="timeline" element={<TimelinePage />} />
          <Route path="graph" element={<GraphPage />} />
          <Route path="decisions" element={<DecisionsPage />} />
          <Route path="sources" element={<SourcesPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="help" element={<HelpPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
