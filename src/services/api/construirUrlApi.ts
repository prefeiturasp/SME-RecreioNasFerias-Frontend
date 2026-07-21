export function construirUrlApi(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return normalizedPath
}
