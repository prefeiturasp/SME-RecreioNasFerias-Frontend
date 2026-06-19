import { describe, expect, it } from 'vitest'
import {
  interpretarRespostaEdicaoPrograma,
  interpretarRespostaListagemEdicoes,
  interpretarRespostaListagemEdicoesPaginada,
} from './interpretarRespostaListagemEdicoes'

describe('interpretarRespostaEdicaoPrograma', () => {
  it('mapeia uma edição válida da API', () => {
    expect(
      interpretarRespostaEdicaoPrograma({
        id: '11111111-1111-1111-1111-111111111111',
        nome: 'Edição Janeiro 2026',
        periodoEdicao: { de: '2026-01-10', ate: '2026-01-20' },
        periodoInscricoes: { de: '2025-12-01', ate: '2025-12-31' },
        quantidadeInscritos: null,
        quantidadeAtendimentoEfetivo: null,
      }),
    ).toEqual({
      id: '11111111-1111-1111-1111-111111111111',
      nome: 'Edição Janeiro 2026',
      dataInicioEdicao: '2026-01-10',
      dataFimEdicao: '2026-01-20',
      dataInicioInscricoes: '2025-12-01',
      dataFimInscricoes: '2025-12-31',
      quantidadeInscritos: 0,
      quantidadeAtendimentoEfetivo: 0,
    })
  })

  it('retorna null quando o payload é inválido', () => {
    expect(interpretarRespostaEdicaoPrograma(null)).toBeNull()
    expect(interpretarRespostaEdicaoPrograma({ id: '1' })).toBeNull()
  })
})

describe('interpretarRespostaListagemEdicoesPaginada', () => {
  it('mapeia resposta paginada da API', () => {
    expect(
      interpretarRespostaListagemEdicoesPaginada({
        results: [
          {
            id: '11111111-1111-1111-1111-111111111111',
            nome: 'Edição Janeiro 2026',
            periodoEdicao: { de: '2026-01-10', ate: '2026-01-20' },
            periodoInscricoes: { de: '2025-12-01', ate: '2025-12-31' },
            quantidadeInscritos: null,
            quantidadeAtendimentoEfetivo: null,
          },
        ],
        page: 2,
        pageSize: 5,
        total: 15,
        totalPages: 3,
      }),
    ).toEqual({
      edicoes: [
        {
          id: '11111111-1111-1111-1111-111111111111',
          nome: 'Edição Janeiro 2026',
          dataInicioEdicao: '2026-01-10',
          dataFimEdicao: '2026-01-20',
          dataInicioInscricoes: '2025-12-01',
          dataFimInscricoes: '2025-12-31',
          quantidadeInscritos: 0,
          quantidadeAtendimentoEfetivo: 0,
        },
      ],
      pagina: 2,
      tamanhoPagina: 5,
      total: 15,
      totalPaginas: 3,
    })
  })

  it('retorna null quando o payload paginado é inválido', () => {
    expect(interpretarRespostaListagemEdicoesPaginada(null)).toBeNull()
    expect(
      interpretarRespostaListagemEdicoesPaginada({ results: [] }),
    ).toBeNull()
  })
})

describe('interpretarRespostaListagemEdicoes', () => {
  it('mapeia edições válidas da API para o modelo da aplicação', () => {
    expect(
      interpretarRespostaListagemEdicoes([
        {
          id: '11111111-1111-1111-1111-111111111111',
          nome: 'Edição Janeiro 2026',
          periodoEdicao: { de: '2026-01-10', ate: '2026-01-20' },
          periodoInscricoes: { de: '2025-12-01', ate: '2025-12-31' },
          quantidadeInscritos: null,
          quantidadeAtendimentoEfetivo: null,
        },
      ]),
    ).toEqual([
      {
        id: '11111111-1111-1111-1111-111111111111',
        nome: 'Edição Janeiro 2026',
        dataInicioEdicao: '2026-01-10',
        dataFimEdicao: '2026-01-20',
        dataInicioInscricoes: '2025-12-01',
        dataFimInscricoes: '2025-12-31',
        quantidadeInscritos: 0,
        quantidadeAtendimentoEfetivo: 0,
      },
    ])
  })

  it('retorna lista vazia quando o payload não é um array', () => {
    expect(interpretarRespostaListagemEdicoes(null)).toEqual([])
    expect(interpretarRespostaListagemEdicoes({})).toEqual([])
  })

  it('ignora itens inválidos no array', () => {
    expect(
      interpretarRespostaListagemEdicoes([
        { id: '1', nome: 'Sem períodos' },
        {
          id: '22222222-2222-2222-2222-222222222222',
          nome: 'Fevereiro 2026',
          periodoEdicao: { de: '2026-02-01', ate: '2026-02-28' },
          periodoInscricoes: { de: '2026-01-01', ate: '2026-01-31' },
          quantidadeInscritos: 10,
          quantidadeAtendimentoEfetivo: 8,
        },
      ]),
    ).toEqual([
      {
        id: '22222222-2222-2222-2222-222222222222',
        nome: 'Fevereiro 2026',
        dataInicioEdicao: '2026-02-01',
        dataFimEdicao: '2026-02-28',
        dataInicioInscricoes: '2026-01-01',
        dataFimInscricoes: '2026-01-31',
        quantidadeInscritos: 10,
        quantidadeAtendimentoEfetivo: 8,
      },
    ])
  })
})
