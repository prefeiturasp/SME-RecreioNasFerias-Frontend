import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '../api/http'
import { obterPolo } from './obterPolo'
import type { PoloDetalhado } from './types'

vi.mock('../api/http', () => ({
  api: { get: vi.fn(), post: vi.fn(), put: vi.fn() },
}))

const apiGetMock = vi.mocked(api.get)

const idPolo = '11111111-1111-1111-1111-111111111111'

const respostaObterExemplo: PoloDetalhado = {
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

describe('obterPolo', () => {
  beforeEach(() => {
    apiGetMock.mockReset()
  })

  it('busca polo pelo id e devolve a resposta da API', async () => {
    apiGetMock.mockResolvedValue({ data: respostaObterExemplo })

    await expect(obterPolo(idPolo)).resolves.toEqual(respostaObterExemplo)

    expect(apiGetMock).toHaveBeenCalledTimes(1)
    expect(apiGetMock).toHaveBeenCalledWith(`/api/polos/${idPolo}/`)
  })

  it('lança erro quando a API retorna falha na consulta', async () => {
    apiGetMock.mockRejectedValue({
      response: {
        status: 404,
        data: { detalhe: 'Polo não encontrado.' },
      },
    })

    await expect(obterPolo(idPolo)).rejects.toMatchObject({
      response: {
        data: { detalhe: 'Polo não encontrado.' },
      },
    })
  })

  it('não inventa mensagem quando o corpo de erro está vazio', async () => {
    apiGetMock.mockRejectedValue({ response: { status: 500, data: {} } })

    await expect(obterPolo(idPolo)).rejects.toMatchObject({
      response: { data: {} },
    })
  })
})
