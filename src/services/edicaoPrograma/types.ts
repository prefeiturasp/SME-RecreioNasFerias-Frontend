export type EdicaoPrograma = {
  id: string
  nome: string
  dataInicioEdicao: string
  dataFimEdicao: string
  dataInicioInscricoes: string
  dataFimInscricoes: string
  quantidadeInscritos: number
  quantidadeAtendimentoEfetivo: number
}

export type NovaEdicaoPrograma = Omit<EdicaoPrograma, 'id'>

export type DadosCadastroEdicaoPrograma = {
  nome: string
  dataInicioEdicao: string
  dataFimEdicao: string
  dataInicioInscricoes: string
  dataFimInscricoes: string
}

export type ParametrosListagemEdicoesPrograma = {
  pagina?: number
  tamanhoPagina?: number
}

export type ListagemEdicoesPrograma = {
  edicoes: EdicaoPrograma[]
  pagina: number
  tamanhoPagina: number
  total: number
  totalPaginas: number
}
