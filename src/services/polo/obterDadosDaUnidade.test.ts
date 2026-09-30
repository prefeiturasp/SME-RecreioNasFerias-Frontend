import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '../api/http'
import { obterDadosDaUnidade } from './obterDadosDaUnidade'
import type { DadosDaUnidade } from './types'

vi.mock('../api/http', () => ({
  api: { get: vi.fn(), post: vi.fn(), put: vi.fn() },
}))

const apiGetMock = vi.mocked(api.get)

const respostaUnidadeExemplo: DadosDaUnidade = {
  nome: 'AURI VERDE - CHACARA SANTO AMARO',
  codigo_eol: '400571',
  sigla_tipo_escola: 'CR.P.CONV',
  nome_dre: 'DIRETORIA REGIONAL DE EDUCACAO CAPELA DO SOCORRO',
  sigla_dre: 'DRE - CS',
  codigo_dre: '108300',
  email: '',
  telefone: '59742587',
  cep: '04856-300',
  tipo_logradouro: 'Rua',
  logradouro: 'GLORIOSA',
  bairro: 'JARDIM NOVO HORIZONTE',
  numero: '1',
  complemento: '',
  municipio: 'SAO PAULO',
  uf: 'SP',
}

describe('obterDadosDaUnidade', () => {
  beforeEach(() => {
    apiGetMock.mockReset()
  })

  it('busca a unidade pelo código EOL e devolve a resposta da API', async () => {
    apiGetMock.mockResolvedValue({ data: respostaUnidadeExemplo })

    await expect(obterDadosDaUnidade('400571')).resolves.toEqual(
      respostaUnidadeExemplo,
    )

    expect(apiGetMock).toHaveBeenCalledTimes(1)
    expect(apiGetMock).toHaveBeenCalledWith('/api/v1/polos/dados-da-unidade/', {
      params: { codigo_eol: '400571' },
    })
  })

  it('lança erro quando a API retorna falha na consulta', async () => {
    apiGetMock.mockRejectedValue({
      response: {
        status: 404,
        data: { detalhe: 'Unidade não encontrada.' },
      },
    })

    await expect(obterDadosDaUnidade('000000')).rejects.toMatchObject({
      response: {
        data: { detalhe: 'Unidade não encontrada.' },
      },
    })
  })

  it('não inventa mensagem quando o corpo de erro está vazio', async () => {
    apiGetMock.mockRejectedValue({ response: { status: 500, data: {} } })

    await expect(obterDadosDaUnidade('400571')).rejects.toMatchObject({
      response: { data: {} },
    })
  })
})
