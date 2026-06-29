import type { DreNomeAbreviacao } from './types'

function interpretarDreNomeAbreviacao(dado: unknown): DreNomeAbreviacao | null {
  if (typeof dado !== 'object' || dado === null) {
    return null
  }

  const registro = dado as Record<string, unknown>

  if (
    typeof registro.codigo !== 'string' ||
    typeof registro.nome !== 'string' ||
    typeof registro.abreviacao !== 'string'
  ) {
    return null
  }

  return {
    codigo: registro.codigo,
    nome: registro.nome,
    abreviacao: registro.abreviacao,
  }
}

export function interpretarRespostaDresNomeAbreviacao(
  dados: unknown,
): DreNomeAbreviacao[] | null {
  if (!Array.isArray(dados)) {
    return null
  }

  const dres = dados
    .map(interpretarDreNomeAbreviacao)
    .filter((dre): dre is DreNomeAbreviacao => dre !== null)

  if (dres.length !== dados.length) {
    return null
  }

  return dres
}
