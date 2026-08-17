import { obterApiBaseUrl } from '../../config/variaveisAmbiente'

function removerBarrasFinais(url: string): string {
  let fim = url.length
  while (fim > 0 && url[fim - 1] === '/') {
    fim -= 1
  }

  return url.slice(0, fim)
}

export function construirUrlApi(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const baseUrl = obterApiBaseUrl()

  if (baseUrl.length === 0) {
    return normalizedPath
  }

  return `${removerBarrasFinais(baseUrl)}${normalizedPath}`
}
