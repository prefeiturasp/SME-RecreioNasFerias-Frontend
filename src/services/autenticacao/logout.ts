import axios from 'axios'
import { construirUrlApi } from '../api/construirUrlApi'
import { limparSessaoAutenticacao } from './storage'

const ROTA_LOGOUT = '/api/v1/auth/logout/'

export async function encerrarSessaoAutenticacao(): Promise<void> {
  try {
    await axios.post(construirUrlApi(ROTA_LOGOUT), null, {
      withCredentials: true,
    })
  } catch {
    // o logout local continua mesmo quando o backend está indisponível
  } finally {
    limparSessaoAutenticacao()
  }
}
