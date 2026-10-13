import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

import { useGetInscricoes } from './useGetInscricoes'
import { listarInscricoes } from '@/services/inscricao/listarInscricoes'
import { useInscricoesParticipantesStore } from '@/stores/filtroInscricoesParticipantesStore'
import type { Inscricao } from '@/services/inscricao/types'

vi.mock('@/services/inscricao/listarInscricoes', () => ({
  listarInscricoes: vi.fn(),
}))

describe('useGetInscricoes', () => {
  let queryClient: QueryClient

  const createWrapper = () => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })
    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
    act(() => {
      useInscricoesParticipantesStore.getState().limparFiltros()
      useInscricoesParticipantesStore.getState().setPaginaAtual(1)
      useInscricoesParticipantesStore.getState().setItensPorPagina(10)
    })
  })

  it('deve buscar as inscrições com os filtros aplicados e paginação padrão', async () => {
    const inscricoesMock: Inscricao[] = []
    vi.mocked(listarInscricoes).mockResolvedValueOnce(inscricoesMock)

    const { result } = renderHook(() => useGetInscricoes(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(listarInscricoes).toHaveBeenCalledTimes(1)
    expect(listarInscricoes).toHaveBeenCalledWith(
      expect.objectContaining({
        page: 1,
        page_size: 10,
      }),
    )
    expect(result.current.data).toEqual(inscricoesMock)
  })

  it('deve atualizar a query quando os filtros aplicados ou a paginação na store mudarem', async () => {
    const inscricoesMockPagina2: Inscricao[] = []
    vi.mocked(listarInscricoes).mockResolvedValue(inscricoesMockPagina2)

    const { result } = renderHook(() => useGetInscricoes(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    act(() => {
      useInscricoesParticipantesStore.getState().setPaginaAtual(2)
      useInscricoesParticipantesStore
        .getState()
        .alterarFiltro('nome_participante', 'Carlos')
      useInscricoesParticipantesStore.getState().aplicarFiltros()
    })

    await waitFor(() => {
      expect(listarInscricoes).toHaveBeenCalledWith(
        expect.objectContaining({
          nome_participante: 'Carlos',
          page: 2,
          page_size: 10,
        }),
      )
    })
  })

  it('deve filtrar valores vazios do objeto de filtros aplicados', async () => {
    vi.mocked(listarInscricoes).mockResolvedValueOnce([])

    act(() => {
      useInscricoesParticipantesStore
        .getState()
        .alterarFiltro('nome_participante', 'Ana')
      useInscricoesParticipantesStore.getState().aplicarFiltros()
    })

    renderHook(() => useGetInscricoes(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(listarInscricoes).toHaveBeenCalled())

    const chamadaArgs = vi.mocked(listarInscricoes).mock.calls[0][0]

    Object.values(chamadaArgs || {}).forEach((valor) => {
      expect(valor).not.toBe('')
    })
  })
})
