import {
  ErroAcessoNegadoLogin,
  ErroFalhaLogin,
} from '@/services/autenticacao/login'

const MENSAGEM_FALHA_LOGIN =
  'Não foi possível realizar o login. Tente novamente.'

function construirMensagemAcessoNegado(nomeUsuario: string) {
  const nome = nomeUsuario.trim() || 'usuário'

  return `Olá ${nome}! Desculpe, mas o acesso ao Sistema de Gestão do Recreio nas Férias é restrito a perfis específicos. Entre em contato com o administrador.`
}

export function obterMensagemDeErroLogin(error: unknown): string {
  if (error instanceof ErroAcessoNegadoLogin) {
    return construirMensagemAcessoNegado(error.nomeUsuario)
  }

  if (error instanceof ErroFalhaLogin) {
    return error.mensagemUsuario
  }

  return MENSAGEM_FALHA_LOGIN
}
