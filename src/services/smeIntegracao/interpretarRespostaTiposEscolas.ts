import type { TipoEscola } from './types'

function interpretarTipoEscola(dado: unknown): TipoEscola | null {
  if (typeof dado !== 'object' || dado === null) {
    return null
  }

  const registro = dado as Record<string, unknown>

  if (
    typeof registro.codigo !== 'number' ||
    typeof registro.descricaoSigla !== 'string' ||
    typeof registro.dtAtualizacao !== 'string'
  ) {
    return null
  }

  return {
    codigo: registro.codigo,
    descricaoSigla: registro.descricaoSigla,
    dtAtualizacao: registro.dtAtualizacao,
  }
}

export function interpretarRespostaTiposEscolas(
  dados: unknown,
): TipoEscola[] | null {
  if (!Array.isArray(dados)) {
    return null
  }

  const tiposEscolas = dados
    .map(interpretarTipoEscola)
    .filter((tipoEscola): tipoEscola is TipoEscola => tipoEscola !== null)

  if (tiposEscolas.length !== dados.length) {
    return null
  }

  return tiposEscolas
}
