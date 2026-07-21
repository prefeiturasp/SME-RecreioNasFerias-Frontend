export function construirUrlSmeIntegracaoApi(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `/sme-integracao-api${normalizedPath}`
}
