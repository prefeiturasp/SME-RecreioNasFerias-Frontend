import { describe, it, expect, vi, beforeEach } from 'vitest'
import { listarHistoricoDefinicaoPolo } from './listarHistoricoDefinicaoPolo'
import { api } from '../api/http'
import type { ListagemHistoricoDefinicaoPoloPaginada } from './types'

// Mock do módulo da API
vi.mock('../api/http', () => ({
  api: {
    get: vi.fn(),
  },
}))

describe('listarHistoricoDefinicaoPolo', () => {
  const mockResposta: ListagemHistoricoDefinicaoPoloPaginada = {
    count: 1,
    results: [
      {
        edicao: {
          nome: 'Edição Exemplo',
        },
        tipo: 'Tipo Exemplo',
        projecao_inscritos: 50,
        total_inscritos: 45,
        resultado_final_de_inscritos: 40,
      },
    ],
    next: null,
    previous: null,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve fazer a requisição com valores padrão quando parâmetros opcionais não forem fornecidos', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockResposta })

    const resultado = await listarHistoricoDefinicaoPolo({
      polo: 'uuid-polo',
    })

    expect(api.get).toHaveBeenCalledTimes(1)
    expect(api.get).toHaveBeenCalledWith(
      '/api/v1/definicoes-polos/historico/',
      {
        params: {
          polo: 'uuid-polo',
          page: 1,
          page_size: 10,
        },
      },
    )
    expect(resultado).toEqual(mockResposta)
  })

  it('deve incluir o parâmetro "polo" nos parâmetros da query quando preenchido', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockResposta })

    await listarHistoricoDefinicaoPolo({ polo: ' Polo Norte ' })

    expect(api.get).toHaveBeenCalledWith(
      '/api/v1/definicoes-polos/historico/',
      {
        params: {
          page: 1,
          page_size: 10,
          polo: 'Polo Norte', // Deve aplicar o .trim()
        },
      },
    )
  })

  it('não deve incluir o parâmetro "polo" se ele for vazio ou contiver apenas espaços em branco', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockResposta })

    await listarHistoricoDefinicaoPolo({ polo: '   ' })

    expect(api.get).toHaveBeenCalledWith(
      '/api/v1/definicoes-polos/historico/',
      {
        params: {
          page: 1,
          page_size: 10,
        },
      },
    )
  })

  it('deve aceitar paginação personalizada (page e page_size)', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockResposta })

    await listarHistoricoDefinicaoPolo({
      polo: 'uuid-polo',
      page: 3,
      page_size: 25,
    })

    expect(api.get).toHaveBeenCalledWith(
      '/api/v1/definicoes-polos/historico/',
      {
        params: {
          polo: 'uuid-polo',
          page: 3,
          page_size: 25,
        },
      },
    )
  })

  it('deve propagar o erro caso a requisição da API falhe', async () => {
    const mockError = new Error('Erro interno no servidor')
    vi.mocked(api.get).mockRejectedValueOnce(mockError)

    await expect(listarHistoricoDefinicaoPolo({})).rejects.toThrow(
      'Erro interno no servidor',
    )
  })

  it('deve enviar desabilita_paginacao quando solicitado', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockResposta })

    await listarHistoricoDefinicaoPolo({
      polo: 'uuid-polo',
      desabilita_paginacao: true,
    })

    expect(api.get).toHaveBeenCalledWith(
      '/api/v1/definicoes-polos/historico/',
      {
        params: {
          polo: 'uuid-polo',
          desabilita_paginacao: true,
        },
      },
    )
  })
})
