import axios from 'axios'
import { construirUrlApi } from '../api/construirUrlApi'
import { interpretarRespostaLogin } from './interpretarRespostaLogin'
import { definirSessaoAutenticacao } from './storage'

const MENSAGEM_FALHA_LOGIN =
  'Não foi possível realizar o login. Tente novamente.'

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

  constructor(mensagemUsuario = MENSAGEM_FALHA_LOGIN, causa?: unknown) {
    super('LOGIN_FAILED')
    this.name = 'ErroFalhaLogin'
    this.mensagemUsuario = mensagemUsuario.trim() || MENSAGEM_FALHA_LOGIN

    if (causa !== undefined) {
      this.cause = causa
    }
  }
}

export async function login({
  usuario,
  senha,
}: CredenciaisLogin): Promise<void> {
  let response

  try {
    response = await axios.post(
      construirUrlApi('/api/v1/auth/login/'),
      { login: usuario, senha },
      { withCredentials: true },
    )
  } catch (error) {
    const status = axios.isAxiosError(error) ? error.response?.status : null

    if (status === 403) {
      throw new ErroAcessoNegadoLogin(usuario)
    }

    throw new ErroFalhaLogin(undefined, error)
  }

  const session = interpretarRespostaLogin(response.data as unknown)

  if (!session) {
    throw new ErroFalhaLogin('Não foi possível validar a resposta do login.')
  }

  definirSessaoAutenticacao(session)
}
