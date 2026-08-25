export type EdicaoPrograma = {
  uuid: string
  nome: string
  data_inicio: string
  data_fim: string
  inscricoes_inicio: string
  inscricoes_fim: string
  quantidade_inscritos: number
  quantidade_atendimento_efetivo: number
  quantidade_passeios: number
  quantidade_apresentacoes: number
}

export type DadosCadastroEdicaoPrograma = {
  nome: string
  dataInicioEdicao: string
  dataFimEdicao: string
  dataInicioInscricoes: string
  dataFimInscricoes: string
}
