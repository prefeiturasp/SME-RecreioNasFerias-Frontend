import { describe, expect, it } from 'vitest'

import { calcularTotalInscritos } from './calcularTotalInscritos'

describe('calcularTotalInscritos', () => {
  it('aplica 30% e arredonda para baixo', () => {
    expect(calcularTotalInscritos(10)).toBe(13)
    expect(calcularTotalInscritos(11)).toBe(14)
  })

  it('retorna 0 para valores inválidos', () => {
    expect(calcularTotalInscritos(Number.NaN)).toBe(0)
    expect(calcularTotalInscritos(-1)).toBe(0)
  })
})
