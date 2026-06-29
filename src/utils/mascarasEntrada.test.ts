import { describe, expect, it } from 'vitest'

import { aplicarMascaraCep, aplicarMascaraTelefone } from './mascarasEntrada'

describe('aplicarMascaraCep', () => {
  it('formata CEP com hífen após o quinto dígito', () => {
    expect(aplicarMascaraCep('01310100')).toBe('01310-100')
    expect(aplicarMascaraCep('01310-100')).toBe('01310-100')
  })

  it('remove caracteres não numéricos e limita a 8 dígitos', () => {
    expect(aplicarMascaraCep('01310-100-extra')).toBe('01310-100')
    expect(aplicarMascaraCep('013101001234')).toBe('01310-100')
  })
})

describe('aplicarMascaraTelefone', () => {
  it('formata telefone fixo com 10 dígitos', () => {
    expect(aplicarMascaraTelefone('1133334444')).toBe('(11) 3333-4444')
  })

  it('formata celular com 11 dígitos', () => {
    expect(aplicarMascaraTelefone('11999998888')).toBe('(11) 99999-8888')
  })

  it('remove caracteres não numéricos e limita a 11 dígitos', () => {
    expect(aplicarMascaraTelefone('(11) 99999-8888-extra')).toBe(
      '(11) 99999-8888',
    )
    expect(aplicarMascaraTelefone('119999988881234')).toBe('(11) 99999-8888')
  })
})
