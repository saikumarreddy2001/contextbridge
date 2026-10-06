type Listener = () => void

function readStored(key: string): string | null {
  if (typeof localStorage === "undefined") return null
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

export function createStoredString<T extends string>(
  key: string,
  fallback: T,
  isAllowed: (value: string) => boolean,
) {
  const listeners = new Set<Listener>()
  let current: T = fallback
  let loaded = false

  function load(): T {
    if (loaded) return current
    loaded = true
    const stored = readStored(key)
    if (stored !== null && isAllowed(stored)) current = stored as T
    return current
  }

  function subscribe(listener: Listener) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }

  function getSnapshot(): T {
    return load()
  }

  function set(next: T) {
    load()
    if (next === current) return
    current = next
    try {
      localStorage.setItem(key, next)
    } catch {
      // Ignore storage failures so the in-memory selection still updates.
    }
    for (const listener of listeners) listener()
  }

  return { subscribe, getSnapshot, set }
}
