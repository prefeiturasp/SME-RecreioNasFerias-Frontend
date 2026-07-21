import { describe, expect, it } from 'vitest'

import { interpretarRespostaDresNomeAbreviacao } from './interpretarRespostaDresNomeAbreviacao'

describe('interpretarRespostaDresNomeAbreviacao', () => {
  it('interpreta lista válida de DREs', () => {
    expect(
      interpretarRespostaDresNomeAbreviacao([
        {
          codigo: '108100',
          nome: 'DIRETORIA REGIONAL DE EDUCACAO BUTANTA',
          abreviacao: 'DRE - BT',
        },
      ]),
    ).toEqual([
      {
        codigo: '108100',
        nome: 'DIRETORIA REGIONAL DE EDUCACAO BUTANTA',
        abreviacao: 'DRE - BT',
      },
    ])
  })

  it('retorna null quando a resposta não é um array', () => {
    expect(interpretarRespostaDresNomeAbreviacao({})).toBeNull()
  })

  it('retorna null quando algum item é inválido', () => {
    expect(
      interpretarRespostaDresNomeAbreviacao([
        {
          codigo: '108100',
          nome: 'DIRETORIA REGIONAL DE EDUCACAO BUTANTA',
          abreviacao: 'DRE - BT',
        },
        { codigo: '108200' },
      ]),
    ).toBeNull()
  })
})
