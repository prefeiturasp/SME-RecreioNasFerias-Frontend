export function formatarDataBr(dataIso?: string | null): string {
  if (!dataIso) return ''

  const [ano, mes, dia] = dataIso.split('-')
  if (!ano || !mes || !dia) return dataIso
  return `${dia}/${mes}/${ano}`
}

export function formatarPeriodo(
  dataInicio?: string | null,
  dataFim?: string | null,
): string {
  return `${formatarDataBr(dataInicio)} - ${formatarDataBr(dataFim)}`
}
