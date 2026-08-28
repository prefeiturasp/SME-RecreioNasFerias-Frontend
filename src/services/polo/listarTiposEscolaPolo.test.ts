import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '../api/http'
import { listarTiposEscolaPolo } from './listarTiposEscolaPolo'
import type { TipoEscolaPolo } from './types'

vi.mock('../api/http', () => ({
  api: { get: vi.fn(), post: vi.fn(), put: vi.fn() },
}))

const apiGetMock = vi.mocked(api.get)

const tipoEscolaExemplo: TipoEscolaPolo = {
  codigo: 1,
  descricao_sigla: 'EMEF',
}

describe('listarTiposEscolaPolo', () => {
  beforeEach(() => {
    apiGetMock.mockReset()
  })

  it('envia GET e devolve o array da API', async () => {
    apiGetMock.mockResolvedValue({ data: [tipoEscolaExemplo] })

    await expect(listarTiposEscolaPolo()).resolves.toEqual([tipoEscolaExemplo])

    expect(apiGetMock).toHaveBeenCalledTimes(1)
    expect(apiGetMock).toHaveBeenCalledWith('/api/v1/polos/tipos-escola/')
  })

  it('retorna lista vazia quando a API devolve array vazio', async () => {
    apiGetMock.mockResolvedValue({ data: [] })

    await expect(listarTiposEscolaPolo()).resolves.toEqual([])
  })

  it('lança erro quando a API retorna falha', async () => {
    apiGetMock.mockRejectedValue({
      response: {
        status: 401,
        data: { detalhe: 'Credenciais inválidas.' },
      },
    })

    await expect(listarTiposEscolaPolo()).rejects.toMatchObject({
      response: {
        data: { detalhe: 'Credenciais inválidas.' },
      },
    })
  })

  it('não inventa mensagem quando o corpo de erro está vazio', async () => {
    apiGetMock.mockRejectedValue({ response: { status: 500, data: {} } })

    await expect(listarTiposEscolaPolo()).rejects.toMatchObject({
      response: { data: {} },
    })
  })
})
