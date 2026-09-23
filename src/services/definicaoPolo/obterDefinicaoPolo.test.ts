import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '../api/http'
import { obterDefinicaoPolo } from './obterDefinicaoPolo'
import type { DefinicaoPoloDetalhe } from './types'

vi.mock('../api/http', () => ({
  api: { get: vi.fn(), post: vi.fn(), put: vi.fn() },
}))

const apiGetMock = vi.mocked(api.get)

const idDefinicao = '11c43c20-dfcb-4a26-a677-30703b7de766'

const respostaObterExemplo: DefinicaoPoloDetalhe = {
  uuid: idDefinicao,
  polo: {
    uuid: 'f05bc2c0-4728-4907-a10e-4971d06103fe',
    codigo_eol: '400496',
    nome_polo: '13 DE MAIO',
    nome_osc: '',
    dre_nome: 'DIRETORIA REGIONAL DE EDUCACAO IPIRANGA',
    dre_codigo_eol: '108600',
    tipo: 'pendente',
    status: 'ativo',
    gestao: 'direta',
    tipo_ue: 'CEI DIRET',
    quantidade_maxima_alunos: 100,
    cep: '04201000',
    tipo_logradouro: 'Rua',
    logradouro: 'Treze de Maio',
    bairro: 'Ipiranga',
    numero: '100',
    complemento: '',
    nome_gestor: 'Diretor Exemplo',
    email: 'polo@exemplo.com',
    telefone: '1133334444',
    observacoes_gerais: '',
    ativo: true,
    endereco_completo: 'Rua Treze de Maio, 100 - Ipiranga',
  },
  edicao: {
    uuid: '2da0f4f1-ef50-4346-b482-c06a237a7a8b',
    nome: 'edição de fevereiro 2',
  },
  tipo: 'reserva',
  projecao_inscritos: 0,
  total_inscritos: 0,
  ponto_focal_nome: '',
  ponto_focal_telefone: '',
  ponto_focal_email: '',
  ativo: true,
  resultado_final_de_inscritos: 0,
}

describe('obterDefinicaoPolo', () => {
  beforeEach(() => {
    apiGetMock.mockReset()
  })

  it('busca a definição pelo uuid e devolve a resposta da API', async () => {
    apiGetMock.mockResolvedValue({ data: respostaObterExemplo })

    await expect(obterDefinicaoPolo(idDefinicao)).resolves.toEqual(
      respostaObterExemplo,
    )

    expect(apiGetMock).toHaveBeenCalledTimes(1)
    expect(apiGetMock).toHaveBeenCalledWith(
      `/api/v1/definicoes-polos/${idDefinicao}/`,
    )
  })

  it('lança erro quando a API retorna falha na consulta', async () => {
    apiGetMock.mockRejectedValue({
      response: {
        status: 404,
        data: { detalhe: 'Definição do polo não encontrada.' },
      },
    })

    await expect(obterDefinicaoPolo(idDefinicao)).rejects.toMatchObject({
      response: {
        data: { detalhe: 'Definição do polo não encontrada.' },
      },
    })
  })

  it('não inventa mensagem quando o corpo de erro está vazio', async () => {
    apiGetMock.mockRejectedValue({ response: { status: 500, data: {} } })

    await expect(obterDefinicaoPolo(idDefinicao)).rejects.toMatchObject({
      response: { data: {} },
    })
  })
})
