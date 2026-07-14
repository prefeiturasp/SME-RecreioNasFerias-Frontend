import { describe, expect, it } from 'vitest'

import { interpretarRespostaListagemDefinicoesPolo } from './interpretarRespostaListagemDefinicoesPolo'

describe('interpretarRespostaListagemDefinicoesPolo', () => {
  it('mapeia polos da API para o formato da tela de definição', () => {
    const listagem = interpretarRespostaListagemDefinicoesPolo({
      results: [
        {
          id: '11111111-1111-1111-1111-111111111111',
          dre: 'DRE Butantã',
          tipoUe: 'EMEF',
          nomePolo: 'Escola Centro',
          gestao: 'Direta',
          tipo: 'Polo oficial',
          nomeEdicao: 'Janeiro 2025',
          codigoEol: '019242',
        },
      ],
      page: 1,
      pageSize: 10,
      total: 1,
      totalPages: 1,
    })

    expect(listagem).toEqual({
      polos: [
        {
          id: '11111111-1111-1111-1111-111111111111',
          dre: 'DRE Butantã',
          tipoUe: 'EMEF',
          nomeUe: 'Escola Centro',
          nomeEdicao: 'Janeiro 2025',
          tipoPolo: 'Polo oficial',
          gestao: 'Direta',
        },
      ],
      pagina: 1,
      tamanhoPagina: 10,
      total: 1,
      totalPaginas: 1,
    })
  })

  it('usa Pendente e "-" quando tipo ou nomeEdicao estão ausentes ou em branco', () => {
    const listagem = interpretarRespostaListagemDefinicoesPolo({
      results: [
        {
          id: '11111111-1111-1111-1111-111111111111',
          dre: 'DRE Butantã',
          tipoUe: 'EMEF',
          nomePolo: 'Escola Sem Tipo',
          gestao: 'Direta',
        },
        {
          id: '22222222-2222-2222-2222-222222222222',
          dre: 'DRE Penha',
          tipoUe: 'CEI',
          nomePolo: 'Escola Em Branco',
          gestao: 'Parceira',
          tipo: '   ',
          nomeEdicao: '',
        },
      ],
      page: 1,
      pageSize: 10,
      total: 2,
      totalPages: 1,
    })

    expect(listagem?.polos).toEqual([
      {
        id: '11111111-1111-1111-1111-111111111111',
        dre: 'DRE Butantã',
        tipoUe: 'EMEF',
        nomeUe: 'Escola Sem Tipo',
        nomeEdicao: '-',
        tipoPolo: 'Pendente',
        gestao: 'Direta',
      },
      {
        id: '22222222-2222-2222-2222-222222222222',
        dre: 'DRE Penha',
        tipoUe: 'CEI',
        nomeUe: 'Escola Em Branco',
        nomeEdicao: '-',
        tipoPolo: 'Pendente',
        gestao: 'Parceira',
      },
    ])
  })

  it('filtra itens inválidos em results', () => {
    const listagem = interpretarRespostaListagemDefinicoesPolo({
      results: [
        {
          id: '11111111-1111-1111-1111-111111111111',
          dre: 'DRE Butantã',
          tipoUe: 'EMEF',
          nomePolo: 'Escola Válida',
          gestao: 'Direta',
          tipo: 'Polo oficial',
          nomeEdicao: 'Janeiro 2025',
        },
        { id: 123 },
        null,
        'texto',
      ],
      page: 1,
      pageSize: 10,
      total: 4,
      totalPages: 1,
    })

    expect(listagem?.polos).toHaveLength(1)
    expect(listagem?.polos[0]?.nomeUe).toBe('Escola Válida')
  })

  it('retorna null para payload inválido', () => {
    expect(interpretarRespostaListagemDefinicoesPolo({})).toBeNull()
  })

  it('retorna null para null, array ou primitivo', () => {
    expect(interpretarRespostaListagemDefinicoesPolo(null)).toBeNull()
    expect(interpretarRespostaListagemDefinicoesPolo([])).toBeNull()
    expect(interpretarRespostaListagemDefinicoesPolo('texto')).toBeNull()
    expect(interpretarRespostaListagemDefinicoesPolo(42)).toBeNull()
  })
})
