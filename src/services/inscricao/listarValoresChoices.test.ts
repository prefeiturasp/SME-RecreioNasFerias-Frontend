import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '../api/http'
import { listarValoresChoices } from './listarValoresChoices'
import type { ValoresChoicesInscricao } from './types'

vi.mock('../api/http', () => ({
  api: { get: vi.fn(), post: vi.fn(), put: vi.fn() },
}))

const apiGetMock = vi.mocked(api.get)

const valoresChoicesExemplo: ValoresChoicesInscricao = {
  grupo_inscricao: [{ value: 'BERCARIO_I', label: 'Berçário I' }],
  tipo_estudante: [{ value: 'ESTUDANTE_DA_REDE', label: 'Estudante da rede' }],
  status_inscricao: [{ value: 'RASCUNHO', label: 'Rascunho' }],
}

describe('listarValoresChoices', () => {
  beforeEach(() => {
    apiGetMock.mockReset()
  })

  it('envia GET e devolve os choices da API', async () => {
    apiGetMock.mockResolvedValue({ data: valoresChoicesExemplo })

    await expect(listarValoresChoices()).resolves.toEqual(valoresChoicesExemplo)

    expect(apiGetMock).toHaveBeenCalledTimes(1)
    expect(apiGetMock).toHaveBeenCalledWith(
      '/api/v1/inscricoes/valores-choices/',
    )
  })

  it('lança erro quando a API retorna falha', async () => {
    apiGetMock.mockRejectedValue({
      response: {
        status: 401,
        data: { detalhe: 'Credenciais inválidas.' },
      },
    })

    await expect(listarValoresChoices()).rejects.toMatchObject({
      response: {
        data: { detalhe: 'Credenciais inválidas.' },
      },
    })
  })

  it('não inventa mensagem quando o corpo de erro está vazio', async () => {
    apiGetMock.mockRejectedValue({ response: { status: 500, data: {} } })

    await expect(listarValoresChoices()).rejects.toMatchObject({
      response: { data: {} },
    })
  })
})
