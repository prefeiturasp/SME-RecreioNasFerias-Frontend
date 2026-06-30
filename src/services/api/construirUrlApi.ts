import { obterApiBaseUrl } from '../../config/variaveisAmbiente'

export function construirUrlApi(path: string): string {
  const configuredBaseUrl = obterApiBaseUrl()
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  if (!configuredBaseUrl) {
    return normalizedPath
  }

  const normalizedBase = configuredBaseUrl.endsWith('/')
    ? configuredBaseUrl.slice(0, -1)
    : configuredBaseUrl

  return `${normalizedBase}${normalizedPath}`
}
