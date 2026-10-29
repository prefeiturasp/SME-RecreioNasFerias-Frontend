type DataCalendario = {
  ano: number
  mes: number
  dia: number
}

export function calcularIdadeCheia(
  dataNascimento: string,
  hoje: Date = new Date(),
): number | null {
  const nascimento = interpretarData(dataNascimento)
  if (!nascimento) return null

  const anoHoje = hoje.getFullYear()
  const idade = anoHoje - nascimento.ano
  const aniversario = new Date(anoHoje, nascimento.mes - 1, nascimento.dia)
  const hojeNoCalendario = new Date(anoHoje, hoje.getMonth(), hoje.getDate())

  if (hojeNoCalendario < aniversario) return idade - 1
  return idade
}

function interpretarData(texto: string): DataCalendario | null {
  const correspondencia = /^(\d{4})-(\d{2})-(\d{2})/.exec(texto.trim())
  if (!correspondencia) return null

  const ano = Number(correspondencia[1])
  const mes = Number(correspondencia[2])
  const dia = Number(correspondencia[3])
  const data = new Date(ano, mes - 1, dia)
  if (
    data.getFullYear() !== ano ||
    data.getMonth() !== mes - 1 ||
    data.getDate() !== dia
  ) {
    return null
  }

  return { ano, mes, dia }
}
