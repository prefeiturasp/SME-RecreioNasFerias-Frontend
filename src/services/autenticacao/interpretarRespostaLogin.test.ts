import { describe, expect, it } from 'vitest'
import {
  extrairPerfilUsuario,
  interpretarRespostaLogin,
} from './interpretarRespostaLogin'

const respostaLoginValida = {
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

describe('interpretarRespostaLogin', () => {
  it('extrai a sessão a partir de uma resposta válida', () => {
    expect(interpretarRespostaLogin(respostaLoginValida)).toEqual({
      token: 'eyJ-token-exemplo',
      rf: '1234567',
      nome: 'USUARIO TESTE',
      descricaoCargo: 'CARGO TESTE',
    })
  })

  it('normaliza espaços dos campos de sessão', () => {
    expect(
      interpretarRespostaLogin({
        ...respostaLoginValida,
        token: '  eyJ-token  ',
        rf: ' 1234567 ',
        nome: ' USUARIO TESTE ',
        cargos: [{ descricaoCargo: ' CARGO TESTE ' }],
      }),
    ).toEqual({
      token: 'eyJ-token',
      rf: '1234567',
      nome: 'USUARIO TESTE',
      descricaoCargo: 'CARGO TESTE',
    })
  })

  it('retorna null quando a resposta não é um objeto', () => {
    expect(interpretarRespostaLogin(null)).toBeNull()
    expect(interpretarRespostaLogin(undefined)).toBeNull()
    expect(interpretarRespostaLogin('resposta inválida')).toBeNull()
  })

  it('retorna null quando o token é inválido', () => {
    expect(
      interpretarRespostaLogin({ ...respostaLoginValida, token: '' }),
    ).toBeNull()
    expect(
      interpretarRespostaLogin({ ...respostaLoginValida, token: '   ' }),
    ).toBeNull()
    expect(
      interpretarRespostaLogin({ ...respostaLoginValida, token: 123 }),
    ).toBeNull()
  })

  it('retorna null quando os dados do perfil são inválidos', () => {
    expect(
      interpretarRespostaLogin({ ...respostaLoginValida, rf: '' }),
    ).toBeNull()
    expect(
      interpretarRespostaLogin({ ...respostaLoginValida, nome: '' }),
    ).toBeNull()
    expect(
      interpretarRespostaLogin({ ...respostaLoginValida, cargos: [] }),
    ).toBeNull()
    expect(
      interpretarRespostaLogin({
        ...respostaLoginValida,
        cargos: [{ descricaoCargo: '' }],
      }),
    ).toBeNull()
  })

  it('retorna null quando o primeiro cargo não é válido', () => {
    expect(
      interpretarRespostaLogin({ ...respostaLoginValida, cargos: [null] }),
    ).toBeNull()
    expect(
      interpretarRespostaLogin({ ...respostaLoginValida, cargos: [{}] }),
    ).toBeNull()
    expect(
      interpretarRespostaLogin({ ...respostaLoginValida, cargos: 'CARGO' }),
    ).toBeNull()
  })
})

describe('extrairPerfilUsuario', () => {
  it('extrai o perfil sem exigir token', () => {
    expect(extrairPerfilUsuario(respostaLoginValida)).toEqual({
      rf: '1234567',
      nome: 'USUARIO TESTE',
      descricaoCargo: 'CARGO TESTE',
    })
  })

  it('retorna null para dados de perfil inválidos', () => {
    expect(extrairPerfilUsuario(null)).toBeNull()
    expect(extrairPerfilUsuario({})).toBeNull()
    expect(extrairPerfilUsuario({ rf: '1', nome: 'Maria' })).toBeNull()
  })
})
