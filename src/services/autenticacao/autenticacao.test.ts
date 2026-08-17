import { beforeEach, describe, expect, it } from 'vitest'
import {
  extrairPerfilUsuario,
  interpretarRespostaLogin,
} from './interpretarRespostaLogin'
import {
  definirSessaoAutenticacao,
  definirTokenAutenticacao,
  estaAutenticado,
  limparSessaoAutenticacao,
  obterPerfilUsuario,
  obterSessaoAutenticacao,
  obterTokenAutenticacao,
} from './storage'

const respostaLoginExemplo = {
  rf: '1234567',
  cpf: '11122233344',
  email: 'usuario.teste@sme.prefeitura.sp.gov.br',
  cargos: [
    {
      codigoCargo: 1234,
      descricaoCargo: 'CARGO TESTE',
      codigoUnidade: '000123',
      descricaoUnidade: 'UNIDADE DE TESTE',
      codigoDre: '000123',
      contratoExterno: false,
    },
  ],
  nome: 'USUARIO TESTE',
  inexistenteEol: false,
  token: 'eyJ-token-exemplo',
}

describe('autenticacao storage', () => {
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

  it('remove a sessão ao limpar autenticação', () => {
    definirSessaoAutenticacao({
      token: 'eyJ-token',
      rf: '1234567',
      nome: 'USUARIO TESTE',
      descricaoCargo: 'CARGO',
    })
    limparSessaoAutenticacao()
    expect(obterSessaoAutenticacao()).toBeNull()
    expect(obterPerfilUsuario()).toBeNull()
    expect(estaAutenticado()).toBe(false)
  })

  it('atualiza o token em memória sem alterar o perfil', () => {
    definirSessaoAutenticacao({
      token: 'eyJ-token',
      rf: '1234567',
      nome: 'USUARIO TESTE',
      descricaoCargo: 'CARGO',
    })

    definirTokenAutenticacao('eyJ-token-renovado')

    expect(obterTokenAutenticacao()).toBe('eyJ-token-renovado')
    expect(obterSessaoAutenticacao()).toEqual({
      token: 'eyJ-token-renovado',
      rf: '1234567',
      nome: 'USUARIO TESTE',
      descricaoCargo: 'CARGO',
    })
  })
})

describe('interpretarRespostaLogin', () => {
  it('extrai token, rf, nome e descricaoCargo do primeiro cargo', () => {
    expect(interpretarRespostaLogin(respostaLoginExemplo)).toEqual({
      token: 'eyJ-token-exemplo',
      rf: '1234567',
      nome: 'USUARIO TESTE',
      descricaoCargo: 'CARGO TESTE',
    })
  })

  it('retorna null quando resposta não contém campos obrigatórios', () => {
    expect(
      interpretarRespostaLogin({ token: 'x', rf: '1', nome: 'Maria' }),
    ).toBeNull()
    expect(
      interpretarRespostaLogin({ ...respostaLoginExemplo, cargos: [] }),
    ).toBeNull()
    expect(interpretarRespostaLogin(null)).toBeNull()
    expect(
      interpretarRespostaLogin({ ...respostaLoginExemplo, token: '   ' }),
    ).toBeNull()
    expect(
      interpretarRespostaLogin({
        ...respostaLoginExemplo,
        cargos: [null],
      }),
    ).toBeNull()
  })
})

describe('extrairPerfilUsuario', () => {
  it('extrai o perfil sem exigir token', () => {
    expect(extrairPerfilUsuario(respostaLoginExemplo)).toEqual({
      rf: '1234567',
      nome: 'USUARIO TESTE',
      descricaoCargo: 'CARGO TESTE',
    })
  })

  it('retorna null quando o perfil está incompleto', () => {
    expect(extrairPerfilUsuario(null)).toBeNull()
    expect(extrairPerfilUsuario({})).toBeNull()
    expect(extrairPerfilUsuario({ rf: '1', nome: 'Maria' })).toBeNull()
  })
})

describe('obterPerfilUsuario validação', () => {
  beforeEach(() => {
    limparSessaoAutenticacao()
  })

  it('retorna null quando JSON armazenado é inválido', () => {
    localStorage.setItem('sme-recreio-auth-session', '{invalido')
    expect(obterPerfilUsuario()).toBeNull()
  })

  it('retorna null quando perfil armazenado não possui campos válidos', () => {
    localStorage.setItem(
      'sme-recreio-auth-session',
      JSON.stringify({ rf: '', nome: 'A', descricaoCargo: 'B' }),
    )
    expect(obterPerfilUsuario()).toBeNull()
  })

  it('retorna null para obterSessaoAutenticacao quando não há token em memória', () => {
    localStorage.setItem(
      'sme-recreio-auth-session',
      JSON.stringify({
        rf: '1234567',
        nome: 'USUARIO TESTE',
        descricaoCargo: 'CARGO',
      }),
    )

    expect(obterPerfilUsuario()).toEqual({
      rf: '1234567',
      nome: 'USUARIO TESTE',
      descricaoCargo: 'CARGO',
    })
    expect(obterSessaoAutenticacao()).toBeNull()
  })
})
