import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '../api/http'
import { atualizarPolo } from './atualizarPolo'
import type { PoloDetalhado } from './types'

vi.mock('../api/http', () => ({
  api: { get: vi.fn(), post: vi.fn(), put: vi.fn() },
}))

const apiPutMock = vi.mocked(api.put)

const idPolo = '22222222-2222-2222-2222-222222222222'

const dadosPoloExemplo = {
  tipo: 'Pendente',
  nomeOsc: 'OSC Parceira Exemplo',
  nomePolo: 'Polo Centro',
  dre: 'DRE Butantã',
  tipoUe: 'EMEF',
  quantidadeMaximaAlunos: '50',
  cep: '05508-000',
  endereco: 'Rua Exemplo, 100',
  nomeGestor: 'Maria Silva',
  emailPolo: 'polo@osc.org.br',
  telefonePolo: '(11) 99999-9999',
  status: 'ativo',
  observacoes: 'Polo com boa estrutura',
} as const

const respostaAtualizacaoExemplo: PoloDetalhado = {
  id: idPolo,
  tipo: 'Pendente',
  nomeOsc: 'OSC Parceira Exemplo',
  nomePolo: 'Polo Centro',
  dre: 'DRE Butantã',
  tipoUe: 'EMEF',
  quantidadeMaximaAlunos: 50,
  cep: '05508-000',
  endereco: 'Rua Exemplo, 100',
  nomeGestor: 'Maria Silva',
  emailPolo: 'polo@osc.org.br',
  telefonePolo: '(11) 99999-9999',
  status: 'ativo',
  observacoesGerais: 'Polo com boa estrutura',
}

describe('atualizarPolo', () => {
  beforeEach(() => {
    apiPutMock.mockReset()
  })

  it('envia payload esperado e retorna o polo atualizado', async () => {
    apiPutMock.mockResolvedValue({ data: respostaAtualizacaoExemplo })

    await expect(atualizarPolo(idPolo, dadosPoloExemplo)).resolves.toEqual(
      respostaAtualizacaoExemplo,
    )

    expect(apiPutMock).toHaveBeenCalledTimes(1)
    expect(apiPutMock).toHaveBeenCalledWith(`/api/polos/${idPolo}/`, {
      nomeOsc: 'OSC Parceira Exemplo',
      nomePolo: 'Polo Centro',
      dre: 'DRE Butantã',
      tipoUe: 'EMEF',
      quantidadeMaximaAlunos: 50,
      cep: '05508-000',
      endereco: 'Rua Exemplo, 100',
      nomeGestor: 'Maria Silva',
      emailPolo: 'polo@osc.org.br',
      telefonePolo: '(11) 99999-9999',
      status: 'ativo',
      observacoesGerais: 'Polo com boa estrutura',
    })
  })

  it('lança erro quando a API retorna falha na atualização', async () => {
    apiPutMock.mockRejectedValue({
      response: {
        status: 400,
        data: { detalhe: 'Não foi possível atualizar o polo.' },
      },
    })

    await expect(
      atualizarPolo(idPolo, dadosPoloExemplo),
    ).rejects.toMatchObject({
      response: {
        data: { detalhe: 'Não foi possível atualizar o polo.' },
      },
    })
  })

  it('não inventa mensagem quando o corpo de erro está vazio', async () => {
    apiPutMock.mockRejectedValue({ response: { status: 500, data: {} } })

    await expect(
      atualizarPolo(idPolo, dadosPoloExemplo),
    ).rejects.toMatchObject({
      response: { data: {} },
    })
  })
})
