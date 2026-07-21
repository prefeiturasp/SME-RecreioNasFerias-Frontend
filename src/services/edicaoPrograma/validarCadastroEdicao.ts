import type { DadosCadastroEdicaoPrograma } from './types'

function validarPeriodo(
  dataInicio: string,
  dataFim: string,
  nomePeriodo: string,
): string | null {
  if (!dataInicio || !dataFim) return null

  if (dataInicio > dataFim) {
    return `No ${nomePeriodo}, a data "De" não pode ser maior que a data "Até".`
  }

  return null
}

export function validarPeriodoEdicao(
  dataInicio: string,
  dataFim: string,
): string | null {
  return validarPeriodo(dataInicio, dataFim, 'período da edição')
}

export function validarPeriodoInscricoes(
  dataInicio: string,
  dataFim: string,
): string | null {
  return validarPeriodo(dataInicio, dataFim, 'período das inscrições')
}

export function validarInscricoesAntesDoInicioEdicao(
  dataFimInscricoes: string,
  dataInicioEdicao: string,
): string | null {
  if (!dataFimInscricoes || !dataInicioEdicao) return null

  if (dataFimInscricoes > dataInicioEdicao) {
    return 'O período das inscrições não pode ser maior que o início do período da edição.'
  }

  return null
}

export function validarCadastroEdicao(
  dados: DadosCadastroEdicaoPrograma,
): string | null {
  return (
    validarPeriodoEdicao(dados.dataInicioEdicao, dados.dataFimEdicao) ??
    validarPeriodoInscricoes(
      dados.dataInicioInscricoes,
      dados.dataFimInscricoes,
    ) ??
    validarInscricoesAntesDoInicioEdicao(
      dados.dataFimInscricoes,
      dados.dataInicioEdicao,
    )
  )
}

export function formularioCadastroEstaPreenchido(
  dados: DadosCadastroEdicaoPrograma,
): boolean {
  return (
    dados.nome.trim().length > 0 &&
    dados.dataInicioEdicao.trim().length > 0 &&
    dados.dataFimEdicao.trim().length > 0 &&
    dados.dataInicioInscricoes.trim().length > 0 &&
    dados.dataFimInscricoes.trim().length > 0
  )
}
