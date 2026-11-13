import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { obterInscricao } from '@/services/inscricao/obterInscricao'
import { useGetInscricao } from './useGetInscricao'

const { useQueryMock } = vi.hoisted(() => ({
  useQueryMock: vi.fn(),
}))

vi.mock('@tanstack/react-query', () => ({
  useQuery: (options: unknown) => {
    useQueryMock(options)
    return options
  },
}))

vi.mock('@/services/inscricao/obterInscricao', () => ({
  obterInscricao: vi.fn(),
}))

type QueryOptions = {
  queryKey: readonly unknown[]
  queryFn: () => Promise<unknown>
  enabled: boolean
}

function obterOpcoesDaQuery(uuid: string | undefined): QueryOptions {
  renderHook(() => useGetInscricao(uuid))

  return useQueryMock.mock.calls.at(-1)?.[0] as QueryOptions
}

describe('useGetInscricao', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('busca a inscrição quando o UUID é informado', async () => {
    const inscricao = { uuid: 'inscricao-1' }
    vi.mocked(obterInscricao).mockResolvedValueOnce(inscricao as never)

    const options = obterOpcoesDaQuery('inscricao-1')

    await expect(options.queryFn()).resolves.toBe(inscricao)
    expect(options.queryKey).toEqual(['inscricao', 'inscricao-1'])
    expect(options.enabled).toBe(true)
    expect(obterInscricao).toHaveBeenCalledWith('inscricao-1')
  })

  it('não consulta quando o UUID não é informado', () => {
    const options = obterOpcoesDaQuery(undefined)

    expect(options.enabled).toBe(false)
    expect(() => options.queryFn()).toThrow('UUID da inscrição não informado.')
    expect(obterInscricao).not.toHaveBeenCalled()
  })
})
