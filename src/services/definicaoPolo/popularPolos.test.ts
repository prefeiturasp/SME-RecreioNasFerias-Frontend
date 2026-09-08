import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '../api/http'
import { popularPolos } from './popularPolos'

vi.mock('../api/http', () => ({
  api: { post: vi.fn() },
}))

const apiPostMock = vi.mocked(api.post)

const respostaPopular = {
  total_consultados: 10,
  total_novos: 2,
  total_ja_existentes: 8,
  unidades_novas: [],
  executada: true,
  motivo_ignorada: null,
  ultima_execucao_em: '2026-07-13T12:00:00+00:00',
}

describe('popularPolos', () => {
  beforeEach(() => {
    apiPostMock.mockReset()
  })

  it('popula os polos e retorna os dados da API', async () => {
    apiPostMock.mockResolvedValue({ data: respostaPopular })

    await expect(popularPolos()).resolves.toEqual(respostaPopular)

    expect(apiPostMock).toHaveBeenCalledWith('/api/v1/polos/popular/')
  })

  it('lança erro quando a API retorna falha', async () => {
    apiPostMock.mockRejectedValue({
      response: {
        status: 503,
        data: { detalhe: 'Não foi possível popular os polos.' },
      },
    })

    await expect(popularPolos()).rejects.toMatchObject({
      response: {
        data: { detalhe: 'Não foi possível popular os polos.' },
      },
    })
  })
})
