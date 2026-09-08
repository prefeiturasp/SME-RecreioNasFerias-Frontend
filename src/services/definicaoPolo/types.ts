export type DefinicaoPoloApi = {
  polo_uuid: string
  codigo_eol: string
  nome_polo: string
  dre_nome: string
  dre_codigo_eol: string
  tipo_ue: string
  gestao: string
  status: string
  ativo: boolean
  definicao_uuid: string | null
  edicao_uuid: string | null
  nome_edicao: string | null
  tipo_polo_edicao: string | null
  projecao_inscritos_edicao: number | null
  total_inscritos_edicao: number | null
}

export type FiltrosListagemDefinicaoPolos = {
  dre: string
  tipoUe: string
  nomeUeOuCodigoEol: string
  nomeEdicao: string
  tipoPolo: string
  gestao: string
}

export type ResultadoSincronizacaoUnidadesDiretas = {
  totalConsultados: number
  totalNovos: number
  totalJaExistentes: number
  executada: boolean
  motivoIgnorada: string | null
  ultimaExecucaoEm: string | null
}

export type ParametrosAtualizacaoDefinicoesPoloEmLote = {
  ids: string[]
  nomeEdicao?: string
  tipo?: string
}

export type ResultadoAtualizacaoDefinicoesPoloEmLote = {
  totalAtualizados: number
}

export const FILTROS_LISTAGEM_DEFINICAO_POLOS_INICIAIS: FiltrosListagemDefinicaoPolos =
  {
    dre: '',
    tipoUe: '',
    nomeUeOuCodigoEol: '',
    nomeEdicao: '',
    tipoPolo: '',
    gestao: '',
  }
