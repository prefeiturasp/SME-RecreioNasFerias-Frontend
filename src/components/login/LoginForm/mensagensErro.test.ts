import { describe, expect, it } from 'vitest'
import {
  ErroAcessoNegadoLogin,
  ErroFalhaLogin,
} from '@/services/autenticacao/login'
import { obterMensagemDeErroLogin } from './mensagensErro'

const MENSAGEM_FALHA_LOGIN =
  'Não foi possível realizar o login. Tente novamente.'

describe('obterMensagemDeErroLogin', () => {
  it('constrói uma mensagem específica para acesso negado', () => {
    expect(
      obterMensagemDeErroLogin(new ErroAcessoNegadoLogin('Maria')),
    ).toContain('Olá Maria!')
  })

  it('usa usuário como fallback quando o nome está vazio', () => {
    expect(
      obterMensagemDeErroLogin(new ErroAcessoNegadoLogin('   ')),
    ).toContain('Olá usuário!')
  })

  it('retorna a mensagem segura de uma falha de login', () => {
    expect(
      obterMensagemDeErroLogin(new ErroFalhaLogin('Serviço indisponível')),
    ).toBe('Serviço indisponível')
  })

  it('usa fallback quando a falha não possui mensagem útil', () => {
    expect(obterMensagemDeErroLogin(new ErroFalhaLogin('   '))).toBe(
      MENSAGEM_FALHA_LOGIN,
    )
  })

  it('usa fallback para erros desconhecidos', () => {
    expect(obterMensagemDeErroLogin(new Error('erro técnico'))).toBe(
      MENSAGEM_FALHA_LOGIN,
    )
  })
})
