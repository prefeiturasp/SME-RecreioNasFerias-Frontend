import { describe, expect, it } from 'vitest'
import { calcularIdade } from './calcularIdade'

describe('calcularIdade', () => {
  const hoje = new Date(2026, 8, 25)

  it('retorna vazio quando a data não está completa', () => {
    expect(calcularIdade('', hoje)).toBe('')
    expect(calcularIdade('32/13/2020', hoje)).toBe('')
  })

  it('calcula a idade completa em anos', () => {
    expect(calcularIdade('25/09/2016', hoje)).toBe('10')
    expect(calcularIdade('26/09/2016', hoje)).toBe('9')
  })
})
