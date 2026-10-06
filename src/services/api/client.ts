const env = import.meta.env as ImportMetaEnv & { VITE_API_URL?: string }
const API_ORIGIN = env.VITE_API_URL ?? "http://127.0.0.1:8077"

export function apiUrl(path: string): string {
  return `${API_ORIGIN}${path}`
}

export async function apiGet<T>(path: string): Promise<T> {
  let response: Response
  try {
    response = await fetch(apiUrl(path))
  } catch {
    throw new Error("The reconstruction service could not be reached.")
  }
  if (!response.ok) {
    throw new Error(`The reconstruction service returned ${response.status}.`)
  }
  return response.json() as Promise<T>
}

export const atlasApiProject = "project-atlas"
