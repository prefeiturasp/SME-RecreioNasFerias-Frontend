export type IdadeDetalhada = {
  anos: number
  meses: number
  dias: number
}

export function calcularIdadeDetalhada(
  dataNascimento: string,
  hoje: Date = new Date(),
): IdadeDetalhada | null {
  const correspondencia = /^(\d{4})-(\d{2})-(\d{2})/.exec(
    dataNascimento.trim(),
  )
  if (!correspondencia) return null

  const ano = Number(correspondencia[1])
  const mes = Number(correspondencia[2])
  const dia = Number(correspondencia[3])
  const nascimento = new Date(ano, mes - 1, dia)
  if (
    nascimento.getFullYear() !== ano ||
    nascimento.getMonth() !== mes - 1 ||
    nascimento.getDate() !== dia
  ) {
    return null
  }

  let anos = hoje.getFullYear() - ano
  let meses = hoje.getMonth() + 1 - mes
  let dias = hoje.getDate() - dia

  if (dias < 0) {
    meses -= 1
    dias += new Date(hoje.getFullYear(), hoje.getMonth(), 0).getDate()
  }
  if (meses < 0) {
    anos -= 1
    meses += 12
  }
  if (anos < 0) return null

  return { anos, meses, dias }
}

function pluralizar(valor: number, singular: string, plural: string) {
  return `${valor} ${valor === 1 ? singular : plural}`
}

export function formatarIdadeDetalhada(dataNascimento: string): string {
  const idade = calcularIdadeDetalhada(dataNascimento)
  if (!idade) return ''

  return [
    pluralizar(idade.anos, 'ano', 'anos'),
    pluralizar(idade.meses, 'mês', 'meses'),
    pluralizar(idade.dias, 'dia', 'dias'),
  ].join(', ')
}
