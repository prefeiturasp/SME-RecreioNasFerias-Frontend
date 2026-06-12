import { beforeEach, describe, expect, it } from 'vitest'
import { interpretarRespostaLogin } from './interpretarRespostaLogin'
import {
  definirSessaoAutenticacao,
  estaAutenticado,
  limparSessaoAutenticacao,
  obterSessaoAutenticacao,
  obterTokenAutenticacao,
} from './storage'

const respostaLoginExemplo = {
  rf: '8080640',
  cpf: '22712612876',
  email: 'vania.montefusco@sme.prefeitura.sp.gov.br',
  cargos: [
    {
      codigoCargo: 2640,
      descricaoCargo: 'ASSISTENTE TECNICO DE EDUCACAO I',
      codigoUnidade: '121000',
      descricaoUnidade:
        'COORDENADORIA DOS CENTROS EDUCACIONAIS UNIFICADOS - COCEU',
      codigoDre: '121000',
      contratoExterno: false,
    },
  ],
  nome: 'VANIA FERREIRA DA SILVA CANEKI',
  inexistenteEol: false,
  token: 'eyJ-token-exemplo',
}

describe('autenticacao storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('persiste e recupera a sessão completa', () => {
    definirSessaoAutenticacao({
      token: 'eyJ-token',
      rf: '8080640',
      nome: 'VANIA FERREIRA DA SILVA CANEKI',
      descricaoCargo: 'ASSISTENTE TECNICO DE EDUCACAO I',
    })

    expect(obterSessaoAutenticacao()).toEqual({
      token: 'eyJ-token',
      rf: '8080640',
      nome: 'VANIA FERREIRA DA SILVA CANEKI',
      descricaoCargo: 'ASSISTENTE TECNICO DE EDUCACAO I',
    })
    expect(obterTokenAutenticacao()).toBe('eyJ-token')
    expect(estaAutenticado()).toBe(true)
  })

  it('remove a sessão ao limpar autenticação', () => {
    definirSessaoAutenticacao({
      token: 'eyJ-token',
      rf: '8080640',
      nome: 'VANIA',
      descricaoCargo: 'CARGO',
    })
    limparSessaoAutenticacao()
    expect(obterSessaoAutenticacao()).toBeNull()
    expect(estaAutenticado()).toBe(false)
  })
})

describe('interpretarRespostaLogin', () => {
  it('extrai token, rf, nome e descricaoCargo do primeiro cargo', () => {
    expect(interpretarRespostaLogin(respostaLoginExemplo)).toEqual({
      token: 'eyJ-token-exemplo',
      rf: '8080640',
      nome: 'VANIA FERREIRA DA SILVA CANEKI',
      descricaoCargo: 'ASSISTENTE TECNICO DE EDUCACAO I',
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

describe('obterSessaoAutenticacao validação', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('retorna null quando JSON armazenado é inválido', () => {
    localStorage.setItem('sme-recreio-auth-session', '{invalido')
    expect(obterSessaoAutenticacao()).toBeNull()
  })

  it('retorna null quando sessão não possui token válido', () => {
    localStorage.setItem(
      'sme-recreio-auth-session',
      JSON.stringify({ token: '', rf: '1', nome: 'A', descricaoCargo: 'B' }),
    )
    expect(obterSessaoAutenticacao()).toBeNull()
  })
})
