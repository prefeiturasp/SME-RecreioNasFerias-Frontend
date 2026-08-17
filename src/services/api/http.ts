import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios'
import {
  obterApiBaseUrl,
  obterSmeIntegracaoApiBaseUrl,
  obterSmeIntegracaoApiKey,
} from '../../config/variaveisAmbiente'
import { marcarSessaoVerificada } from '../autenticacao/cacheVerificacaoSessao'
import { atualizarTokenAutenticacaoViaRefresh } from '../autenticacao/refreshToken'
import {
  notificarSessaoInvalida,
  respostaIndicaSessaoInvalida,
} from '../autenticacao/sessaoInvalida'
import { obterTokenAutenticacao } from '../autenticacao/storage'

type ConfiguracaoRequisicaoComRetry = InternalAxiosRequestConfig & {
  _renovacaoTentada?: boolean
}

let promessaRenovacaoToken: Promise<string | null> | null = null

function renovarTokenAutenticacao(): Promise<string | null> {
  promessaRenovacaoToken ??= atualizarTokenAutenticacaoViaRefresh().finally(
    () => {
      promessaRenovacaoToken = null
    },
  )

  return promessaRenovacaoToken
}

export const api: AxiosInstance = axios.create({
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const baseUrl = obterApiBaseUrl()
  if (baseUrl) {
    config.baseURL = baseUrl
  }

  const token = obterTokenAutenticacao()
  if (token !== null) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }

  return config
})

api.interceptors.response.use(
  (response) => {
    marcarSessaoVerificada()
    return response
  },
  async (error: unknown) => {
    const axiosError = error as AxiosError
    const config = axiosError.config as
      | ConfiguracaoRequisicaoComRetry
      | undefined
    const status = axiosError.response?.status

    if (!config || status === undefined) {
      throw error
    }

    if (!respostaIndicaSessaoInvalida(status, axiosError.response?.data)) {
      throw error
    }

    if (config._renovacaoTentada) {
      notificarSessaoInvalida()
      throw error
    }

    config._renovacaoTentada = true

    const tokenRenovado = await renovarTokenAutenticacao()
    if (tokenRenovado === null) {
      notificarSessaoInvalida()
      throw error
    }

    return api(config)
  },
)

export const apiSmeIntegracao: AxiosInstance = axios.create()

apiSmeIntegracao.interceptors.request.use((config) => {
  const baseUrl = obterSmeIntegracaoApiBaseUrl()
  if (baseUrl) {
    config.baseURL = baseUrl
  } else {
    config.baseURL = '/sme-integracao-api'
  }

  const chaveApi = obterSmeIntegracaoApiKey()
  if (chaveApi) {
    config.headers.set('x-api-eol-key', chaveApi)
  }

  return config
})
