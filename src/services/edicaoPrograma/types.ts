export type EdicaoPrograma = {
  id: string
  nome: string
  dataInicioEdicao: string
  dataFimEdicao: string
  dataInicioInscricoes: string
  dataFimInscricoes: string
  quantidadeInscritos: number
  quantidadeAtendimentoEfetivo: number
  quantidadePasseios: number
  quantidadeApresentacoes: number
}

export type DadosCadastroEdicaoPrograma = {
  nome: string
  dataInicioEdicao: string
  dataFimEdicao: string
  dataInicioInscricoes: string
  dataFimInscricoes: string
}
