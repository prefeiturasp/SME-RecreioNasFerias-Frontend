import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useGetDefinicaoPolo } from './useGetDefinicaoPolo'
import { obterDefinicaoPolo } from '@/services/definicaoPolo/obterDefinicaoPolo'

const { useQueryMock } = vi.hoisted(() => ({
  useQueryMock: vi.fn(),
}))

vi.mock('@tanstack/react-query', () => ({
  useQuery: (options: unknown) => {
    useQueryMock(options)
    return options
  },
}))

vi.mock('@/services/definicaoPolo/obterDefinicaoPolo', () => ({
  obterDefinicaoPolo: vi.fn(),
}))

type QueryOptions = {
  queryKey: readonly unknown[]
  queryFn: () => Promise<unknown>
  enabled: boolean
}

function obterOpcoesDaQuery(uuid: string | undefined): QueryOptions {
  renderHook(() => useGetDefinicaoPolo(uuid))

  return useQueryMock.mock.calls.at(-1)?.[0] as QueryOptions
}

describe('useGetDefinicaoPolo', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('busca a definição quando o UUID é informado', async () => {
    const definicao = { uuid: 'definicao-1' }
    vi.mocked(obterDefinicaoPolo).mockResolvedValueOnce(definicao as never)

    const options = obterOpcoesDaQuery('definicao-1')

    await expect(options.queryFn()).resolves.toBe(definicao)
    expect(options.queryKey).toEqual(['definicaoPolo', 'definicao-1'])
    expect(options.enabled).toBe(true)
    expect(obterDefinicaoPolo).toHaveBeenCalledWith('definicao-1')
  })

  it('lança erro quando o UUID não é informado', () => {
    const options = obterOpcoesDaQuery(undefined)

    expect(options.enabled).toBe(false)
    expect(() => options.queryFn()).toThrow(
      'UUID da definição do polo não informado.',
    )
    expect(obterDefinicaoPolo).not.toHaveBeenCalled()
  })
})
