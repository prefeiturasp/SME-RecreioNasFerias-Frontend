export function buildApiUrl(path: string): string {
  const configuredBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? '').trim()
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  if (!configuredBaseUrl) {
    return normalizedPath
  }

  const normalizedBase = configuredBaseUrl.endsWith('/')
    ? configuredBaseUrl.slice(0, -1)
    : configuredBaseUrl

  return `${normalizedBase}${normalizedPath}`
}
