import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type {
  DadosCadastroInscricao,
  Inscricao,
} from '@/services/inscricao/types'
import { usePutInscricao } from './usePutInscricao'

const { useMutationMock, invalidateQueriesMock, atualizarInscricaoMock } =
  vi.hoisted(() => ({
    useMutationMock: vi.fn(),
    invalidateQueriesMock: vi.fn(),
    atualizarInscricaoMock: vi.fn(),
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

vi.mock('@/services/inscricao/atualizarInscricao', () => ({
  atualizarInscricao: atualizarInscricaoMock,
}))

type MutationOptions = {
  mutationFn: (dados: DadosCadastroInscricao) => Promise<Inscricao>
  onSuccess: () => void
}

const dadosInscricao = {
  nomeCompleto: 'Ana Souza',
} as DadosCadastroInscricao

const inscricaoAtualizada = {
  uuid: 'inscricao-1',
  status_label: 'Completa',
} as Inscricao

function obterOpcoesDaMutacao(uuid: string | undefined): MutationOptions {
  renderHook(() => usePutInscricao(uuid))

  return useMutationMock.mock.calls.at(-1)?.[0] as MutationOptions
}

describe('usePutInscricao', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('atualiza a inscrição e invalida o detalhe e a listagem', async () => {
    const uuid = 'inscricao-1'
    atualizarInscricaoMock.mockResolvedValue(inscricaoAtualizada)
    const options = obterOpcoesDaMutacao(uuid)

    await expect(options.mutationFn(dadosInscricao)).resolves.toBe(
      inscricaoAtualizada,
    )
    expect(atualizarInscricaoMock).toHaveBeenCalledWith(uuid, dadosInscricao)

    act(() => options.onSuccess())

    expect(invalidateQueriesMock).toHaveBeenNthCalledWith(1, {
      queryKey: ['inscricao', uuid],
    })
    expect(invalidateQueriesMock).toHaveBeenNthCalledWith(2, {
      queryKey: ['inscricoes'],
    })
  })

  it('lança erro se o UUID da inscrição não foi informado', () => {
    const options = obterOpcoesDaMutacao(undefined)

    expect(() => options.mutationFn(dadosInscricao)).toThrow(
      'UUID da inscrição não informado.',
    )
    expect(atualizarInscricaoMock).not.toHaveBeenCalled()
  })

  it('invalida a listagem mesmo quando o UUID não está disponível no sucesso', () => {
    const options = obterOpcoesDaMutacao(undefined)

    act(() => options.onSuccess())

    expect(invalidateQueriesMock).toHaveBeenCalledTimes(1)
    expect(invalidateQueriesMock).toHaveBeenCalledWith({
      queryKey: ['inscricoes'],
    })
  })
})
