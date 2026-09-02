import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '../api/http'
import { sincronizarUnidadesDiretas } from './sincronizarUnidadesDiretas'

vi.mock('../api/http', () => ({
  api: { get: vi.fn() },
}))

const apiGetMock = vi.mocked(api.get)

const respostaSync = {
  totalConsultados: 10,
  totalNovos: 2,
  totalJaExistentes: 8,
  executada: true,
  motivoIgnorada: null,
  ultimaExecucaoEm: '2026-07-13T12:00:00+00:00',
}

describe('sincronizarUnidadesDiretas', () => {
  beforeEach(() => {
    apiGetMock.mockReset()
  })

  it('sincroniza unidades diretas e retorna os dados da API', async () => {
    apiGetMock.mockResolvedValue({ data: respostaSync })

    await expect(sincronizarUnidadesDiretas()).resolves.toEqual(respostaSync)

    expect(apiGetMock).toHaveBeenCalledWith('/api/polos/unidades-diretas/')
  })

  it('lança erro quando a API retorna falha', async () => {
    apiGetMock.mockRejectedValue({
      response: {
        status: 503,
        data: { detalhe: 'Não foi possível sincronizar as unidades diretas.' },
      },
    })

    await expect(sincronizarUnidadesDiretas()).rejects.toMatchObject({
      response: {
        data: { detalhe: 'Não foi possível sincronizar as unidades diretas.' },
      },
    })
  })
})
