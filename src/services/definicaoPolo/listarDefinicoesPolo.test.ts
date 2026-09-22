import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '../api/http'
import { listarDefinicoesPolo } from './listarDefinicoesPolo'
import type {
  DefinicaoPoloApi,
  ListagemDefinicoesPoloPaginada,
} from './types'

vi.mock('../api/http', () => ({
  api: { get: vi.fn() },
}))

const apiGetMock = vi.mocked(api.get)

const polos: DefinicaoPoloApi[] = [
  {
    polo_uuid: '3741975e-7002-447c-8b9b-b417d1616854',
    codigo_eol: '400496',
    nome_polo: '13 DE MAIO',
    dre_nome: 'DIRETORIA REGIONAL DE EDUCACAO IPIRANGA',
    dre_codigo_eol: '108600',
    tipo_ue: 'CEI DIRET',
    gestao: 'direta',
    status: 'ativo',
    ativo: true,
    definicao_uuid: null,
    edicao_uuid: null,
    nome_edicao: null,
    tipo_polo_edicao: 'pendente',
    projecao_inscritos_edicao: null,
    total_inscritos_edicao: null,
    resultado_final_de_inscritos_edicao: null,
  },
]

const listagemPaginada: ListagemDefinicoesPoloPaginada = {
  count: 1,
  next: null,
  previous: null,
  results: polos,
}

describe('listarDefinicoesPolo', () => {
  beforeEach(() => {
    apiGetMock.mockReset()
  })

  it('lista definições de polo e retorna os dados paginados da API', async () => {
    apiGetMock.mockResolvedValue({ data: listagemPaginada })

    await expect(listarDefinicoesPolo()).resolves.toEqual(listagemPaginada)

    expect(apiGetMock).toHaveBeenCalledWith('/api/v1/definicoes-polos/', {
      params: {
        page: 1,
        page_size: 10,
      },
    })
  })

  it('envia apenas os filtros preenchidos junto com a paginação', async () => {
    apiGetMock.mockResolvedValue({ data: listagemPaginada })

    await listarDefinicoesPolo({
      busca: '13 DE MAIO',
      dre_codigos_eol: '108600',
      tipo_ue: 'CEI DIRET',
      edicao: 'ed-1',
      gestao: 'direta',
      tipo_polo: 'pendente',
      page: 2,
      page_size: 20,
    })

    expect(apiGetMock).toHaveBeenCalledWith('/api/v1/definicoes-polos/', {
      params: {
        page: 2,
        page_size: 20,
        busca: '13 DE MAIO',
        dre_codigos_eol: '108600',
        tipo_ue: 'CEI DIRET',
        edicao: 'ed-1',
        gestao: 'direta',
        tipo_polo: 'pendente',
      },
    })
  })

  it('omite filtros vazios da query', async () => {
    apiGetMock.mockResolvedValue({ data: listagemPaginada })

    await listarDefinicoesPolo({
      busca: '   ',
      dre_codigos_eol: '',
      tipo_ue: '',
      edicao: '',
      gestao: '',
      tipo_polo: '',
      page: 1,
      page_size: 10,
    })

    expect(apiGetMock).toHaveBeenCalledWith('/api/v1/definicoes-polos/', {
      params: {
        page: 1,
        page_size: 10,
      },
    })
  })

  it('lança erro quando a API retorna falha na listagem', async () => {
    apiGetMock.mockRejectedValue({
      response: {
        status: 500,
        data: { detalhe: 'Não foi possível carregar a definição de polos.' },
      },
    })

    await expect(listarDefinicoesPolo()).rejects.toMatchObject({
      response: {
        data: { detalhe: 'Não foi possível carregar a definição de polos.' },
      },
    })
  })
})
