import { describe, expect, it } from 'vitest'
import { ErroCadastroEdicaoPrograma } from '@/services/edicaoPrograma/api'
import { obterMensagemDeErroCadastroEdicao } from './mensagensErro'

const MENSAGEM_FALHA_CADASTRO =
  'Não foi possível cadastrar a edição do programa.'

describe('obterMensagemDeErroCadastroEdicao', () => {
  it('retorna a mensagem segura de uma falha de cadastro', () => {
    expect(
      obterMensagemDeErroCadastroEdicao(
        new ErroCadastroEdicaoPrograma('Já existe uma edição com este nome.'),
      ),
    ).toBe('Já existe uma edição com este nome.')
  })

  it('usa fallback quando a falha não possui mensagem útil', () => {
    expect(
      obterMensagemDeErroCadastroEdicao(new ErroCadastroEdicaoPrograma('   ')),
    ).toBe(MENSAGEM_FALHA_CADASTRO)
  })

  it('usa fallback para erros desconhecidos', () => {
    expect(obterMensagemDeErroCadastroEdicao(new Error('erro técnico'))).toBe(
      MENSAGEM_FALHA_CADASTRO,
    )
  })
})
