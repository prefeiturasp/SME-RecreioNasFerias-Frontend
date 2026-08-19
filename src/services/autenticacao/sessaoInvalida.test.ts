import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  notificarSessaoInvalida,
  registrarOuvinteSessaoInvalida,
  respostaIndicaSessaoInvalida,
} from './sessaoInvalida'
import {
  definirSessaoAutenticacao,
  limparSessaoAutenticacao,
  obterSessaoAutenticacao,
} from './storage'

describe('respostaIndicaSessaoInvalida', () => {
  it('identifica status 401 como sessão inválida', () => {
    expect(respostaIndicaSessaoInvalida(401, undefined)).toBe(true)
  })

  it('identifica 403 com detalhe de token inválido ou expirado', () => {
    expect(
      respostaIndicaSessaoInvalida(403, {
        detalhe: 'Token inválido ou expirado.',
      }),
    ).toBe(true)
  })

  it('identifica 403 com detail de token expirado (formato antigo)', () => {
    expect(
      respostaIndicaSessaoInvalida(403, { detail: 'Token expirado.' }),
    ).toBe(true)
  })

  it('identifica mensagem de token em qualquer caixa', () => {
    expect(
      respostaIndicaSessaoInvalida(403, { detalhe: 'TOKEN EXPIRADO' }),
    ).toBe(true)
  })

  it('não identifica 403 com outra mensagem como sessão inválida', () => {
    expect(
      respostaIndicaSessaoInvalida(403, { detalhe: 'Acesso negado.' }),
    ).toBe(false)
  })

  it('não identifica outros status como sessão inválida', () => {
    expect(respostaIndicaSessaoInvalida(200, {})).toBe(false)
    expect(respostaIndicaSessaoInvalida(500, {})).toBe(false)
  })
})

describe('notificarSessaoInvalida', () => {
  beforeEach(() => {
    limparSessaoAutenticacao()
  })

  it('limpa sessão e notifica ouvintes quando a sessão expira', () => {
    const ouvinte = vi.fn()

    definirSessaoAutenticacao({
      token: 'eyJ-token',
      rf: '1234567',
      nome: 'Usuário Teste',
      descricaoCargo: 'Cargo Teste',
    })

    const removerOuvinte = registrarOuvinteSessaoInvalida(ouvinte)
    notificarSessaoInvalida()

    expect(obterSessaoAutenticacao()).toBeNull()
    expect(ouvinte).toHaveBeenCalledTimes(1)

    removerOuvinte()
  })

  it('não notifica quando não há sessão ativa', () => {
    const ouvinte = vi.fn()
    registrarOuvinteSessaoInvalida(ouvinte)

    notificarSessaoInvalida()

    expect(ouvinte).not.toHaveBeenCalled()
  })
})
