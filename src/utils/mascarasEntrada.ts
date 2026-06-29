export function extrairDigitos(valor: string): string {
  return valor.replace(/\D/g, '')
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
