export function calcularIdade(dataNascimento: string, hoje = new Date()) {
  const partes = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(dataNascimento)
  if (!partes) return ''

  const dia = Number(partes[1])
  const mes = Number(partes[2])
  const ano = Number(partes[3])
  const nascimento = new Date(ano, mes - 1, dia)

  if (
    nascimento.getFullYear() !== ano ||
    nascimento.getMonth() !== mes - 1 ||
    nascimento.getDate() !== dia
  ) {
    return ''
  }

  let idade = hoje.getFullYear() - ano
  const aniversarioNesteAno = new Date(hoje.getFullYear(), mes - 1, dia)
  if (hoje < aniversarioNesteAno) idade -= 1

  if (idade < 0) return ''

  return String(idade)
}
