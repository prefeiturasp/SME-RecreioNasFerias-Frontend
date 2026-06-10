import { describe, expect, it } from 'vitest'
import { montarPaginasVisiveis } from './montarPaginasVisiveis'

describe('montarPaginasVisiveis', () => {
  it('retorna todas as páginas quando o total é pequeno', () => {
    expect(montarPaginasVisiveis(1, 5)).toEqual([1, 2, 3, 4, 5])
  })

  it('monta páginas iniciais com reticências e última página', () => {
    expect(montarPaginasVisiveis(1, 20)).toEqual([
      1,
      2,
      3,
      4,
      5,
      'ellipsis',
      20,
    ])
  })

  it('monta páginas intermediárias com reticências nas extremidades', () => {
    expect(montarPaginasVisiveis(10, 20)).toEqual([
      1,
      'ellipsis',
      9,
      10,
      11,
      'ellipsis',
      20,
    ])
  })

  it('monta páginas finais com reticências no início', () => {
    expect(montarPaginasVisiveis(20, 20)).toEqual([
      1,
      'ellipsis',
      16,
      17,
      18,
      19,
      20,
    ])
  })
})
