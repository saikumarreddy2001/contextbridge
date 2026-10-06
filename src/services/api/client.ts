const env = import.meta.env as ImportMetaEnv & { VITE_API_BASE_URL?: string }
const configured = env.VITE_API_BASE_URL?.replace(/\/$/, "")
const API_ORIGIN = configured || "http://127.0.0.1:8077"

export function apiUrl(path: string): string {
  return `${API_ORIGIN}${path}`
}

export async function apiGet<T>(path: string): Promise<T> {
  return readJson<T>(await request(path))
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  return readJson<T>(
    await request(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  )
}

async function request(path: string, init?: RequestInit): Promise<Response> {
  try {
    return await fetch(apiUrl(path), init)
  } catch {
    throw new Error("The reconstruction service could not be reached.")
  }
}

async function readJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`The reconstruction service returned ${response.status}.`)
  }
  return response.json() as Promise<T>
}

export const atlasApiProject = "project-atlas"
