import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  ErroListagemDresNomeAbreviacao,
  ErroListagemTiposEscolas,
  listarDresNomeAbreviacao,
  listarTiposEscolas,
} from './api'

describe('listarDresNomeAbreviacao', () => {
  const originalApiKey = import.meta.env.VITE_SME_INTEGRACAO_API_KEY

  beforeEach(() => {
    delete window.__ENV__
    import.meta.env.VITE_SME_INTEGRACAO_API_KEY =
      '7eee2750-89f4-4928-bb4e-52bad9a85efd'
  })

  it('envia requisição com chave x-api-eol-key e ordena por nome', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => [
        {
          codigo: '108600',
          nome: 'DIRETORIA REGIONAL DE EDUCACAO IPIRANGA',
          abreviacao: 'DRE - IP',
        },
        {
          codigo: '108100',
          nome: 'DIRETORIA REGIONAL DE EDUCACAO BUTANTA',
          abreviacao: 'DRE - BT',
        },
      ],
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(listarDresNomeAbreviacao()).resolves.toEqual([
      {
        codigo: '108100',
        nome: 'DIRETORIA REGIONAL DE EDUCACAO BUTANTA',
        abreviacao: 'DRE - BT',
      },
      {
        codigo: '108600',
        nome: 'DIRETORIA REGIONAL DE EDUCACAO IPIRANGA',
        abreviacao: 'DRE - IP',
      },
    ])

    const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit]
    const headers = options.headers as Record<string, string>

    expect(url).toBe('/sme-integracao-api/api/abrangencia/nome-abreviacao-dres')
    expect(options.method).toBe('GET')
    expect(headers['x-api-eol-key']).toBe(
      '7eee2750-89f4-4928-bb4e-52bad9a85efd',
    )
  })

  it('prioriza chave da API configurada em runtime', async () => {
    import.meta.env.VITE_SME_INTEGRACAO_API_KEY = 'chave-build'
    window.__ENV__ = {
      VITE_SME_INTEGRACAO_API_KEY: 'chave-runtime',
    }

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => [],
    })
    vi.stubGlobal('fetch', fetchMock)

    await listarDresNomeAbreviacao()

    const [, options] = fetchMock.mock.calls[0] as [string, RequestInit]
    const headers = options.headers as Record<string, string>

    expect(headers['x-api-eol-key']).toBe('chave-runtime')
  })

  it('lança erro quando a chave da API não está configurada', async () => {
    import.meta.env.VITE_SME_INTEGRACAO_API_KEY = ''

    await expect(listarDresNomeAbreviacao()).rejects.toBeInstanceOf(
      ErroListagemDresNomeAbreviacao,
    )
    await expect(listarDresNomeAbreviacao()).rejects.toMatchObject({
      mensagemUsuario: 'Chave da API de integração não configurada.',
    })
  })

  it('lança erro quando a API retorna falha', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(listarDresNomeAbreviacao()).rejects.toMatchObject({
      mensagemUsuario: 'Não foi possível carregar as DREs.',
    })
  })

  it('lança erro quando a resposta é inválida', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => [{ codigo: '108100' }],
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(listarDresNomeAbreviacao()).rejects.toMatchObject({
      mensagemUsuario: 'Resposta de DREs inválida.',
    })
  })

  afterEach(() => {
    delete window.__ENV__
    import.meta.env.VITE_SME_INTEGRACAO_API_KEY = originalApiKey
  })
})

describe('listarTiposEscolas', () => {
  const originalApiKey = import.meta.env.VITE_SME_INTEGRACAO_API_KEY

  beforeEach(() => {
    import.meta.env.VITE_SME_INTEGRACAO_API_KEY =
      '7eee2750-89f4-4928-bb4e-52bad9a85efd'
  })

  it('envia requisição com chave x-api-eol-key e ordena por descricaoSigla', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => [
        {
          codigo: 17,
          descricaoSigla: 'CEU EMEI',
          dtAtualizacao: '2012-01-13T14:09:02.507',
        },
        {
          codigo: 1,
          descricaoSigla: 'EMEF',
          dtAtualizacao: '2012-01-13T14:09:23.647',
        },
      ],
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(listarTiposEscolas()).resolves.toEqual([
      {
        codigo: 17,
        descricaoSigla: 'CEU EMEI',
        dtAtualizacao: '2012-01-13T14:09:02.507',
      },
      {
        codigo: 1,
        descricaoSigla: 'EMEF',
        dtAtualizacao: '2012-01-13T14:09:23.647',
      },
    ])

    const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit]
    const headers = options.headers as Record<string, string>

    expect(url).toBe('/sme-integracao-api/api/escolas/tiposEscolas')
    expect(options.method).toBe('GET')
    expect(headers['x-api-eol-key']).toBe(
      '7eee2750-89f4-4928-bb4e-52bad9a85efd',
    )
  })

  it('lança erro quando a chave da API não está configurada', async () => {
    import.meta.env.VITE_SME_INTEGRACAO_API_KEY = ''

    await expect(listarTiposEscolas()).rejects.toBeInstanceOf(
      ErroListagemTiposEscolas,
    )
    await expect(listarTiposEscolas()).rejects.toMatchObject({
      mensagemUsuario: 'Chave da API de integração não configurada.',
    })
  })

  it('lança erro quando a API retorna falha', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(listarTiposEscolas()).rejects.toMatchObject({
      mensagemUsuario: 'Não foi possível carregar os tipos de UE.',
    })
  })

  it('lança erro quando a resposta é inválida', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => [{ codigo: 1 }],
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(listarTiposEscolas()).rejects.toMatchObject({
      mensagemUsuario: 'Resposta de tipos de UE inválida.',
    })
  })

  afterEach(() => {
    import.meta.env.VITE_SME_INTEGRACAO_API_KEY = originalApiKey
  })
})
