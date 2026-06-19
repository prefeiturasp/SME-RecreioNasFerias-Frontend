export type ItemPaginaVisivel =
  | {
      tipo: 'pagina'
      chave: string
      numero: number
    }
  | {
      tipo: 'ellipsis'
      chave: string
    }

function paginaVisivel(numero: number): ItemPaginaVisivel {
  return {
    tipo: 'pagina',
    chave: `pagina-${numero}`,
    numero,
  }
}

function reticenciasVisiveis(chave: string): ItemPaginaVisivel {
  return {
    tipo: 'ellipsis',
    chave,
  }
}

export function montarPaginasVisiveis(
  paginaAtual: number,
  totalPaginas: number,
): ItemPaginaVisivel[] {
  if (totalPaginas <= 0) return []

  if (totalPaginas <= 7) {
    return Array.from({ length: totalPaginas }, (_, index) =>
      paginaVisivel(index + 1),
    )
  }

  if (paginaAtual <= 4) {
    return [
      paginaVisivel(1),
      paginaVisivel(2),
      paginaVisivel(3),
      paginaVisivel(4),
      paginaVisivel(5),
      reticenciasVisiveis('ellipsis-inicio-fim'),
      paginaVisivel(totalPaginas),
    ]
  }

  if (paginaAtual >= totalPaginas - 3) {
    return [
      paginaVisivel(1),
      reticenciasVisiveis('ellipsis-inicio-meio'),
      paginaVisivel(totalPaginas - 4),
      paginaVisivel(totalPaginas - 3),
      paginaVisivel(totalPaginas - 2),
      paginaVisivel(totalPaginas - 1),
      paginaVisivel(totalPaginas),
    ]
  }

  return [
    paginaVisivel(1),
    reticenciasVisiveis('ellipsis-inicio-meio'),
    paginaVisivel(paginaAtual - 1),
    paginaVisivel(paginaAtual),
    paginaVisivel(paginaAtual + 1),
    reticenciasVisiveis('ellipsis-meio-fim'),
    paginaVisivel(totalPaginas),
  ]
}
