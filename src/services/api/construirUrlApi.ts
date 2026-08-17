import { obterApiBaseUrl } from '../../config/variaveisAmbiente'

export function construirUrlApi(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const baseUrl = obterApiBaseUrl()

  if (baseUrl.length === 0) {
    return normalizedPath
  }

  return `${baseUrl.replace(/\/+$/, '')}${normalizedPath}`
}
