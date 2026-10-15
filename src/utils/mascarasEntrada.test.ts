import { describe, expect, it } from 'vitest'

import {
  aplicarMascaraCep,
  aplicarMascaraCpf,
  aplicarMascaraTelefone,
} from './mascarasEntrada'

describe('aplicarMascaraCep', () => {
  it('mantém o CEP sem hífen enquanto houver até cinco dígitos', () => {
    expect(aplicarMascaraCep('01310')).toBe('01310')
  })

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
  it('mantém o telefone vazio quando não há dígitos', () => {
    expect(aplicarMascaraTelefone('abc')).toBe('')
  })

  it('formata entradas curtas de telefone', () => {
    expect(aplicarMascaraTelefone('1')).toBe('(1')
    expect(aplicarMascaraTelefone('119')).toBe('(11) 9')
    expect(aplicarMascaraTelefone('119999')).toBe('(11) 9999')
  })

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

describe('aplicarMascaraCpf', () => {
  it('mantém o CPF sem pontuação enquanto houver até três dígitos', () => {
    expect(aplicarMascaraCpf('123')).toBe('123')
  })

  it('adiciona a primeira pontuação após o terceiro dígito', () => {
    expect(aplicarMascaraCpf('1234')).toBe('123.4')
    expect(aplicarMascaraCpf('123456')).toBe('123.456')
  })

  it('adiciona a segunda pontuação após o sexto dígito', () => {
    expect(aplicarMascaraCpf('1234567')).toBe('123.456.7')
    expect(aplicarMascaraCpf('123456789')).toBe('123.456.789')
  })

  it('adiciona o hífen e limita o CPF a onze dígitos', () => {
    expect(aplicarMascaraCpf('12345678901')).toBe('123.456.789-01')
    expect(aplicarMascaraCpf('12345678901234')).toBe('123.456.789-01')
  })

  it('remove caracteres não numéricos', () => {
    expect(aplicarMascaraCpf('123.456.789-01-extra')).toBe('123.456.789-01')
  })
})
