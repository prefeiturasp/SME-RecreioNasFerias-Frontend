import { describe, expect, it } from 'vitest'

import {
  calcularIdadeDetalhada,
  formatarIdadePorExtenso,
} from './calcularIdadeDetalhada'

describe('calcularIdadeDetalhada', () => {
  it('calcula anos, meses e dias completos', () => {
    expect(calcularIdadeDetalhada('2019-05-19', new Date(2026, 6, 25))).toEqual(
      { anos: 7, meses: 2, dias: 6 },
    )
  })

  it('empresta dias do mês anterior quando o dia ainda não chegou', () => {
    expect(calcularIdadeDetalhada('2020-01-31', new Date(2020, 1, 1))).toEqual({
      anos: 0,
      meses: 0,
      dias: 1,
    })
    expect(calcularIdadeDetalhada('2019-05-19', new Date(2026, 4, 18))).toEqual(
      { anos: 6, meses: 11, dias: 29 },
    )
  })

  it('zera tudo no dia do nascimento', () => {
    expect(calcularIdadeDetalhada('2026-05-19', new Date(2026, 4, 19))).toEqual(
      { anos: 0, meses: 0, dias: 0 },
    )
  })

  it('devolve null para vazio, data inválida ou futura', () => {
    expect(calcularIdadeDetalhada('')).toBeNull()
    expect(calcularIdadeDetalhada('2021-02-29')).toBeNull()
    expect(calcularIdadeDetalhada('2999-01-01')).toBeNull()
  })
})

describe('formatarIdadePorExtenso', () => {
  const hoje = new Date(2026, 9, 18)

  it('flexiona ano, mês e dia no singular e no plural', () => {
    expect(formatarIdadePorExtenso('2025-09-17', hoje)).toBe(
      '1 ano, 1 mês e 1 dia',
    )
    expect(formatarIdadePorExtenso('2025-05-19', hoje)).toBe(
      '1 ano, 4 meses e 29 dias',
    )
    expect(formatarIdadePorExtenso('2019-10-18', hoje)).toBe(
      '7 anos, 0 meses e 0 dias',
    )
  })

  it('devolve vazio sem data válida', () => {
    expect(formatarIdadePorExtenso('', hoje)).toBe('')
    expect(formatarIdadePorExtenso('2999-01-01', hoje)).toBe('')
  })
})
