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

export async function attemptLogin({
  usuario,
  senha,
}: LoginCredentials): Promise<void> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario, senha }),
  })

  if (response.status === 403) {
    throw new LoginAccessDeniedError(usuario)
  }

  if (!response.ok) {
    throw new Error('LOGIN_FAILED')
  }
}
