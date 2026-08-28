import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '../api/http'
import { atualizarPolo } from './atualizarPolo'
import type { DadosCadastroPolo, PoloDetalhado } from './types'

vi.mock('../api/http', () => ({
  api: { get: vi.fn(), post: vi.fn(), put: vi.fn() },
}))

const apiPutMock = vi.mocked(api.put)

const uuidPolo = '3fa85f64-5717-4562-b3fc-2c963f66afa6'

const dadosPoloExemplo: DadosCadastroPolo = {
  codigoEol: '123456',
  nomePolo: 'Polo Centro',
  nomeOsc: 'OSC Parceira Exemplo',
  dreNome: 'DRE Butantã',
  dreCodigoEol: '108100',
  tipo: 'pendente',
  status: 'ativo',
  gestao: 'parceira',
  tipoUe: 'EMEF',
  quantidadeMaximaAlunos: '50',
  cep: '05508-000',
  tipoLogradouro: 'Rua',
  logradouro: 'Exemplo',
  bairro: 'Centro',
  numero: '100',
  complemento: '',
  nomeGestor: 'Maria Silva',
  email: 'polo@osc.org.br',
  telefone: '(11) 99999-9999',
  observacoesGerais: 'Polo com boa estrutura',
}

const payloadEsperado = {
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
} as const

const respostaAtualizacaoExemplo: PoloDetalhado = {
  uuid: uuidPolo,
  ...payloadEsperado,
  ativo: true,
  criado_em: '2026-08-27T11:28:47.128Z',
  atualizado_em: '2026-08-27T11:28:47.128Z',
}

describe('atualizarPolo', () => {
  beforeEach(() => {
    apiPutMock.mockReset()
  })

  it('envia payload esperado e retorna o polo atualizado', async () => {
    apiPutMock.mockResolvedValue({ data: respostaAtualizacaoExemplo })

    await expect(atualizarPolo(uuidPolo, dadosPoloExemplo)).resolves.toEqual(
      respostaAtualizacaoExemplo,
    )

    expect(apiPutMock).toHaveBeenCalledTimes(1)
    expect(apiPutMock).toHaveBeenCalledWith(
      `/api/v1/polos/${uuidPolo}/`,
      payloadEsperado,
    )
  })

  it('lança erro quando a API retorna falha na atualização', async () => {
    apiPutMock.mockRejectedValue({
      response: {
        status: 400,
        data: { detalhe: 'Não foi possível atualizar o polo.' },
      },
    })

    await expect(
      atualizarPolo(uuidPolo, dadosPoloExemplo),
    ).rejects.toMatchObject({
      response: {
        data: { detalhe: 'Não foi possível atualizar o polo.' },
      },
    })
  })

  it('não inventa mensagem quando o corpo de erro está vazio', async () => {
    apiPutMock.mockRejectedValue({ response: { status: 500, data: {} } })

    await expect(
      atualizarPolo(uuidPolo, dadosPoloExemplo),
    ).rejects.toMatchObject({
      response: { data: {} },
    })
  })
})
