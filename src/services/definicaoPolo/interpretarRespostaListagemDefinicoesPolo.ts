import type { DefinicaoPolo, ListagemDefinicaoPolos } from './types'

const TIPO_POLO_PADRAO = 'Pendente'
const NOME_EDICAO_PADRAO = '-'

type PoloApi = {
  id: string
  dre: string
  tipoUe: string
  nomePolo: string
  gestao: string
  tipo?: string | null
  nomeEdicao?: string | null
  codigoEol?: string | null
}

function ehPoloApiValido(valor: unknown): valor is PoloApi {
  if (!valor || typeof valor !== 'object') {
    return false
  }

  const polo = valor as Record<string, unknown>

  return (
    typeof polo.id === 'string' &&
    typeof polo.dre === 'string' &&
    typeof polo.tipoUe === 'string' &&
    typeof polo.nomePolo === 'string' &&
    typeof polo.gestao === 'string'
  )
}

function mapearDefinicaoPolo(polo: PoloApi): DefinicaoPolo {
  const nomeEdicao =
    typeof polo.nomeEdicao === 'string' && polo.nomeEdicao.trim()
      ? polo.nomeEdicao
      : NOME_EDICAO_PADRAO
  const tipoPolo =
    typeof polo.tipo === 'string' && polo.tipo.trim()
      ? polo.tipo
      : TIPO_POLO_PADRAO

  return {
    id: polo.id,
    dre: polo.dre,
    tipoUe: polo.tipoUe,
    nomeUe: polo.nomePolo,
    nomeEdicao,
    tipoPolo,
    gestao: polo.gestao,
  }
}

export function interpretarRespostaListagemDefinicoesPolo(
  dados: unknown,
): ListagemDefinicaoPolos | null {
  if (!dados || typeof dados !== 'object') {
    return null
  }

  const resposta = dados as Record<string, unknown>

  if (
    !Array.isArray(resposta.results) ||
    typeof resposta.page !== 'number' ||
    typeof resposta.pageSize !== 'number' ||
    typeof resposta.total !== 'number' ||
    typeof resposta.totalPages !== 'number'
  ) {
    return null
  }

  return {
    polos: resposta.results.filter(ehPoloApiValido).map(mapearDefinicaoPolo),
    pagina: resposta.page,
    tamanhoPagina: resposta.pageSize,
    total: resposta.total,
    totalPaginas: resposta.totalPages,
  }
}
