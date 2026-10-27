import { describe, expect, it } from 'vitest'

import { calcularIdadeCheia } from './calcularIdadeCheia'

describe('calcularIdadeCheia', () => {
  it('conta anos completos antes do aniversário', () => {
    expect(calcularIdadeCheia('2019-05-19', new Date(2026, 4, 18))).toBe(6)
    expect(calcularIdadeCheia('2019-05-19', new Date(2026, 4, 18, 23, 59))).toBe(
      6,
    )
  })

  it('aumenta a idade no dia do aniversário', () => {
    expect(calcularIdadeCheia('2019-05-19', new Date(2026, 4, 19))).toBe(7)
  })

  it('trata 29 de fevereiro como 1º de março em ano não bissexto', () => {
    expect(calcularIdadeCheia('2020-02-29', new Date(2021, 1, 28))).toBe(0)
    expect(calcularIdadeCheia('2020-02-29', new Date(2021, 2, 1))).toBe(1)
    expect(calcularIdadeCheia('2020-02-29', new Date(2024, 1, 29))).toBe(4)
  })

  it('devolve null sem data de nascimento', () => {
    expect(calcularIdadeCheia('')).toBeNull()
    expect(calcularIdadeCheia('   ')).toBeNull()
  })

  it('devolve null para data inválida', () => {
    expect(calcularIdadeCheia('2021-02-29', new Date(2026, 0, 1))).toBeNull()
    expect(calcularIdadeCheia('nao-e-data')).toBeNull()
  })
})
