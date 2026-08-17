import { describe, expect, it } from 'vitest'
import {
  extrairMensagemDeErro,
  extrairMensagemDeErroDeDados,
} from './extrairMensagemDeErro'

describe('extrairMensagemDeErroDeDados', () => {
  it('prioriza a chave detalhe do backend', () => {
    expect(
      extrairMensagemDeErroDeDados({
        detalhe: 'Credenciais inválidas',
        error: 'outra mensagem',
      }),
    ).toBe('Credenciais inválidas')
  })

  it('aceita a chave error', () => {
    expect(extrairMensagemDeErroDeDados({ error: 'Falha geral' })).toBe(
      'Falha geral',
    )
  })

  it('aceita a chave detail', () => {
    expect(extrairMensagemDeErroDeDados({ detail: 'Não encontrado.' })).toBe(
      'Não encontrado.',
    )
  })

  it('retorna o texto bruto quando os dados são uma string', () => {
    expect(extrairMensagemDeErroDeDados('Bad Gateway')).toBe('Bad Gateway')
  })

  it('retorna null quando não há mensagem reconhecida', () => {
    expect(extrairMensagemDeErroDeDados({ mensagem: 'outra chave' })).toBeNull()
    expect(extrairMensagemDeErroDeDados({})).toBeNull()
    expect(extrairMensagemDeErroDeDados(null)).toBeNull()
    expect(extrairMensagemDeErroDeDados(undefined)).toBeNull()
    expect(extrairMensagemDeErroDeDados('   ')).toBeNull()
  })
})

describe('extrairMensagemDeErro', () => {
  it('extrai a mensagem do corpo da resposta de um erro de API', () => {
    expect(
      extrairMensagemDeErro({
        response: { data: { detalhe: 'Credenciais inválidas' } },
      }),
    ).toBe('Credenciais inválidas')
  })

  it('retorna string vazia quando o erro não tem resposta', () => {
    expect(extrairMensagemDeErro(new Error('network error'))).toBe('')
    expect(extrairMensagemDeErro(null)).toBe('')
  })
})
