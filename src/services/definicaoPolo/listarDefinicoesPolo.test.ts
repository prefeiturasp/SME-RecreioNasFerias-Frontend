import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '../api/http'
import { listarDefinicoesPolo } from './listarDefinicoesPolo'

vi.mock('../api/http', () => ({
  api: { get: vi.fn() },
}))

const apiGetMock = vi.mocked(api.get)

const polos = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    dre: 'DRE Butantã',
    tipoUe: 'EMEF',
    nomePolo: 'Escola Centro',
    gestao: 'Direta',
    tipo: 'Polo oficial',
    nomeEdicao: 'Janeiro 2025',
  },
]

describe('listarDefinicoesPolo', () => {
  beforeEach(() => {
    apiGetMock.mockReset()
  })

  it('lista definições de polo e retorna os dados da API', async () => {
    apiGetMock.mockResolvedValue({
      data: {
        results: polos,
        page: 1,
        pageSize: 10,
        total: 1,
        totalPages: 1,
      },
    })

    await expect(listarDefinicoesPolo()).resolves.toEqual(polos)

    expect(apiGetMock).toHaveBeenCalledWith('/api/polos/')
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
