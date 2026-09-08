import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '../api/http'
import { listarDefinicoesPolo } from './listarDefinicoesPolo'
import type { DefinicaoPoloApi } from './types'

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
  },
]

describe('listarDefinicoesPolo', () => {
  beforeEach(() => {
    apiGetMock.mockReset()
  })

  it('lista definições de polo e retorna os dados da API', async () => {
    apiGetMock.mockResolvedValue({ data: polos })

    await expect(listarDefinicoesPolo()).resolves.toEqual(polos)

    expect(apiGetMock).toHaveBeenCalledWith('/api/v1/definicoes-polos/', {
      params: {
        busca: undefined,
        dre_codigos_eol: undefined,
        tipo_ue: undefined,
        edicao: undefined,
        gestao: undefined,
        tipo_polo: undefined,
      },
    })
  })

  it('envia os filtros informados para a API', async () => {
    apiGetMock.mockResolvedValue({ data: polos })

    await listarDefinicoesPolo(
      '13 DE MAIO',
      '108600',
      'CEI DIRET',
      'ed-1',
      'direta',
      'pendente',
    )

    expect(apiGetMock).toHaveBeenCalledWith('/api/v1/definicoes-polos/', {
      params: {
        busca: '13 DE MAIO',
        dre_codigos_eol: '108600',
        tipo_ue: 'CEI DIRET',
        edicao: 'ed-1',
        gestao: 'direta',
        tipo_polo: 'pendente',
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
