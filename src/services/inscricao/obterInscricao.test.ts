import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '../api/http'
import { obterInscricao } from './obterInscricao'
import type { InscricaoDetalhe } from './types'

vi.mock('../api/http', () => ({
  api: { get: vi.fn(), post: vi.fn(), put: vi.fn() },
}))

const apiGetMock = vi.mocked(api.get)

const uuidInscricao = '22222222-2222-2222-2222-222222222222'

const respostaObterExemplo = {
  uuid: uuidInscricao,
  nome_participante: 'Ana Souza',
} as InscricaoDetalhe

describe('obterInscricao', () => {
  beforeEach(() => {
    apiGetMock.mockReset()
  })

  it('busca a inscrição pelo uuid e devolve a resposta da API', async () => {
    apiGetMock.mockResolvedValue({ data: respostaObterExemplo })

    await expect(obterInscricao(uuidInscricao)).resolves.toEqual(
      respostaObterExemplo,
    )

    expect(apiGetMock).toHaveBeenCalledTimes(1)
    expect(apiGetMock).toHaveBeenCalledWith(
      `/api/v1/inscricoes/${uuidInscricao}/`,
    )
  })

  it('lança erro quando a API retorna falha na consulta', async () => {
    apiGetMock.mockRejectedValue({
      response: {
        status: 404,
        data: { detalhe: 'Inscrição não encontrada.' },
      },
    })

    await expect(obterInscricao(uuidInscricao)).rejects.toMatchObject({
      response: {
        data: { detalhe: 'Inscrição não encontrada.' },
      },
    })
  })

  it('não inventa mensagem quando o corpo de erro está vazio', async () => {
    apiGetMock.mockRejectedValue({ response: { status: 500, data: {} } })

    await expect(obterInscricao(uuidInscricao)).rejects.toMatchObject({
      response: { data: {} },
    })
  })
})
