import { axiosPostMock } from '../api/mocks'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  invalidarCacheVerificacaoSessao,
  sessaoVerificadaRecentemente,
} from './cacheVerificacaoSessao'
import { restaurarSessaoAutenticacao } from './restaurarSessaoAutenticacao'
import {
  definirSessaoAutenticacao,
  estaAutenticado,
  limparSessaoAutenticacao,
  obterPerfilUsuario,
} from './storage'

const { apiGetMock } = vi.hoisted(() => ({
  apiGetMock: vi.fn(),
}))

vi.mock('../api/http', () => ({
  api: { get: apiGetMock },
}))

const respostaMeExemplo = {
  rf: '1234567',
  nome: 'USUARIO TESTE',
  cargos: [
    {
      codigoCargo: 1234,
      descricaoCargo: 'CARGO TESTE',
    },
  ],
}

describe('restaurarSessaoAutenticacao', () => {
  beforeEach(() => {
    limparSessaoAutenticacao()
    invalidarCacheVerificacaoSessao()
    axiosPostMock.mockReset()
    apiGetMock.mockReset()
  })

  it('não faz nada quando já existe token em memória', async () => {
    definirSessaoAutenticacao({
      token: 'eyJ-token',
      rf: '1234567',
      nome: 'USUARIO TESTE',
      descricaoCargo: 'CARGO',
    })

    await restaurarSessaoAutenticacao()

    expect(axiosPostMock).not.toHaveBeenCalled()
    expect(apiGetMock).not.toHaveBeenCalled()
    expect(estaAutenticado()).toBe(true)
  })

  it('restaura o token via refresh e atualiza o perfil via me', async () => {
    axiosPostMock.mockResolvedValue({ data: { token: 'eyJ-token-renovado' } })
    apiGetMock.mockResolvedValue({ data: respostaMeExemplo })

    await restaurarSessaoAutenticacao()

    expect(estaAutenticado()).toBe(true)
    expect(obterPerfilUsuario()).toEqual({
      rf: '1234567',
      nome: 'USUARIO TESTE',
      descricaoCargo: 'CARGO TESTE',
    })
    expect(sessaoVerificadaRecentemente()).toBe(true)
    expect(axiosPostMock).toHaveBeenCalledTimes(1)
    expect(apiGetMock).toHaveBeenCalledTimes(1)
  })

  it('limpa a sessão quando o refresh falha', async () => {
    axiosPostMock.mockRejectedValue({ response: { status: 401 } })

    await restaurarSessaoAutenticacao()

    expect(estaAutenticado()).toBe(false)
    expect(obterPerfilUsuario()).toBeNull()
    expect(sessaoVerificadaRecentemente()).toBe(false)
  })

  it('mantém o token quando o refresh funciona mas o me falha', async () => {
    axiosPostMock.mockResolvedValue({ data: { token: 'eyJ-token-renovado' } })
    apiGetMock.mockRejectedValue({ response: { status: 500 } })

    await restaurarSessaoAutenticacao()

    expect(estaAutenticado()).toBe(true)
    expect(sessaoVerificadaRecentemente()).toBe(false)
  })

  it('compartilha a mesma restauração entre chamadas concorrentes', async () => {
    axiosPostMock.mockResolvedValue({ data: { token: 'eyJ-token-renovado' } })
    apiGetMock.mockResolvedValue({ data: respostaMeExemplo })

    await Promise.all([
      restaurarSessaoAutenticacao(),
      restaurarSessaoAutenticacao(),
    ])

    expect(axiosPostMock).toHaveBeenCalledTimes(1)
    expect(apiGetMock).toHaveBeenCalledTimes(1)
  })

  it('nova restauração após concluída não refaz refresh quando autenticado', async () => {
    axiosPostMock.mockResolvedValue({ data: { token: 'eyJ-token-renovado' } })
    apiGetMock.mockResolvedValue({ data: respostaMeExemplo })

    await restaurarSessaoAutenticacao()
    await restaurarSessaoAutenticacao()

    expect(axiosPostMock).toHaveBeenCalledTimes(1)
  })
})
