import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { applyStoredTheme } from "@/hooks/use-theme"
import App from "@/App"
import "@/index.css"

applyStoredTheme()

const root = document.getElementById("root")
if (!root) throw new Error("Root element missing")

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
