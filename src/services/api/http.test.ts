import type { AxiosAdapter, InternalAxiosRequestConfig } from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { atualizarTokenAutenticacaoViaRefreshMock } = vi.hoisted(() => ({
  atualizarTokenAutenticacaoViaRefreshMock: vi.fn(),
}))

vi.mock('../autenticacao/refreshToken', () => ({
  atualizarTokenAutenticacaoViaRefresh:
    atualizarTokenAutenticacaoViaRefreshMock,
}))

type Modulos = {
  api: typeof import('./http').api
  apiSmeIntegracao: typeof import('./http').apiSmeIntegracao
  definirSessaoAutenticacao: typeof import('../autenticacao/storage').definirSessaoAutenticacao
  definirTokenAutenticacao: typeof import('../autenticacao/storage').definirTokenAutenticacao
  estaAutenticado: typeof import('../autenticacao/storage').estaAutenticado
  limparSessaoAutenticacao: typeof import('../autenticacao/storage').limparSessaoAutenticacao
  invalidarCacheVerificacaoSessao: typeof import('../autenticacao/cacheVerificacaoSessao').invalidarCacheVerificacaoSessao
  sessaoVerificadaRecentemente: typeof import('../autenticacao/cacheVerificacaoSessao').sessaoVerificadaRecentemente
  registrarOuvinteSessaoInvalida: typeof import('../autenticacao/sessaoInvalida').registrarOuvinteSessaoInvalida
}

async function carregarModulos(): Promise<Modulos> {
  vi.resetModules()

  const http = await import('./http')
  const storage = await import('../autenticacao/storage')
  const cache = await import('../autenticacao/cacheVerificacaoSessao')
  const sessaoInvalida = await import('../autenticacao/sessaoInvalida')

  return {
    api: http.api,
    apiSmeIntegracao: http.apiSmeIntegracao,
    definirSessaoAutenticacao: storage.definirSessaoAutenticacao,
    definirTokenAutenticacao: storage.definirTokenAutenticacao,
    estaAutenticado: storage.estaAutenticado,
    limparSessaoAutenticacao: storage.limparSessaoAutenticacao,
    invalidarCacheVerificacaoSessao: cache.invalidarCacheVerificacaoSessao,
    sessaoVerificadaRecentemente: cache.sessaoVerificadaRecentemente,
    registrarOuvinteSessaoInvalida:
      sessaoInvalida.registrarOuvinteSessaoInvalida,
  }
}

function criarErroDeApi(
  config: InternalAxiosRequestConfig,
  status: number,
  data?: unknown,
) {
  const error = new Error(`Request failed with status code ${status}`)
  return Object.assign(error, {
    config,
    isAxiosError: true,
    response: { data, status, statusText: '', headers: {}, config },
  })
}

function respostaDeSucesso(config: InternalAxiosRequestConfig, data = {}) {
  return { data, status: 200, statusText: 'OK', headers: {}, config }
}

function usarAdaptador(
  api: { defaults: { adapter?: unknown } },
  adaptador: (config: InternalAxiosRequestConfig) => unknown,
) {
  ;(api.defaults as { adapter: AxiosAdapter }).adapter = (async (
    config: InternalAxiosRequestConfig,
  ) => adaptador(config)) as unknown as AxiosAdapter
}

describe('api (client HTTP principal)', () => {
  beforeEach(() => {
    atualizarTokenAutenticacaoViaRefreshMock.mockReset()
  })

  it('injeta Authorization e aplica baseURL do ambiente', async () => {
    const modulos = await carregarModulos()
    import.meta.env.VITE_API_BASE_URL = 'http://localhost:8000'
    modulos.definirSessaoAutenticacao({
      token: 'eyJ-token',
      rf: '1234567',
      nome: 'Usuário Teste',
      descricaoCargo: 'Cargo Teste',
    })

    const configs: InternalAxiosRequestConfig[] = []
    usarAdaptador(modulos.api, (config) => {
      configs.push(config)
      return respostaDeSucesso(config)
    })

    await modulos.api.get('/api/edicoes/')

    expect(configs[0]?.baseURL).toBe('http://localhost:8000')
    expect(configs[0]?.headers.get('Authorization')).toBe('Bearer eyJ-token')
  })

  it('não injeta Authorization quando não há token em memória', async () => {
    const modulos = await carregarModulos()

    const configs: InternalAxiosRequestConfig[] = []
    usarAdaptador(modulos.api, (config) => {
      configs.push(config)
      return respostaDeSucesso(config)
    })

    await modulos.api.get('/api/edicoes/')

    expect(configs[0]?.headers.get('Authorization')).toBeUndefined()
  })

  it('marca a sessão como verificada em respostas de sucesso', async () => {
    const modulos = await carregarModulos()
    modulos.definirTokenAutenticacao('eyJ-token')
    modulos.invalidarCacheVerificacaoSessao()

    usarAdaptador(modulos.api, (config) => respostaDeSucesso(config))

    await modulos.api.get('/api/edicoes/')

    expect(modulos.sessaoVerificadaRecentemente()).toBe(true)
  })

  it('renova o token e repete a requisição uma vez após 401', async () => {
    const modulos = await carregarModulos()
    modulos.definirSessaoAutenticacao({
      token: 'eyJ-token-expirado',
      rf: '1234567',
      nome: 'Usuário Teste',
      descricaoCargo: 'Cargo Teste',
    })
    atualizarTokenAutenticacaoViaRefreshMock.mockImplementation(async () => {
      modulos.definirTokenAutenticacao('eyJ-token-novo')
      return 'eyJ-token-novo'
    })

    const contagens = new Map<string, number>()
    const configs: InternalAxiosRequestConfig[] = []
    usarAdaptador(modulos.api, (config) => {
      const url = config.url ?? ''
      contagens.set(url, (contagens.get(url) ?? 0) + 1)
      configs.push(config)

      if (contagens.get(url) === 1) {
        throw criarErroDeApi(config, 401, {
          detalhe: 'Token inválido ou expirado.',
        })
      }

      return respostaDeSucesso(config, { id: 1 })
    })

    const response = await modulos.api.get('/api/edicoes/')

    expect(response.data).toEqual({ id: 1 })
    expect(contagens.get('/api/edicoes/')).toBe(2)
    expect(atualizarTokenAutenticacaoViaRefreshMock).toHaveBeenCalledTimes(1)
    expect(configs[1]?.headers.get('Authorization')).toBe(
      'Bearer eyJ-token-novo',
    )
    expect(
      (
        configs[1] as InternalAxiosRequestConfig & {
          _renovacaoTentada?: boolean
        }
      )._renovacaoTentada,
    ).toBe(true)
    expect(modulos.estaAutenticado()).toBe(true)
  })

  it('notifica sessão inválida quando o refresh falha', async () => {
    const modulos = await carregarModulos()
    modulos.definirSessaoAutenticacao({
      token: 'eyJ-token-expirado',
      rf: '1234567',
      nome: 'Usuário Teste',
      descricaoCargo: 'Cargo Teste',
    })
    atualizarTokenAutenticacaoViaRefreshMock.mockResolvedValue(null)

    const ouvinte = vi.fn()
    modulos.registrarOuvinteSessaoInvalida(ouvinte)

    usarAdaptador(modulos.api, (config) => {
      throw criarErroDeApi(config, 401, {
        detalhe: 'Token inválido ou expirado.',
      })
    })

    await expect(modulos.api.get('/api/edicoes/')).rejects.toMatchObject({
      response: { status: 401 },
    })

    expect(modulos.estaAutenticado()).toBe(false)
    expect(ouvinte).toHaveBeenCalledTimes(1)
  })

  it('notifica sessão inválida sem repetir indefinidamente quando o retry também falha', async () => {
    const modulos = await carregarModulos()
    modulos.definirSessaoAutenticacao({
      token: 'eyJ-token-expirado',
      rf: '1234567',
      nome: 'Usuário Teste',
      descricaoCargo: 'Cargo Teste',
    })
    atualizarTokenAutenticacaoViaRefreshMock.mockImplementation(async () => {
      modulos.definirTokenAutenticacao('eyJ-token-novo')
      return 'eyJ-token-novo'
    })

    const ouvinte = vi.fn()
    modulos.registrarOuvinteSessaoInvalida(ouvinte)

    const contagens = new Map<string, number>()
    usarAdaptador(modulos.api, (config) => {
      const url = config.url ?? ''
      contagens.set(url, (contagens.get(url) ?? 0) + 1)
      throw criarErroDeApi(config, 401)
    })

    await expect(modulos.api.get('/api/edicoes/')).rejects.toMatchObject({
      response: { status: 401 },
    })

    expect(contagens.get('/api/edicoes/')).toBe(2)
    expect(atualizarTokenAutenticacaoViaRefreshMock).toHaveBeenCalledTimes(1)
    expect(ouvinte).toHaveBeenCalledTimes(1)
    expect(modulos.estaAutenticado()).toBe(false)
  })

  it('trata 403 com mensagem de token expirado como sessão inválida', async () => {
    const modulos = await carregarModulos()
    modulos.definirSessaoAutenticacao({
      token: 'eyJ-token-expirado',
      rf: '1234567',
      nome: 'Usuário Teste',
      descricaoCargo: 'Cargo Teste',
    })
    atualizarTokenAutenticacaoViaRefreshMock.mockResolvedValue(null)

    usarAdaptador(modulos.api, (config) => {
      throw criarErroDeApi(config, 403, {
        detalhe: 'Token inválido ou expirado.',
      })
    })

    await expect(modulos.api.get('/api/edicoes/')).rejects.toMatchObject({
      response: { status: 403 },
    })

    expect(atualizarTokenAutenticacaoViaRefreshMock).toHaveBeenCalledTimes(1)
    expect(modulos.estaAutenticado()).toBe(false)
  })

  it('propaga erro de 403 que não indica token expirado sem renovar', async () => {
    const modulos = await carregarModulos()
    modulos.definirTokenAutenticacao('eyJ-token')

    usarAdaptador(modulos.api, (config) => {
      throw criarErroDeApi(config, 403, { detalhe: 'Acesso negado.' })
    })

    await expect(modulos.api.get('/api/edicoes/')).rejects.toMatchObject({
      response: { status: 403 },
    })

    expect(atualizarTokenAutenticacaoViaRefreshMock).not.toHaveBeenCalled()
    expect(modulos.estaAutenticado()).toBe(true)
  })

  it('compartilha um único refresh entre requisições concorrentes', async () => {
    const modulos = await carregarModulos()
    modulos.definirTokenAutenticacao('eyJ-token-expirado')
    atualizarTokenAutenticacaoViaRefreshMock.mockImplementation(async () => {
      modulos.definirTokenAutenticacao('eyJ-token-novo')
      return 'eyJ-token-novo'
    })

    usarAdaptador(modulos.api, (config) => {
      throw criarErroDeApi(config, 401)
    })

    await Promise.allSettled([
      modulos.api.get('/api/edicoes/'),
      modulos.api.get('/api/polos/'),
    ])

    expect(atualizarTokenAutenticacaoViaRefreshMock).toHaveBeenCalledTimes(1)
  })

  it('propaga erro de rede sem tentar renovar token', async () => {
    const modulos = await carregarModulos()
    modulos.definirTokenAutenticacao('eyJ-token')

    usarAdaptador(modulos.api, () => {
      throw new Error('network error')
    })

    await expect(modulos.api.get('/api/edicoes/')).rejects.toThrow(
      'network error',
    )

    expect(atualizarTokenAutenticacaoViaRefreshMock).not.toHaveBeenCalled()
  })
})

describe('apiSmeIntegracao', () => {
  beforeEach(() => {
    atualizarTokenAutenticacaoViaRefreshMock.mockReset()
  })

  it('usa o prefixo do proxy e envia a chave x-api-eol-key', async () => {
    const modulos = await carregarModulos()
    import.meta.env.VITE_SME_INTEGRACAO_API_KEY = 'chave-teste'

    const configs: InternalAxiosRequestConfig[] = []
    usarAdaptador(modulos.apiSmeIntegracao, (config) => {
      configs.push(config)
      return respostaDeSucesso(config)
    })

    await modulos.apiSmeIntegracao.get('/api/abrangencia/nome-abreviacao-dres')

    expect(configs[0]?.baseURL).toBe('/sme-integracao-api')
    expect(configs[0]?.headers.get('x-api-eol-key')).toBe('chave-teste')
  })

  it('usa a base URL do ambiente quando configurada', async () => {
    const modulos = await carregarModulos()
    import.meta.env.VITE_SME_INTEGRACAO_API_BASE_URL =
      'https://hom-smeintegracaoapi.sme.prefeitura.sp.gov.br'

    const configs: InternalAxiosRequestConfig[] = []
    usarAdaptador(modulos.apiSmeIntegracao, (config) => {
      configs.push(config)
      return respostaDeSucesso(config)
    })

    await modulos.apiSmeIntegracao.get('/api/escolas/tiposEscolas')

    expect(configs[0]?.baseURL).toBe(
      'https://hom-smeintegracaoapi.sme.prefeitura.sp.gov.br',
    )
  })
})
