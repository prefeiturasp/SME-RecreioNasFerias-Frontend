import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useOpcoesIntegracaoPolosParceiros } from './useOpcoesIntegracaoPolosParceiros'

const { listarDresNomeAbreviacaoMock, listarTiposEscolaMock } = vi.hoisted(
  () => ({
    listarDresNomeAbreviacaoMock: vi.fn(),
    listarTiposEscolaMock: vi.fn(),
  }),
)

vi.mock('./api', () => ({
  listarDresNomeAbreviacao: listarDresNomeAbreviacaoMock,
  listarTiposEscola: listarTiposEscolaMock,
}))

describe('useOpcoesIntegracaoPolosParceiros', () => {
  beforeEach(() => {
    listarDresNomeAbreviacaoMock.mockResolvedValue([
      {
        codigo: '108100',
        nome: 'DIRETORIA REGIONAL DE EDUCACAO BUTANTA',
        abreviacao: 'DRE - BT',
      },
    ])
    listarTiposEscolaMock.mockResolvedValue([
      {
        codigo: 1,
        descricaoSigla: 'EMEF',
        dtAtualizacao: '2012-01-13T14:09:23.647',
      },
    ])
  })

  it('inicia em carregamento e preenche opções após as APIs responderem', async () => {
    const { result } = renderHook(() => useOpcoesIntegracaoPolosParceiros())

    expect(result.current.estaCarregando).toBe(true)
    expect(result.current.opcoesDre).toEqual([])
    expect(result.current.opcoesTipoUe).toEqual([])

    await waitFor(() => {
      expect(result.current.estaCarregando).toBe(false)
    })

    expect(result.current.opcoesDre).toEqual([
      {
        codigo: '108100',
        nome: 'DIRETORIA REGIONAL DE EDUCACAO BUTANTA',
        abreviacao: 'DRE - BT',
      },
    ])
    expect(result.current.opcoesTipoUe).toEqual([
      {
        codigo: 1,
        descricaoSigla: 'EMEF',
        dtAtualizacao: '2012-01-13T14:09:23.647',
      },
    ])
  })

  it('mantém listas vazias quando as APIs falham', async () => {
    listarDresNomeAbreviacaoMock.mockRejectedValue(new Error('falha'))
    listarTiposEscolaMock.mockRejectedValue(new Error('falha'))

    const { result } = renderHook(() => useOpcoesIntegracaoPolosParceiros())

    await waitFor(() => {
      expect(result.current.estaCarregando).toBe(false)
    })

    expect(result.current.opcoesDre).toEqual([])
    expect(result.current.opcoesTipoUe).toEqual([])
  })
})
