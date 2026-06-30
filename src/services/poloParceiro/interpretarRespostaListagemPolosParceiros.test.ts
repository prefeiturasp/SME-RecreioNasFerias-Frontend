import { describe, expect, it } from 'vitest'

import { interpretarRespostaListagemPolosParceirosPaginada } from './interpretarRespostaListagemPolosParceiros'

describe('interpretarRespostaListagemPolosParceirosPaginada', () => {
  it('mapeia resposta paginada da API', () => {
    expect(
      interpretarRespostaListagemPolosParceirosPaginada({
        results: [
          {
            id: '11111111-1111-1111-1111-111111111111',
            tipo: 'Parceiro',
            nomeOsc: 'Cantinho Feliz',
            nomePolo: 'CEI DIRET ALOYSIO DE MENEZES PINTO NETO',
            dre: 'DRE Butantã',
            tipoUe: 'CEI',
            quantidadeMaximaAlunos: 50,
            cep: '05510-000',
            endereco: 'Rua Exemplo, 100',
            nomeGestor: 'Maria Silva',
            emailPolo: 'polo@exemplo.com',
            telefonePolo: '11999999999',
            observacoesGerais: '',
          },
        ],
        page: 2,
        pageSize: 5,
        total: 15,
        totalPages: 3,
      }),
    ).toEqual({
      polos: [
        {
          id: '11111111-1111-1111-1111-111111111111',
          dre: 'DRE Butantã',
          tipoUe: 'CEI',
          nomePolo: 'CEI DIRET ALOYSIO DE MENEZES PINTO NETO',
          nomeOsc: 'Cantinho Feliz',
        },
      ],
      pagina: 2,
      tamanhoPagina: 5,
      total: 15,
      totalPaginas: 3,
    })
  })

  it('retorna null quando o payload paginado é inválido', () => {
    expect(interpretarRespostaListagemPolosParceirosPaginada(null)).toBeNull()
    expect(
      interpretarRespostaListagemPolosParceirosPaginada({ results: [] }),
    ).toBeNull()
  })

  it('ignora itens inválidos no array de resultados', () => {
    expect(
      interpretarRespostaListagemPolosParceirosPaginada({
        results: [
          { id: '1', dre: 'DRE Butantã' },
          {
            id: '22222222-2222-2222-2222-222222222222',
            dre: 'DRE Ipiranga',
            tipoUe: 'EMEF',
            nomePolo: 'Polo Centro',
            nomeOsc: 'OSC Parceira',
          },
        ],
        page: 1,
        pageSize: 10,
        total: 2,
        totalPages: 1,
      }),
    ).toEqual({
      polos: [
        {
          id: '22222222-2222-2222-2222-222222222222',
          dre: 'DRE Ipiranga',
          tipoUe: 'EMEF',
          nomePolo: 'Polo Centro',
          nomeOsc: 'OSC Parceira',
        },
      ],
      pagina: 1,
      tamanhoPagina: 10,
      total: 2,
      totalPaginas: 1,
    })
  })
})
