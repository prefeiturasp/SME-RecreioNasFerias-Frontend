export type ItemPaginaVisivel = number | 'ellipsis'

export function montarPaginasVisiveis(
  paginaAtual: number,
  totalPaginas: number,
): ItemPaginaVisivel[] {
  if (totalPaginas <= 0) return []

  if (totalPaginas <= 7) {
    return Array.from({ length: totalPaginas }, (_, index) => index + 1)
  }

  if (paginaAtual <= 4) {
    return [1, 2, 3, 4, 5, 'ellipsis', totalPaginas]
  }

  if (paginaAtual >= totalPaginas - 3) {
    return [
      1,
      'ellipsis',
      totalPaginas - 4,
      totalPaginas - 3,
      totalPaginas - 2,
      totalPaginas - 1,
      totalPaginas,
    ]
  }

  return [
    1,
    'ellipsis',
    paginaAtual - 1,
    paginaAtual,
    paginaAtual + 1,
    'ellipsis',
    totalPaginas,
  ]
}
