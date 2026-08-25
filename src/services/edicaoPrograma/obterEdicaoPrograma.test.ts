import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '../api/http'
import { obterEdicaoPrograma } from './obterEdicaoPrograma'
import type { EdicaoPrograma } from './types'

vi.mock('../api/http', () => ({
  api: { get: vi.fn(), post: vi.fn(), put: vi.fn() },
}))

const apiGetMock = vi.mocked(api.get)

const idEdicao = '11111111-1111-1111-1111-111111111111'

const respostaObterExemplo: EdicaoPrograma = {
  id: idEdicao,
  nome: 'Janeiro 2026',
  dataInicioEdicao: '2026-01-01',
  dataFimEdicao: '2026-01-31',
  dataInicioInscricoes: '2025-12-01',
  dataFimInscricoes: '2025-12-31',
  quantidadeInscritos: 50,
  quantidadeAtendimentoEfetivo: 40,
  quantidadePasseios: 5,
  quantidadeApresentacoes: 2,
}

describe('obterEdicaoPrograma', () => {
  beforeEach(() => {
    apiGetMock.mockReset()
  })

  it('busca edição pelo uuid e devolve a resposta da API', async () => {
    apiGetMock.mockResolvedValue({ data: respostaObterExemplo })

    await expect(obterEdicaoPrograma(idEdicao)).resolves.toEqual(
      respostaObterExemplo,
    )

    expect(apiGetMock).toHaveBeenCalledTimes(1)
    expect(apiGetMock).toHaveBeenCalledWith(`/api/v1/edicoes/${idEdicao}/`)
  })

  it('lança erro quando a API retorna falha na consulta', async () => {
    apiGetMock.mockRejectedValue({
      response: {
        status: 404,
        data: { detalhe: 'Edição não encontrada.' },
      },
    })

    await expect(obterEdicaoPrograma(idEdicao)).rejects.toMatchObject({
      response: {
        data: { detalhe: 'Edição não encontrada.' },
      },
    })
  })

  it('não inventa mensagem quando o corpo de erro está vazio', async () => {
    apiGetMock.mockRejectedValue({ response: { status: 500, data: {} } })

    await expect(obterEdicaoPrograma(idEdicao)).rejects.toMatchObject({
      response: { data: {} },
    })
  })
})
