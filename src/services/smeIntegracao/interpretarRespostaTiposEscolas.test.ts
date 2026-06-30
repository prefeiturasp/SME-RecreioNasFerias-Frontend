import { describe, expect, it } from 'vitest'

import { interpretarRespostaTiposEscolas } from './interpretarRespostaTiposEscolas'

describe('interpretarRespostaTiposEscolas', () => {
  it('interpreta lista válida de tipos de escola', () => {
    expect(
      interpretarRespostaTiposEscolas([
        {
          codigo: 1,
          descricaoSigla: 'EMEF',
          dtAtualizacao: '2012-01-13T14:09:23.647',
        },
      ]),
    ).toEqual([
      {
        codigo: 1,
        descricaoSigla: 'EMEF',
        dtAtualizacao: '2012-01-13T14:09:23.647',
      },
    ])
  })

  it('retorna null quando a resposta não é um array', () => {
    expect(interpretarRespostaTiposEscolas({})).toBeNull()
  })

  it('retorna null quando algum item é inválido', () => {
    expect(
      interpretarRespostaTiposEscolas([
        {
          codigo: 1,
          descricaoSigla: 'EMEF',
          dtAtualizacao: '2012-01-13T14:09:23.647',
        },
        { codigo: 2 },
      ]),
    ).toBeNull()
  })
})
