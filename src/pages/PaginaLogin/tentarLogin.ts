import axios from 'axios'
import { construirUrlApi } from '../../services/api/construirUrlApi'
import { extrairMensagemDeErro } from '../../services/api/extrairMensagemDeErro'
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

export async function tentarLogin({
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
    const status = (error as { response?: { status?: number } }).response
      ?.status

    if (status === 403) {
      throw new ErroAcessoNegadoLogin(usuario)
    }

    throw new ErroFalhaLogin(extrairMensagemDeErro(error))
  }

  const session = interpretarRespostaLogin(response.data as unknown)

  if (!session) {
    throw new ErroFalhaLogin('Resposta de login inválida.')
  }

  definirSessaoAutenticacao(session)
}
