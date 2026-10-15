import { describe, it, expect, vi, beforeEach } from 'vitest'
import { api } from '../api/http'
import { listarInscricoes } from './listarInscricoes'
import type { Inscricao } from './types'

// Mock do módulo da API para interceptar as chamadas HTTP
vi.mock('../api/http', () => ({
  api: {
    get: vi.fn(),
  },
}))

describe('listarInscricoes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve listar as inscrições com sucesso sem passar parâmetros', async () => {
    const inscricoesMock: Inscricao[] = [
      { uuid: 'uuid-1234', nome_participante: 'João' },
      { uuid: 'uuid-5678', nome_participante: 'Maria' },
    ] as Inscricao[]

    vi.mocked(api.get).mockResolvedValueOnce({ data: inscricoesMock })

    const resultado = await listarInscricoes()

    expect(api.get).toHaveBeenCalledTimes(1)
    expect(api.get).toHaveBeenCalledWith('/api/v1/inscricoes/', {
      params: undefined,
    })
    expect(resultado).toEqual(inscricoesMock)
  })

  it('deve passar os parâmetros de filtros e paginação corretamente para a API', async () => {
    const inscricoesMock: Inscricao[] = [
      { uuid: 'uuid-1234', nome_participante: 'Carlos' },
    ] as Inscricao[]

    vi.mocked(api.get).mockResolvedValueOnce({ data: inscricoesMock })

    const parametros = {
      nome_participante: 'Carlos',
      status: 'CONFIRMADO',
      page: 2,
      page_size: 15,
    }

    const resultado = await listarInscricoes(parametros)

    expect(api.get).toHaveBeenCalledTimes(1)
    expect(api.get).toHaveBeenCalledWith('/api/v1/inscricoes/', {
      params: parametros,
    })
    expect(resultado).toEqual(inscricoesMock)
  })

  it('deve propagar o erro caso a requisição da API falhe', async () => {
    const erroMock = new Error('Erro ao buscar inscrições')

    vi.mocked(api.get).mockRejectedValueOnce(erroMock)

    await expect(listarInscricoes()).rejects.toThrow(
      'Erro ao buscar inscrições',
    )
    expect(api.get).toHaveBeenCalledTimes(1)
  })
})
