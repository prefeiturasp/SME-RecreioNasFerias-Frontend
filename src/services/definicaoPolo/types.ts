export type DefinicaoPoloApi = {
  id: string
  dre: string
  tipoUe: string
  nomePolo: string
  gestao: string
  tipo?: string | null
  nomeEdicao?: string | null
}

export type RespostaListagemDefinicoesPoloApi = {
  results: DefinicaoPoloApi[]
  page: number
  pageSize: number
  total: number
  totalPages: number
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

export type OpcoesFiltroDefinicaoPolos = {
  dres: string[]
  tiposUe: string[]
  gestoes: string[]
  nomesEdicao: string[]
  tiposPolo: string[]
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
