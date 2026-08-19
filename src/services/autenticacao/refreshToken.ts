import axios from 'axios'
import { construirUrlApi } from '../api/construirUrlApi'
import { definirTokenAutenticacao } from './storage'

const ROTA_RENOVACAO_TOKEN = '/api/v1/auth/token/refresh/'

export async function atualizarTokenAutenticacaoViaRefresh(): Promise<
  string | null
> {
  try {
    const { data } = await axios.post(
      construirUrlApi(ROTA_RENOVACAO_TOKEN),
      null,
      { withCredentials: true },
    )

    const dados = data as unknown
    if (!dados || typeof dados !== 'object') {
      return null
    }

    const token = (dados as { token?: unknown }).token
    if (typeof token !== 'string' || !token.trim()) {
      return null
    }

    definirTokenAutenticacao(token.trim())
    return token.trim()
  } catch {
    return null
  }
}
