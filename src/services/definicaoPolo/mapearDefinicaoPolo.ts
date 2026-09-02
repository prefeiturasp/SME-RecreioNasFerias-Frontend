import type { DefinicaoPolo, DefinicaoPoloApi } from './types'

const TIPO_POLO_PADRAO = 'Pendente'
const NOME_EDICAO_PADRAO = '-'

export function mapearDefinicaoPolo(polo: DefinicaoPoloApi): DefinicaoPolo {
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
