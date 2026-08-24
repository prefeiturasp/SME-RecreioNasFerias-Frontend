import { describe, expect, it } from 'vitest'
import { formatarDataBr, formatarPeriodo } from './formatarPeriodo'

describe('formatarPeriodo', () => {
  it('formata data no padrão brasileiro', () => {
    expect(formatarDataBr('2026-01-26')).toBe('26/01/2026')
  })

  it('formata período com intervalo', () => {
    expect(formatarPeriodo('2026-01-26', '2026-02-26')).toBe(
      '26/01/2026 - 26/02/2026',
    )
  })
})
