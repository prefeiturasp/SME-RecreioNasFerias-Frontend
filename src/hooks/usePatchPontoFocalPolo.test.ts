import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { DadosPontoFocalPolo, PoloDetalhado } from '@/services/polo/types'
import { usePatchPontoFocalPolo } from './usePatchPontoFocalPolo'

const { useMutationMock, invalidateQueriesMock, atualizarPontoFocalPoloMock } =
  vi.hoisted(() => ({
    useMutationMock: vi.fn(),
    invalidateQueriesMock: vi.fn(),
    atualizarPontoFocalPoloMock: vi.fn(),
  }))

vi.mock('@tanstack/react-query', () => ({
  useMutation: (options: unknown) => {
    useMutationMock(options)
    return options
  },
}))

vi.mock('@/lib/queryClient', () => ({
  queryClient: { invalidateQueries: invalidateQueriesMock },
}))

vi.mock('@/services/polo/atualizarPontoFocalPolo', () => ({
  atualizarPontoFocalPolo: atualizarPontoFocalPoloMock,
}))

type MutationOptions = {
  mutationFn: (dados: DadosPontoFocalPolo) => Promise<PoloDetalhado>
  onSuccess: () => void
}

const dadosPontoFocal: DadosPontoFocalPolo = {
  ponto_focal_nome: 'Maria Silva',
  ponto_focal_telefone: '(11) 99999-9999',
  ponto_focal_email: 'maria@example.com',
}

const poloAtualizado = { uuid: 'polo-123' } as PoloDetalhado

function obterOpcoesDaMutacao(uuid: string | undefined): MutationOptions {
  renderHook(() => usePatchPontoFocalPolo(uuid))

  return useMutationMock.mock.calls.at(-1)?.[0] as MutationOptions
}

describe('usePatchPontoFocalPolo', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('atualiza o ponto focal e invalida as consultas relacionadas ao Polo', async () => {
    const uuid = 'polo-123'
    atualizarPontoFocalPoloMock.mockResolvedValue(poloAtualizado)
    const options = obterOpcoesDaMutacao(uuid)

    await expect(options.mutationFn(dadosPontoFocal)).resolves.toBe(
      poloAtualizado,
    )
    expect(atualizarPontoFocalPoloMock).toHaveBeenCalledWith(
      uuid,
      dadosPontoFocal,
    )

    act(() => options.onSuccess())

    expect(invalidateQueriesMock).toHaveBeenNthCalledWith(1, {
      queryKey: ['polo', uuid],
    })
    expect(invalidateQueriesMock).toHaveBeenNthCalledWith(2, {
      queryKey: ['definicoesPolo'],
    })
    expect(invalidateQueriesMock).toHaveBeenNthCalledWith(3, {
      queryKey: ['definicaoPolo'],
    })
  })

  it('lança erro se o UUID do Polo não foi informado', async () => {
    const options = obterOpcoesDaMutacao(undefined)

    expect(() => options.mutationFn(dadosPontoFocal)).toThrow(
      'UUID do polo não informado.',
    )
    expect(atualizarPontoFocalPoloMock).not.toHaveBeenCalled()
  })

  it('invalida as listagens mesmo quando o UUID não está disponível no sucesso', () => {
    const options = obterOpcoesDaMutacao(undefined)

    act(() => options.onSuccess())

    expect(invalidateQueriesMock).toHaveBeenCalledTimes(2)
    expect(invalidateQueriesMock).toHaveBeenNthCalledWith(1, {
      queryKey: ['definicoesPolo'],
    })
    expect(invalidateQueriesMock).toHaveBeenNthCalledWith(2, {
      queryKey: ['definicaoPolo'],
    })
  })
})
