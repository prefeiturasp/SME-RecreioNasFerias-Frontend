import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { apiSmeIntegracao } from '../api/http'
import {
  ErroListagemDresNomeAbreviacao,
  ErroListagemTiposEscolas,
  listarDresNomeAbreviacao,
  listarTiposEscolas,
} from './api'

vi.mock('../api/http', () => ({
  apiSmeIntegracao: { get: vi.fn() },
}))

const apiSmeIntegracaoGetMock = vi.mocked(apiSmeIntegracao.get)

describe('listarDresNomeAbreviacao', () => {
  const originalApiKey = import.meta.env.VITE_SME_INTEGRACAO_API_KEY

  beforeEach(() => {
    delete globalThis.__ENV__
    import.meta.env.VITE_SME_INTEGRACAO_API_KEY =
      '7eee2750-89f4-4928-bb4e-52bad9a85efd'
    apiSmeIntegracaoGetMock.mockReset()
  })

  it('envia requisição com chave x-api-eol-key e ordena por nome', async () => {
    apiSmeIntegracaoGetMock.mockResolvedValue({
      data: [
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

    expect(apiSmeIntegracaoGetMock).toHaveBeenCalledWith(
      '/api/abrangencia/nome-abreviacao-dres',
    )
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
    apiSmeIntegracaoGetMock.mockRejectedValue({
      response: { status: 401, data: null },
    })

    await expect(listarDresNomeAbreviacao()).rejects.toMatchObject({
      mensagemUsuario: 'Não foi possível carregar as DREs.',
    })
  })

  it('lança erro quando a resposta é inválida', async () => {
    apiSmeIntegracaoGetMock.mockResolvedValue({
      data: [{ codigo: '108100' }],
    })

    await expect(listarDresNomeAbreviacao()).rejects.toMatchObject({
      mensagemUsuario: 'Resposta de DREs inválida.',
    })
  })

  afterEach(() => {
    delete globalThis.__ENV__
    import.meta.env.VITE_SME_INTEGRACAO_API_KEY = originalApiKey
  })
})

describe('listarTiposEscolas', () => {
  const originalApiKey = import.meta.env.VITE_SME_INTEGRACAO_API_KEY

  beforeEach(() => {
    import.meta.env.VITE_SME_INTEGRACAO_API_KEY =
      '7eee2750-89f4-4928-bb4e-52bad9a85efd'
    apiSmeIntegracaoGetMock.mockReset()
  })

  it('envia requisição com chave x-api-eol-key e ordena por descricaoSigla', async () => {
    apiSmeIntegracaoGetMock.mockResolvedValue({
      data: [
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

    expect(apiSmeIntegracaoGetMock).toHaveBeenCalledWith(
      '/api/escolas/tiposEscolas',
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
    apiSmeIntegracaoGetMock.mockRejectedValue({
      response: { status: 401, data: null },
    })

    await expect(listarTiposEscolas()).rejects.toMatchObject({
      mensagemUsuario: 'Não foi possível carregar os tipos de UE.',
    })
  })

  it('lança erro quando a resposta é inválida', async () => {
    apiSmeIntegracaoGetMock.mockResolvedValue({
      data: [{ codigo: 1 }],
    })

    await expect(listarTiposEscolas()).rejects.toMatchObject({
      mensagemUsuario: 'Resposta de tipos de UE inválida.',
    })
  })

  afterEach(() => {
    import.meta.env.VITE_SME_INTEGRACAO_API_KEY = originalApiKey
  })
})
