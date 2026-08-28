import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '../api/http'
import { obterPolo } from './obterPolo'
import type { PoloDetalhado } from './types'

vi.mock('../api/http', () => ({
  api: { get: vi.fn(), post: vi.fn(), put: vi.fn() },
}))

const apiGetMock = vi.mocked(api.get)

const uuidPolo = '3fa85f64-5717-4562-b3fc-2c963f66afa6'

const respostaObterExemplo: PoloDetalhado = {
  uuid: uuidPolo,
  codigo_eol: '123456',
  nome_polo: 'Polo Centro',
  nome_osc: 'OSC Parceira Exemplo',
  dre_nome: 'DRE Butantã',
  dre_codigo_eol: '108100',
  tipo: 'pendente',
  status: 'ativo',
  gestao: 'parceira',
  tipo_ue: 'EMEF',
  quantidade_maxima_alunos: 50,
  cep: '05508-000',
  tipo_logradouro: 'Rua',
  logradouro: 'Exemplo',
  bairro: 'Centro',
  numero: '100',
  complemento: '',
  nome_gestor: 'Maria Silva',
  email: 'polo@osc.org.br',
  telefone: '(11) 99999-9999',
  observacoes_gerais: 'Polo com boa estrutura',
  ativo: true,
  criado_em: '2026-08-27T11:28:47.128Z',
  atualizado_em: '2026-08-27T11:28:47.128Z',
}

describe('obterPolo', () => {
  beforeEach(() => {
    apiGetMock.mockReset()
  })

  it('busca polo pelo uuid e devolve a resposta da API', async () => {
    apiGetMock.mockResolvedValue({ data: respostaObterExemplo })

    await expect(obterPolo(uuidPolo)).resolves.toEqual(respostaObterExemplo)

    expect(apiGetMock).toHaveBeenCalledTimes(1)
    expect(apiGetMock).toHaveBeenCalledWith(`/api/v1/polos/${uuidPolo}/`)
  })

  it('lança erro quando a API retorna falha na consulta', async () => {
    apiGetMock.mockRejectedValue({
      response: {
        status: 404,
        data: { detalhe: 'Polo não encontrado.' },
      },
    })

    await expect(obterPolo(uuidPolo)).rejects.toMatchObject({
      response: {
        data: { detalhe: 'Polo não encontrado.' },
      },
    })
  })

  it('não inventa mensagem quando o corpo de erro está vazio', async () => {
    apiGetMock.mockRejectedValue({ response: { status: 500, data: {} } })

    await expect(obterPolo(uuidPolo)).rejects.toMatchObject({
      response: { data: {} },
    })
  })
})
