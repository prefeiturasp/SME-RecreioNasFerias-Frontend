export function formatarDataBr(dataIso: string): string {
  const [ano, mes, dia] = dataIso.split('-')
  if (!ano || !mes || !dia) return dataIso
  return `${dia}/${mes}/${ano}`
}

export function formatarPeriodo(dataInicio: string, dataFim: string): string {
  return `${formatarDataBr(dataInicio)} - ${formatarDataBr(dataFim)}`
}
