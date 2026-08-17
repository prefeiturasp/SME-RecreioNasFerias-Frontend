import { axiosPostMock } from '../api/mocks'
import { beforeEach, describe, expect, it } from 'vitest'
import { atualizarTokenAutenticacaoViaRefresh } from './refreshToken'
import { limparSessaoAutenticacao, obterTokenAutenticacao } from './storage'

describe('atualizarTokenAutenticacaoViaRefresh', () => {
  beforeEach(() => {
    limparSessaoAutenticacao()
    axiosPostMock.mockReset()
  })

  it('renova o token usando o cookie e atualiza a memória', async () => {
    axiosPostMock.mockResolvedValue({ data: { token: 'eyJ-token-renovado' } })

    await expect(atualizarTokenAutenticacaoViaRefresh()).resolves.toBe(
      'eyJ-token-renovado',
    )
    expect(obterTokenAutenticacao()).toBe('eyJ-token-renovado')
    expect(axiosPostMock).toHaveBeenCalledWith(
      '/api/v1/auth/token/refresh/',
      null,
      { withCredentials: true },
    )
  })

  it('retorna null quando o backend recusa a renovação', async () => {
    axiosPostMock.mockRejectedValue({ response: { status: 401 } })

    await expect(atualizarTokenAutenticacaoViaRefresh()).resolves.toBeNull()
    expect(obterTokenAutenticacao()).toBeNull()
  })

  it('retorna null quando a resposta não contém token válido', async () => {
    axiosPostMock.mockResolvedValue({ data: { access: 'outro-formato' } })

    await expect(atualizarTokenAutenticacaoViaRefresh()).resolves.toBeNull()
  })

  it('retorna null quando a resposta é inválida', async () => {
    axiosPostMock.mockResolvedValue({ data: null })

    await expect(atualizarTokenAutenticacaoViaRefresh()).resolves.toBeNull()
  })

  it('retorna null quando ocorre falha de rede', async () => {
    axiosPostMock.mockRejectedValue(new Error('network error'))

    await expect(atualizarTokenAutenticacaoViaRefresh()).resolves.toBeNull()
  })
})
