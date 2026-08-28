import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '../api/http'
import { listarDres } from '@/services/dre/listarDres'
import type { Dre } from './types'

vi.mock('../api/http', () => ({
  api: { get: vi.fn(), post: vi.fn(), put: vi.fn() },
}))

const apiGetMock = vi.mocked(api.get)

const dreExemplo: Dre = {
  codigo_dre: '108100',
  nome_dre: 'DIRETORIA REGIONAL DE EDUCACAO BUTANTA',
  sigla_dre: 'BT',
}

describe('listarDres', () => {
  beforeEach(() => {
    apiGetMock.mockReset()
  })

  it('envia GET e devolve o array da API', async () => {
    apiGetMock.mockResolvedValue({ data: [dreExemplo] })

    await expect(listarDres()).resolves.toEqual([dreExemplo])

    expect(apiGetMock).toHaveBeenCalledTimes(1)
    expect(apiGetMock).toHaveBeenCalledWith('/api/v1/polos/dres/')
  })

  it('retorna lista vazia quando a API devolve array vazio', async () => {
    apiGetMock.mockResolvedValue({ data: [] })

    await expect(listarDres()).resolves.toEqual([])
  })

  it('lança erro quando a API retorna falha', async () => {
    apiGetMock.mockRejectedValue({
      response: {
        status: 401,
        data: { detalhe: 'Credenciais inválidas.' },
      },
    })

    await expect(listarDres()).rejects.toMatchObject({
      response: {
        data: { detalhe: 'Credenciais inválidas.' },
      },
    })
  })

  it('não inventa mensagem quando o corpo de erro está vazio', async () => {
    apiGetMock.mockRejectedValue({ response: { status: 500, data: {} } })

    await expect(listarDres()).rejects.toMatchObject({
      response: { data: {} },
    })
  })
})
