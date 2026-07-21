import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useOpcoesFiltroDefinicaoPolos } from './useOpcoesFiltroDefinicaoPolos'

const { listarOpcoesFiltroDefinicaoPolosMock } = vi.hoisted(() => ({
  listarOpcoesFiltroDefinicaoPolosMock: vi.fn(),
}))

vi.mock('./api', () => ({
  listarOpcoesFiltroDefinicaoPolos: listarOpcoesFiltroDefinicaoPolosMock,
}))

const opcoesExemplo = {
  dres: ['DIRETORIA REGIONAL DE EDUCACAO BUTANTA'],
  tiposUe: ['CEI DIRET', 'EMEF'],
  gestoes: ['Parceira', 'Direta'],
  nomesEdicao: ['Janeiro 2025', '-'],
  tiposPolo: ['Pendente', 'Polo oficial', 'Polo reserva'],
}

describe('useOpcoesFiltroDefinicaoPolos', () => {
  beforeEach(() => {
    listarOpcoesFiltroDefinicaoPolosMock.mockResolvedValue(opcoesExemplo)
  })

  it('inicia em carregamento e preenche opções após a API responder', async () => {
    const { result } = renderHook(() => useOpcoesFiltroDefinicaoPolos())

    expect(result.current.estaCarregando).toBe(true)
    expect(result.current.opcoesDre).toEqual([])
    expect(result.current.opcoesTipoUe).toEqual([])
    expect(result.current.opcoesGestao).toEqual([])
    expect(result.current.opcoesNomeEdicao).toEqual([])
    expect(result.current.opcoesTipoPolo).toEqual([])

    await waitFor(() => {
      expect(result.current.estaCarregando).toBe(false)
    })

    expect(result.current.opcoesDre).toEqual(opcoesExemplo.dres)
    expect(result.current.opcoesTipoUe).toEqual(opcoesExemplo.tiposUe)
    expect(result.current.opcoesGestao).toEqual(opcoesExemplo.gestoes)
    expect(result.current.opcoesNomeEdicao).toEqual(opcoesExemplo.nomesEdicao)
    expect(result.current.opcoesTipoPolo).toEqual(opcoesExemplo.tiposPolo)
  })

  it('mantém listas vazias quando a API falha', async () => {
    listarOpcoesFiltroDefinicaoPolosMock.mockRejectedValue(new Error('falha'))

    const { result } = renderHook(() => useOpcoesFiltroDefinicaoPolos())

    await waitFor(() => {
      expect(result.current.estaCarregando).toBe(false)
    })

    expect(result.current.opcoesDre).toEqual([])
    expect(result.current.opcoesTipoUe).toEqual([])
    expect(result.current.opcoesGestao).toEqual([])
    expect(result.current.opcoesNomeEdicao).toEqual([])
    expect(result.current.opcoesTipoPolo).toEqual([])
  })
})
