import type { ListagemPolosParceiros, PoloParceiro } from './types'

type PoloParceiroApi = {
  id: string
  dre: string
  tipoUe: string
  nomePolo: string
  nomeOsc: string
}

function ehPoloParceiroApiValido(valor: unknown): valor is PoloParceiroApi {
  if (!valor || typeof valor !== 'object') return false

  const polo = valor as PoloParceiroApi

  return (
    typeof polo.id === 'string' &&
    typeof polo.dre === 'string' &&
    typeof polo.tipoUe === 'string' &&
    typeof polo.nomePolo === 'string' &&
    typeof polo.nomeOsc === 'string'
  )
}

function mapearPoloParceiro(polo: PoloParceiroApi): PoloParceiro {
  return {
    id: polo.id,
    dre: polo.dre,
    tipoUe: polo.tipoUe,
    nomePolo: polo.nomePolo,
    nomeOsc: polo.nomeOsc,
  }
}

export function interpretarRespostaListagemPolosParceirosPaginada(
  dados: unknown,
): ListagemPolosParceiros | null {
  if (!dados || typeof dados !== 'object') return null

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
    polos: resposta.results
      .filter(ehPoloParceiroApiValido)
      .map(mapearPoloParceiro),
    pagina: resposta.page,
    tamanhoPagina: resposta.pageSize,
    total: resposta.total,
    totalPaginas: resposta.totalPages,
  }
}
