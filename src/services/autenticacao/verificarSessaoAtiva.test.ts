import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  invalidarCacheVerificacaoSessao,
  marcarSessaoVerificada,
} from './cacheVerificacaoSessao'
import { definirSessaoAutenticacao, limparSessaoAutenticacao } from './storage'
import {
  deveVerificarSessaoNaRota,
  verificarSessaoAtiva,
} from './verificarSessaoAtiva'

const { apiGetMock } = vi.hoisted(() => ({
  apiGetMock: vi.fn(),
}))

vi.mock('../api/http', () => ({
  api: { get: apiGetMock },
}))

function definirSessaoComToken(token = 'eyJ-token') {
  definirSessaoAutenticacao({
    token,
    rf: '1234567',
    nome: 'Usuário Teste',
    descricaoCargo: 'Cargo Teste',
  })
}

describe('deveVerificarSessaoNaRota', () => {
  beforeEach(() => {
    limparSessaoAutenticacao()
  })

  it('não verifica sessão na página de login', () => {
    expect(deveVerificarSessaoNaRota('/')).toBe(false)
  })

  it('não verifica sessão na listagem de edições', () => {
    definirSessaoComToken()

    expect(deveVerificarSessaoNaRota('/edicoes-programa')).toBe(false)
  })

  it('verifica sessão em outras rotas autenticadas', () => {
    definirSessaoComToken()

    expect(deveVerificarSessaoNaRota('/inicio')).toBe(true)
  })
})

describe('verificarSessaoAtiva', () => {
  beforeEach(() => {
    limparSessaoAutenticacao()
    invalidarCacheVerificacaoSessao()
    apiGetMock.mockReset()
  })

  it('retorna false quando não há sessão local', async () => {
    await expect(verificarSessaoAtiva()).resolves.toBe(false)
    expect(apiGetMock).not.toHaveBeenCalled()
  })

  it('reutiliza cache recente sem chamar a API', async () => {
    definirSessaoComToken()
    marcarSessaoVerificada()

    await expect(verificarSessaoAtiva()).resolves.toBe(true)
    expect(apiGetMock).not.toHaveBeenCalled()
  })

  it('verifica a sessão no endpoint me', async () => {
    definirSessaoComToken()
    apiGetMock.mockResolvedValue({ data: { rf: '1234567' } })

    await expect(verificarSessaoAtiva()).resolves.toBe(true)
    expect(apiGetMock).toHaveBeenCalledWith('/api/v1/auth/me/')
  })

  it('retorna false quando a API responde 401', async () => {
    definirSessaoComToken('eyJ-token-expirado')
    apiGetMock.mockRejectedValue({ response: { status: 401, data: null } })

    await expect(verificarSessaoAtiva()).resolves.toBe(false)
  })

  it('retorna false quando a API responde 403 com token expirado', async () => {
    definirSessaoComToken('eyJ-token-expirado')
    apiGetMock.mockRejectedValue({
      response: {
        status: 403,
        data: { detalhe: 'Token inválido ou expirado.' },
      },
    })

    await expect(verificarSessaoAtiva()).resolves.toBe(false)
  })

  it('mantém sessão quando ocorre falha de rede', async () => {
    definirSessaoComToken()
    apiGetMock.mockRejectedValue(new Error('network'))

    await expect(verificarSessaoAtiva()).resolves.toBe(true)
  })
})
