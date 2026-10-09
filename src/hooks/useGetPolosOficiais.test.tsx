import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

import { useGetPolosOficiais } from './useGetPolosOficiais'
import { listarPolosOficiais } from '@/services/inscricao/listarPolosOficiais'
import type { PoloElegivel } from '@/services/inscricao/types'

// Mock do serviço de listagem de polos oficiais
vi.mock('@/services/inscricao/listarPolosOficiais', () => ({
  listarPolosOficiais: vi.fn(),
}))

describe('useGetPolosOficiais', () => {
  let queryClient: QueryClient

  // Função helper para prover o QueryClient nos testes de hooks
  const createWrapper = () => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false, // Desativa retentativas automáticas para falhar mais rápido nos testes
        },
      },
    })
    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve buscar os polos oficiais com sucesso', async () => {
    const polosMock: PoloElegivel[] = [
      { uuid: '1', nome_polo: 'Polo Central' },
      { uuid: '2', nome_polo: 'Polo Norte' },
    ] as PoloElegivel[]

    vi.mocked(listarPolosOficiais).mockResolvedValueOnce(polosMock)

    const { result } = renderHook(() => useGetPolosOficiais(), {
      wrapper: createWrapper(),
    })

    // Aguarda a query ser concluída com sucesso
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    // Verifica se o serviço foi chamado corretamente
    expect(listarPolosOficiais).toHaveBeenCalledTimes(1)

    // Verifica se os dados retornados pelo hook correspondem ao mock
    expect(result.current.data).toEqual(polosMock)
  })

  it('deve lidar com erros caso a busca de polos oficiais falhe', async () => {
    const erroMock = new Error('Erro ao buscar polos oficiais')
    vi.mocked(listarPolosOficiais).mockRejectedValueOnce(erroMock)

    const { result } = renderHook(() => useGetPolosOficiais(), {
      wrapper: createWrapper(),
    })

    // Aguarda o estado de erro da query
    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(listarPolosOficiais).toHaveBeenCalledTimes(1)
    expect(result.current.error).toEqual(erroMock)
  })
})
