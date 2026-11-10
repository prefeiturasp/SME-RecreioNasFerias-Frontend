import { describe, expect, it } from 'vitest'

import {
  calcularIdadeDetalhada,
  formatarIdadeDetalhada,
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

describe('formatarIdadeDetalhada', () => {
  it('devolve vazio sem data válida', () => {
    expect(formatarIdadeDetalhada('')).toBe('')
  })

  it('formata com singular e plural', () => {
    const nascimento = new Date()
    nascimento.setFullYear(nascimento.getFullYear() - 1)
    const iso = `${nascimento.getFullYear()}-${String(nascimento.getMonth() + 1).padStart(2, '0')}-${String(nascimento.getDate()).padStart(2, '0')}`

    expect(formatarIdadeDetalhada(iso)).toBe('1 ano, 0 meses, 0 dias')
  })
})
