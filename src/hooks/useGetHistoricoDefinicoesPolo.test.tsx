import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useGetHistoricoDefinicoesPolo } from './useGetHistoricoDefinicoesPolo'
import { listarHistoricoDefinicaoPolo } from '@/services/definicaoPolo/listarHistoricoDefinicaoPolo'
import type { ReactNode } from 'react'

// Mock da função de serviço de API
vi.mock('@/services/definicaoPolo/listarHistoricoDefinicaoPolo', () => ({
  listarHistoricoDefinicaoPolo: vi.fn(),
}))

describe('useGetHistoricoDefinicoesPolo', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false, // Desativa tentativas automáticas de erro para agilizar o teste
        },
      },
    })
    vi.clearAllMocks()
  })

  // Helper para prover o QueryClient nos testes de hook
  const createWrapper = () => {
    return ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  }

  it('deve aplicar valores padrão (page, page_size, desabilita_paginacao) e chamar o serviço com sucesso', async () => {
    const mockResposta = { count: 1, results: [] }
    vi.mocked(listarHistoricoDefinicaoPolo).mockResolvedValueOnce(
      mockResposta as any,
    )

    const parametros = { polo: 'uuid-123' }

    const { result } = renderHook(
      () => useGetHistoricoDefinicoesPolo(parametros),
      {
        wrapper: createWrapper(),
      },
    )

    // Aguarda a query finalizar o carregamento com sucesso
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    // Verifica se a função de API foi chamada aplicando os defaults corretos
    expect(listarHistoricoDefinicaoPolo).toHaveBeenCalledTimes(1)
    expect(listarHistoricoDefinicaoPolo).toHaveBeenCalledWith({
      polo: 'uuid-123',
      page: 1,
      page_size: 10,
      desabilita_paginacao: false,
    })

    expect(result.current.data).toEqual(mockResposta)
  })

  it('deve respeitar e repassar parâmetros customizados de paginação quando fornecidos', async () => {
    const mockResposta = { count: 50, results: [] }
    vi.mocked(listarHistoricoDefinicaoPolo).mockResolvedValueOnce(
      mockResposta as any,
    )

    const parametros = {
      polo: 'uuid-123',
      page: 3,
      page_size: 20,
      desabilita_paginacao: true,
    }

    const { result } = renderHook(
      () => useGetHistoricoDefinicoesPolo(parametros),
      {
        wrapper: createWrapper(),
      },
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(listarHistoricoDefinicaoPolo).toHaveBeenCalledWith({
      polo: 'uuid-123',
      page: 3,
      page_size: 20,
      desabilita_paginacao: true,
    })
  })

  it('deve lidar corretamente com erros retornados pela API', async () => {
    const mockErro = new Error('Erro ao buscar histórico')
    vi.mocked(listarHistoricoDefinicaoPolo).mockRejectedValueOnce(mockErro)

    const { result } = renderHook(
      () => useGetHistoricoDefinicoesPolo({ polo: 'uuid-123' }),
      {
        wrapper: createWrapper(),
      },
    )

    // Aguarda a query transacionar para o estado de erro
    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(result.current.error).toEqual(mockErro)
  })
})
