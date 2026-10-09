import { describe, it, expect, vi, beforeEach } from 'vitest'
import { api } from '../api/http'
import { listarPolosOficiais } from './listarPolosOficiais'
import type { PoloElegivel } from './types'

// Mock do módulo da API para interceptar as chamadas HTTP
vi.mock('../api/http', () => ({
  api: {
    get: vi.fn(),
  },
}))

describe('listarPolosOficiais', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve retornar a lista de polos oficiais com sucesso e passar os parâmetros corretos', async () => {
    // Dados mockados que a API deve retornar
    const polosMock: PoloElegivel[] = [
      { uuid: 'edas-1234', nome_polo: 'Polo Centro' },
      { uuid: 'aedf-1234', nome_polo: 'Polo Norte' },
    ] as PoloElegivel[]

    // Configura o mock do Axios/HTTP para resolver com os dados mockados
    vi.mocked(api.get).mockResolvedValueOnce({ data: polosMock })

    const resultado = await listarPolosOficiais()

    // Verifica se a API foi chamada com a URL correta e com o parâmetro de desabilitar paginação
    expect(api.get).toHaveBeenCalledTimes(1)
    expect(api.get).toHaveBeenCalledWith('/api/v1/inscricoes/polos-oficiais/', {
      params: {
        desabilita_paginacao: true,
      },
    })

    // Verifica se a função retornou exatamente os dados obtidos da API
    expect(resultado).toEqual(polosMock)
  })

  it('deve propagar o erro caso a requisição da API falhe', async () => {
    const erroMock = new Error('Erro interno do servidor')

    // Configura o mock para rejeitar (simular falha na requisição)
    vi.mocked(api.get).mockRejectedValueOnce(erroMock)

    // Verifica se a função lança o erro corretamente
    await expect(listarPolosOficiais()).rejects.toThrow(
      'Erro interno do servidor',
    )

    expect(api.get).toHaveBeenCalledTimes(1)
  })
})
