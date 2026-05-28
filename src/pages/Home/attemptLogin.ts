import { buildApiUrl } from '../../services/api/buildApiUrl'
import { parseLoginResponse, setAuthSession } from '../../services/auth'

export type LoginCredentials = {
  usuario: string
  senha: string
}

export class LoginAccessDeniedError extends Error {
  readonly userName: string

  constructor(userName: string) {
    super('LOGIN_ACCESS_DENIED')
    this.name = 'LoginAccessDeniedError'
    this.userName = userName
  }
}

export class LoginFailedError extends Error {
  readonly userMessage: string

  constructor(userMessage: string) {
    super('LOGIN_FAILED')
    this.name = 'LoginFailedError'
    this.userMessage = userMessage
  }
}

async function extrairMensagemDeErroDaResposta(response: Response): Promise<string> {
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

export async function attemptLogin({
  usuario,
  senha,
}: LoginCredentials): Promise<void> {
  const response = await fetch(buildApiUrl('/api/auth/login/'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login: usuario, senha }),
  })

  if (response.status === 403) {
    throw new LoginAccessDeniedError(usuario)
  }

  if (!response.ok) {
    const mensagem = await extrairMensagemDeErroDaResposta(response)
    throw new LoginFailedError(mensagem)
  }

  const dados = await response.json()
  const session = parseLoginResponse(dados)

  if (!session) {
    throw new LoginFailedError('Resposta de login inválida.')
  }

  setAuthSession(session)
}
