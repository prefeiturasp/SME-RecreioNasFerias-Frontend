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

export function validarFimInscricoesAteFimEdicao(
  dataFimInscricoes: string,
  dataFimEdicao: string,
): string | null {
  if (!dataFimInscricoes || !dataFimEdicao) return null

  if (dataFimInscricoes > dataFimEdicao) {
    return 'A data fim das inscrições não pode ser posterior à data fim da edição.'
  }

  return null
}
