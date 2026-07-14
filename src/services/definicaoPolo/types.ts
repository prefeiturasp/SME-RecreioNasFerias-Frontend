export type DefinicaoPolo = {
  id: string
  dre: string
  tipoUe: string
  nomeUe: string
  nomeEdicao: string
  tipoPolo: string
  gestao: string
}

export type FiltrosListagemDefinicaoPolos = {
  dre: string
  tipoUe: string
  nomeUeOuCodigoEol: string
  nomeEdicao: string
  tipoPolo: string
  gestao: string
}

export type ParametrosListagemDefinicaoPolos = FiltrosListagemDefinicaoPolos & {
  pagina?: number
  tamanhoPagina?: number
}

export type ListagemDefinicaoPolos = {
  polos: DefinicaoPolo[]
  pagina: number
  tamanhoPagina: number
  total: number
  totalPaginas: number
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

export const FILTROS_LISTAGEM_DEFINICAO_POLOS_INICIAIS: FiltrosListagemDefinicaoPolos =
  {
    dre: '',
    tipoUe: '',
    nomeUeOuCodigoEol: '',
    nomeEdicao: '',
    tipoPolo: '',
    gestao: '',
  }
