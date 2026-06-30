import { obterSmeIntegracaoApiBaseUrl } from '../../config/variaveisAmbiente'

export function construirUrlSmeIntegracaoApi(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  if (import.meta.env.DEV) {
    return `/sme-integracao-api${normalizedPath}`
  }

  const configuredBaseUrl = obterSmeIntegracaoApiBaseUrl()

  if (!configuredBaseUrl) {
    return `/sme-integracao-api${normalizedPath}`
  }

  const normalizedBase = configuredBaseUrl.endsWith('/')
    ? configuredBaseUrl.slice(0, -1)
    : configuredBaseUrl

  return `${normalizedBase}${normalizedPath}`
}
