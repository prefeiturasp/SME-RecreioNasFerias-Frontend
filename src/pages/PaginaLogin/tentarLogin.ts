import { construirUrlApi } from '../../services/api/construirUrlApi'
import {
  definirSessaoAutenticacao,
  interpretarRespostaLogin,
} from '../../services/autenticacao'

export type CredenciaisLogin = {
  usuario: string
  senha: string
}

export class ErroAcessoNegadoLogin extends Error {
  readonly nomeUsuario: string

  constructor(nomeUsuario: string) {
    super('LOGIN_ACCESS_DENIED')
    this.name = 'ErroAcessoNegadoLogin'
    this.nomeUsuario = nomeUsuario
  }
}

export class ErroFalhaLogin extends Error {
  readonly mensagemUsuario: string

  constructor(mensagemUsuario: string) {
    super('LOGIN_FAILED')
    this.name = 'ErroFalhaLogin'
    this.mensagemUsuario = mensagemUsuario
  }
}

async function extrairMensagemDeErroDaResposta(
  response: Response,
): Promise<string> {
  const corpo = await response.text()
  if (!corpo.trim()) {
    return ''
  }

  try {
    const dados = JSON.parse(corpo) as unknown
    if (dados && typeof dados === 'object') {
      if (
        'error' in dados &&
        typeof (dados as { error: unknown }).error === 'string'
      ) {
        return (dados as { error: string }).error
      }

      if (
        'detail' in dados &&
        typeof (dados as { detail: unknown }).detail === 'string'
      ) {
        return (dados as { detail: string }).detail
      }
    }
  } catch {
    // corpo não é JSON; exibe o texto bruto retornado pelo backend
  }

  return corpo
}

export async function tentarLogin({
  usuario,
  senha,
}: CredenciaisLogin): Promise<void> {
  const response = await fetch(construirUrlApi('/api/auth/login/'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login: usuario, senha }),
  })

  if (response.status === 403) {
    throw new ErroAcessoNegadoLogin(usuario)
  }

  if (!response.ok) {
    const mensagem = await extrairMensagemDeErroDaResposta(response)
    throw new ErroFalhaLogin(mensagem)
  }

  const dados = await response.json()
  const session = interpretarRespostaLogin(dados)

  if (!session) {
    throw new ErroFalhaLogin('Resposta de login inválida.')
  }

  definirSessaoAutenticacao(session)
}
