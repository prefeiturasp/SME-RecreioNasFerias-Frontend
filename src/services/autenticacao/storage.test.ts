import { beforeEach, describe, expect, it } from 'vitest'
import {
  definirPerfilUsuario,
  definirSessaoAutenticacao,
  definirTokenAutenticacao,
  estaAutenticado,
  limparSessaoAutenticacao,
  obterPerfilUsuario,
  obterSessaoAutenticacao,
  obterTokenAutenticacao,
} from './storage'

describe('storage de autenticação', () => {
  beforeEach(() => {
    limparSessaoAutenticacao()
  })

  it('persiste o perfil e mantém o token apenas em memória', () => {
    definirSessaoAutenticacao({
      token: 'eyJ-token',
      rf: '1234567',
      nome: 'USUARIO TESTE',
      descricaoCargo: 'CARGO TESTE',
    })

    expect(obterSessaoAutenticacao()).toEqual({
      token: 'eyJ-token',
      rf: '1234567',
      nome: 'USUARIO TESTE',
      descricaoCargo: 'CARGO TESTE',
    })
    expect(obterTokenAutenticacao()).toBe('eyJ-token')
    expect(estaAutenticado()).toBe(true)
  })

  it('não armazena o token no localStorage', () => {
    definirSessaoAutenticacao({
      token: 'eyJ-token',
      rf: '1234567',
      nome: 'USUARIO TESTE',
      descricaoCargo: 'CARGO TESTE',
    })

    const armazenado = localStorage.getItem('sme-recreio-auth-session')

    expect(armazenado).not.toContain('eyJ-token')
    expect(obterPerfilUsuario()).toEqual({
      rf: '1234567',
      nome: 'USUARIO TESTE',
      descricaoCargo: 'CARGO TESTE',
    })
  })

  it('remove a sessão local ao limpar a autenticação', () => {
    definirSessaoAutenticacao({
      token: 'eyJ-token',
      rf: '1234567',
      nome: 'USUARIO TESTE',
      descricaoCargo: 'CARGO TESTE',
    })

    limparSessaoAutenticacao()

    expect(obterSessaoAutenticacao()).toBeNull()
    expect(obterPerfilUsuario()).toBeNull()
    expect(obterTokenAutenticacao()).toBeNull()
    expect(estaAutenticado()).toBe(false)
  })

  it('atualiza o token em memória sem alterar o perfil', () => {
    definirSessaoAutenticacao({
      token: 'eyJ-token',
      rf: '1234567',
      nome: 'USUARIO TESTE',
      descricaoCargo: 'CARGO TESTE',
    })

    definirTokenAutenticacao('eyJ-token-renovado')

    expect(obterTokenAutenticacao()).toBe('eyJ-token-renovado')
    expect(obterSessaoAutenticacao()).toEqual({
      token: 'eyJ-token-renovado',
      rf: '1234567',
      nome: 'USUARIO TESTE',
      descricaoCargo: 'CARGO TESTE',
    })
  })

  it('persiste apenas o perfil quando solicitado', () => {
    definirPerfilUsuario({
      rf: '1234567',
      nome: 'USUARIO TESTE',
      descricaoCargo: 'CARGO TESTE',
    })

    expect(obterPerfilUsuario()).toEqual({
      rf: '1234567',
      nome: 'USUARIO TESTE',
      descricaoCargo: 'CARGO TESTE',
    })
    expect(obterTokenAutenticacao()).toBeNull()
    expect(estaAutenticado()).toBe(false)
  })

  it('retorna null quando o JSON do perfil armazenado é inválido', () => {
    localStorage.setItem('sme-recreio-auth-session', '{invalido')

    expect(obterPerfilUsuario()).toBeNull()
  })

  it('retorna null quando o perfil armazenado possui dados inválidos', () => {
    localStorage.setItem(
      'sme-recreio-auth-session',
      JSON.stringify({
        rf: '',
        nome: 'USUARIO TESTE',
        descricaoCargo: 'CARGO TESTE',
      }),
    )

    expect(obterPerfilUsuario()).toBeNull()
  })

  it('retorna o perfil sem token quando não existe token em memória', () => {
    localStorage.setItem(
      'sme-recreio-auth-session',
      JSON.stringify({
        rf: '1234567',
        nome: 'USUARIO TESTE',
        descricaoCargo: 'CARGO TESTE',
      }),
    )

    expect(obterPerfilUsuario()).toEqual({
      rf: '1234567',
      nome: 'USUARIO TESTE',
      descricaoCargo: 'CARGO TESTE',
    })
    expect(obterSessaoAutenticacao()).toBeNull()
  })
})
