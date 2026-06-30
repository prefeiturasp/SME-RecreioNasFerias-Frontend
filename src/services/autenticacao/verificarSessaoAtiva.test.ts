import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  invalidarCacheVerificacaoSessao,
  marcarSessaoVerificada,
} from './cacheVerificacaoSessao'
import { definirSessaoAutenticacao } from './storage'
import {
  deveVerificarSessaoNaRota,
  verificarSessaoAtiva,
} from './verificarSessaoAtiva'

describe('deveVerificarSessaoNaRota', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('não verifica sessão na página de login', () => {
    expect(deveVerificarSessaoNaRota('/')).toBe(false)
  })

  it('não verifica sessão na listagem de edições', () => {
    definirSessaoAutenticacao({
      token: 'eyJ-token',
      rf: '1234567',
      nome: 'Usuário Teste',
      descricaoCargo: 'Cargo Teste',
    })

    expect(deveVerificarSessaoNaRota('/edicoes-programa')).toBe(false)
  })

  it('verifica sessão em outras rotas autenticadas', () => {
    definirSessaoAutenticacao({
      token: 'eyJ-token',
      rf: '1234567',
      nome: 'Usuário Teste',
      descricaoCargo: 'Cargo Teste',
    })

    expect(deveVerificarSessaoNaRota('/inicio')).toBe(true)
  })
})

describe('verificarSessaoAtiva', () => {
  beforeEach(() => {
    localStorage.clear()
    invalidarCacheVerificacaoSessao()
  })

  it('retorna false quando não há sessão local', async () => {
    await expect(verificarSessaoAtiva()).resolves.toBe(false)
  })

  it('reutiliza cache recente sem chamar a API', async () => {
    definirSessaoAutenticacao({
      token: 'eyJ-token',
      rf: '1234567',
      nome: 'Usuário Teste',
      descricaoCargo: 'Cargo Teste',
    })
    marcarSessaoVerificada()

    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    await expect(verificarSessaoAtiva()).resolves.toBe(true)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('retorna true quando a API aceita o token', async () => {
    definirSessaoAutenticacao({
      token: 'eyJ-token',
      rf: '1234567',
      nome: 'Usuário Teste',
      descricaoCargo: 'Cargo Teste',
    })

    const fetchMock = vi.fn().mockResolvedValue({ status: 200, ok: true })
    vi.stubGlobal('fetch', fetchMock)

    await expect(verificarSessaoAtiva()).resolves.toBe(true)
  })

  it('retorna false quando a API retorna 401', async () => {
    definirSessaoAutenticacao({
      token: 'eyJ-token-expirado',
      rf: '1234567',
      nome: 'Usuário Teste',
      descricaoCargo: 'Cargo Teste',
    })

    const fetchMock = vi.fn().mockResolvedValue({ status: 401, ok: false })
    vi.stubGlobal('fetch', fetchMock)

    await expect(verificarSessaoAtiva()).resolves.toBe(false)
  })

  it('retorna false quando a API retorna 403 com token expirado', async () => {
    definirSessaoAutenticacao({
      token: 'eyJ-token-expirado',
      rf: '1234567',
      nome: 'Usuário Teste',
      descricaoCargo: 'Cargo Teste',
    })

    const { MENSAGEM_TOKEN_INVALIDO_OU_EXPIRADO } = await import('./sessaoInvalida')
    const corpo = JSON.stringify({
      detail: MENSAGEM_TOKEN_INVALIDO_OU_EXPIRADO,
    })
    const fetchMock = vi.fn().mockResolvedValue({
      status: 403,
      ok: false,
      clone: () => ({
        text: () => Promise.resolve(corpo),
      }),
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(verificarSessaoAtiva()).resolves.toBe(false)
  })

  it('mantém sessão quando ocorre falha de rede', async () => {
    definirSessaoAutenticacao({
      token: 'eyJ-token',
      rf: '1234567',
      nome: 'Usuário Teste',
      descricaoCargo: 'Cargo Teste',
    })

    const fetchMock = vi.fn().mockRejectedValue(new Error('network'))
    vi.stubGlobal('fetch', fetchMock)

    await expect(verificarSessaoAtiva()).resolves.toBe(true)
  })
})
