import { describe, expect, it } from 'vitest'
import filtrosDefinicaoPolosSchema from './schema'

const filtrosVazios = {
  dre: '',
  tipoUe: '',
  nomeUeOuCodigoEol: '',
  nomeEdicao: '',
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
        nomeEdicao: 'Janeiro 2025',
        tipoPolo: 'Pendente',
        gestao: 'Parceira',
      }).success,
    ).toBe(true)
  })
})
