export function extrairDigitos(valor: string): string {
  return valor.replaceAll(/\D/g, '')
}

export function validarCpf(cpf: string): boolean {
  const entradaValida =
    /^\d{11}$/.test(cpf) || /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf)
  if (!entradaValida) return false

  const digitos = extrairDigitos(cpf)
  if (/^(\d)\1{10}$/.test(digitos)) return false

  for (const tamanhoBase of [9, 10]) {
    let soma = 0
    for (let indice = 0; indice < tamanhoBase; indice++) {
      soma += Number(digitos[indice]) * (tamanhoBase + 1 - indice)
    }

    const resto = soma % 11
    const digitoVerificador = resto < 2 ? 0 : 11 - resto
    if (Number(digitos[tamanhoBase]) !== digitoVerificador) return false
  }

  return true
}

export function aplicarMascaraData(valor: string): string {
  const digitos = extrairDigitos(valor).slice(0, 8)
  if (digitos.length <= 2) return digitos
  if (digitos.length <= 4) return `${digitos.slice(0, 2)}/${digitos.slice(2)}`
  return `${digitos.slice(0, 2)}/${digitos.slice(2, 4)}/${digitos.slice(4)}`
}

export function aplicarMascaraCep(valor: string): string {
  const digitos = extrairDigitos(valor).slice(0, 8)

  if (digitos.length <= 5) {
    return digitos
  }

  return `${digitos.slice(0, 5)}-${digitos.slice(5)}`
}

export function aplicarMascaraTelefone(valor: string): string {
  const digitos = extrairDigitos(valor).slice(0, 11)

  if (digitos.length === 0) {
    return ''
  }

  if (digitos.length <= 2) {
    return `(${digitos}`
  }

  if (digitos.length <= 6) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`
  }

  if (digitos.length <= 10) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`
  }

  return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`
}

export function aplicarMascaraCpf(valor: string): string {
  const digitos = extrairDigitos(valor).slice(0, 11)

  if (digitos.length <= 3) {
    return digitos
  }

  if (digitos.length <= 6) {
    return `${digitos.slice(0, 3)}.${digitos.slice(3)}`
  }

  if (digitos.length <= 9) {
    return `${digitos.slice(0, 3)}.${digitos.slice(3, 6)}.${digitos.slice(6)}`
  }

  return `${digitos.slice(0, 3)}.${digitos.slice(3, 6)}.${digitos.slice(6, 9)}-${digitos.slice(9)}`
}
