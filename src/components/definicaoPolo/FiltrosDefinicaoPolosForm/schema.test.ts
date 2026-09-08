import { describe, expect, it } from 'vitest'
import filtrosDefinicaoPolosSchema from './schema'

const filtrosVazios = {
  dre: '',
  tipoUe: '',
  nomeUeOuCodigoEol: '',
  edicao: '',
  tipoPolo: '',
  gestao: '',
}

describe('FiltrosDefinicaoPolosForm schema', () => {
  it('aceita filtros vazios', () => {
    expect(filtrosDefinicaoPolosSchema.safeParse(filtrosVazios).success).toBe(
      true,
    )
  })

  it('aceita filtros preenchidos', () => {
    expect(
      filtrosDefinicaoPolosSchema.safeParse({
        dre: 'DIRETORIA REGIONAL DE EDUCACAO BUTANTA',
        tipoUe: 'EMEF',
        nomeUeOuCodigoEol: '019241',
        edicao: 'ed-1',
        tipoPolo: 'pendente',
        gestao: 'parceira',
      }).success,
    ).toBe(true)
  })
})
