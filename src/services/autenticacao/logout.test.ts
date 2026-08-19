import { axiosPostMock } from '../api/mocks'
import { beforeEach, describe, expect, it } from 'vitest'
import { encerrarSessaoAutenticacao } from './logout'
import {
  definirSessaoAutenticacao,
  estaAutenticado,
  limparSessaoAutenticacao,
  obterSessaoAutenticacao,
} from './storage'

describe('encerrarSessaoAutenticacao', () => {
  beforeEach(() => {
    limparSessaoAutenticacao()
    axiosPostMock.mockReset()

    definirSessaoAutenticacao({
      token: 'eyJ-token',
      rf: '1234567',
      nome: 'USUARIO TESTE',
      descricaoCargo: 'CARGO',
    })
  })

  it('chama o endpoint de logout do backend e limpa a sessão local', async () => {
    axiosPostMock.mockResolvedValue({ status: 204 })

    await encerrarSessaoAutenticacao()

    expect(axiosPostMock).toHaveBeenCalledWith('/api/v1/auth/logout/', null, {
      withCredentials: true,
    })
    expect(obterSessaoAutenticacao()).toBeNull()
    expect(estaAutenticado()).toBe(false)
  })

  it('limpa a sessão local mesmo quando o backend falha', async () => {
    axiosPostMock.mockRejectedValue(new Error('network error'))

    await expect(encerrarSessaoAutenticacao()).resolves.toBeUndefined()
    expect(obterSessaoAutenticacao()).toBeNull()
  })

  it('limpa a sessão local mesmo quando o backend responde erro', async () => {
    axiosPostMock.mockRejectedValue({ response: { status: 500 } })

    await encerrarSessaoAutenticacao()

    expect(obterSessaoAutenticacao()).toBeNull()
  })
})
