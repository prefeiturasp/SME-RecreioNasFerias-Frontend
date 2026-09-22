import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '../api/http'
import { atualizarDefinicaoPolo } from './atualizarDefinicaoPolo'
import type {
  DadosAtualizacaoDefinicaoPolo,
  DefinicaoPoloDetalhe,
} from './types'

vi.mock('../api/http', () => ({
  api: { get: vi.fn(), post: vi.fn(), put: vi.fn() },
}))

const apiPutMock = vi.mocked(api.put)

const idDefinicao = '11c43c20-dfcb-4a26-a677-30703b7de766'

const dadosAtualizacaoExemplo: DadosAtualizacaoDefinicaoPolo = {
  polo: 'f05bc2c0-4728-4907-a10e-4971d06103fe',
  edicao: '2da0f4f1-ef50-4346-b482-c06a237a7a8b',
  tipo: 'pendente',
  projecao_inscritos: 10,
  ponto_focal_nome: 'teste',
  ponto_focal_telefone: '71992626598',
  ponto_focal_email: 'teste@email.com',
}

const respostaAtualizacaoExemplo: DefinicaoPoloDetalhe = {
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
  tipo: 'pendente',
  projecao_inscritos: 10,
  total_inscritos: 13,
  ponto_focal_nome: 'teste',
  ponto_focal_telefone: '71992626598',
  ponto_focal_email: 'teste@email.com',
  ativo: true,
  resultado_final_de_inscritos: 0,
}

describe('atualizarDefinicaoPolo', () => {
  beforeEach(() => {
    apiPutMock.mockReset()
  })

  it('envia o payload esperado e retorna a definição atualizada', async () => {
    apiPutMock.mockResolvedValue({ data: respostaAtualizacaoExemplo })

    await expect(
      atualizarDefinicaoPolo(idDefinicao, dadosAtualizacaoExemplo),
    ).resolves.toEqual(respostaAtualizacaoExemplo)

    expect(apiPutMock).toHaveBeenCalledTimes(1)
    expect(apiPutMock).toHaveBeenCalledWith(
      `/api/v1/definicoes-polos/${idDefinicao}/`,
      {
        polo: 'f05bc2c0-4728-4907-a10e-4971d06103fe',
        edicao: '2da0f4f1-ef50-4346-b482-c06a237a7a8b',
        tipo: 'pendente',
        projecao_inscritos: 10,
        ponto_focal_nome: 'teste',
        ponto_focal_telefone: '71992626598',
        ponto_focal_email: 'teste@email.com',
      },
    )
  })

  it('lança erro quando a API retorna falha na atualização', async () => {
    apiPutMock.mockRejectedValue({
      response: {
        status: 400,
        data: { detalhe: 'Não foi possível atualizar a definição do polo.' },
      },
    })

    await expect(
      atualizarDefinicaoPolo(idDefinicao, dadosAtualizacaoExemplo),
    ).rejects.toMatchObject({
      response: {
        data: { detalhe: 'Não foi possível atualizar a definição do polo.' },
      },
    })
  })

  it('não inventa mensagem quando o corpo de erro está vazio', async () => {
    apiPutMock.mockRejectedValue({ response: { status: 500, data: {} } })

    await expect(
      atualizarDefinicaoPolo(idDefinicao, dadosAtualizacaoExemplo),
    ).rejects.toMatchObject({
      response: { data: {} },
    })
  })
})
