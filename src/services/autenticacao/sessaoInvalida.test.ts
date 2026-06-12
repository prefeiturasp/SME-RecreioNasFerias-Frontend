import { beforeEach, describe, expect, it, vi } from 'vitest'
import { definirSessaoAutenticacao, obterSessaoAutenticacao } from './storage'
import {
  notificarSessaoInvalida,
  registrarOuvinteSessaoInvalida,
  respostaIndicaSessaoInvalida,
} from './sessaoInvalida'

describe('sessaoInvalida', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('identifica resposta 401 como sessão inválida', () => {
    expect(respostaIndicaSessaoInvalida({ status: 401 } as Response)).toBe(true)
    expect(respostaIndicaSessaoInvalida({ status: 403 } as Response)).toBe(
      false,
    )
    expect(respostaIndicaSessaoInvalida({ status: 200 } as Response)).toBe(
      false,
    )
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
