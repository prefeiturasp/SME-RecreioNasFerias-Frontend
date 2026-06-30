export function construirUrlSmeIntegracaoApi(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  if (import.meta.env.DEV) {
    return `/sme-integracao-api${normalizedPath}`
  }

  const configuredBaseUrl = (
    import.meta.env.VITE_SME_INTEGRACAO_API_BASE_URL ?? ''
  ).trim()

  if (!configuredBaseUrl) {
    return `/sme-integracao-api${normalizedPath}`
  }

  const normalizedBase = configuredBaseUrl.endsWith('/')
    ? configuredBaseUrl.slice(0, -1)
    : configuredBaseUrl

  return `${normalizedBase}${normalizedPath}`
}
