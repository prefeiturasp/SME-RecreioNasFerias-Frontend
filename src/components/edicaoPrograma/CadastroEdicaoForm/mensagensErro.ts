import { ErroCadastroEdicaoPrograma } from '@/services/edicaoPrograma/api'

const MENSAGEM_FALHA_CADASTRO =
  'Não foi possível cadastrar a edição do programa.'

export function obterMensagemDeErroCadastroEdicao(error: unknown): string {
  if (error instanceof ErroCadastroEdicaoPrograma) {
    return error.mensagemUsuario.trim() || MENSAGEM_FALHA_CADASTRO
  }

  return MENSAGEM_FALHA_CADASTRO
}
