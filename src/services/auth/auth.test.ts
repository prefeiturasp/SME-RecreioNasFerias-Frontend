import { beforeEach, describe, expect, it } from 'vitest'
import { parseLoginResponse } from './parseLoginResponse'
import {
  clearAuthSession,
  getAuthSession,
  getAuthToken,
  isAuthenticated,
  setAuthSession,
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
      descricaoUnidade: 'COORDENADORIA DOS CENTROS EDUCACIONAIS UNIFICADOS - COCEU',
      codigoDre: '121000',
      contratoExterno: false,
    },
  ],
  nome: 'VANIA FERREIRA DA SILVA CANEKI',
  inexistenteEol: false,
  token: 'eyJ-token-exemplo',
}

describe('auth storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('persiste e recupera a sessão completa', () => {
    setAuthSession({
      token: 'eyJ-token',
      rf: '8080640',
      nome: 'VANIA FERREIRA DA SILVA CANEKI',
      descricaoCargo: 'ASSISTENTE TECNICO DE EDUCACAO I',
    })

    expect(getAuthSession()).toEqual({
      token: 'eyJ-token',
      rf: '8080640',
      nome: 'VANIA FERREIRA DA SILVA CANEKI',
      descricaoCargo: 'ASSISTENTE TECNICO DE EDUCACAO I',
    })
    expect(getAuthToken()).toBe('eyJ-token')
    expect(isAuthenticated()).toBe(true)
  })

  it('remove a sessão ao limpar autenticação', () => {
    setAuthSession({
      token: 'eyJ-token',
      rf: '8080640',
      nome: 'VANIA',
      descricaoCargo: 'CARGO',
    })
    clearAuthSession()
    expect(getAuthSession()).toBeNull()
    expect(isAuthenticated()).toBe(false)
  })
})

describe('parseLoginResponse', () => {
  it('extrai token, rf, nome e descricaoCargo do primeiro cargo', () => {
    expect(parseLoginResponse(respostaLoginExemplo)).toEqual({
      token: 'eyJ-token-exemplo',
      rf: '8080640',
      nome: 'VANIA FERREIRA DA SILVA CANEKI',
      descricaoCargo: 'ASSISTENTE TECNICO DE EDUCACAO I',
    })
  })

  it('retorna null quando resposta não contém campos obrigatórios', () => {
    expect(parseLoginResponse({ token: 'x', rf: '1', nome: 'Maria' })).toBeNull()
    expect(parseLoginResponse({ ...respostaLoginExemplo, cargos: [] })).toBeNull()
    expect(parseLoginResponse(null)).toBeNull()
    expect(parseLoginResponse({ ...respostaLoginExemplo, token: '   ' })).toBeNull()
    expect(
      parseLoginResponse({
        ...respostaLoginExemplo,
        cargos: [null],
      }),
    ).toBeNull()
  })
})

describe('getAuthSession validação', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('retorna null quando JSON armazenado é inválido', () => {
    localStorage.setItem('sme-recreio-auth-session', '{invalido')
    expect(getAuthSession()).toBeNull()
  })

  it('retorna null quando sessão não possui token válido', () => {
    localStorage.setItem(
      'sme-recreio-auth-session',
      JSON.stringify({ token: '', rf: '1', nome: 'A', descricaoCargo: 'B' }),
    )
    expect(getAuthSession()).toBeNull()
  })
})
