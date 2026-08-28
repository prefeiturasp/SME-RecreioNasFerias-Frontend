import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '../api/http'
import { listarPolos } from './listarPolos'
import type { PoloDetalhado } from './types'

vi.mock('../api/http', () => ({
  api: { get: vi.fn() },
}))

const apiGetMock = vi.mocked(api.get)

const polos: PoloDetalhado[] = [
  {
    uuid: '11111111-1111-1111-1111-111111111111',
    codigo_eol: '123456',
    nome_polo: 'Polo Centro',
    nome_osc: 'OSC Parceira',
    dre_nome: 'DRE Butantã',
    dre_codigo_eol: '108100',
    tipo: 'pendente',
    status: 'ativo',
    gestao: 'parceira',
    tipo_ue: 'EMEF',
    quantidade_maxima_alunos: 50,
    cep: '01310100',
    tipo_logradouro: 'Rua',
    logradouro: 'Exemplo',
    bairro: 'Centro',
    numero: '100',
    complemento: '',
    nome_gestor: 'Maria Silva',
    email: 'polo@osc.org.br',
    telefone: '11999999999',
    observacoes_gerais: '',
    ativo: true,
    criado_em: '2026-08-27T11:28:47.128Z',
    atualizado_em: '2026-08-27T11:28:47.128Z',
  },
]

describe('listarPolos', () => {
  beforeEach(() => {
    apiGetMock.mockReset()
  })

  it('lista polos sem filtros e retorna os dados da API', async () => {
    apiGetMock.mockResolvedValue({ data: polos })

    await expect(listarPolos()).resolves.toEqual(polos)

    expect(apiGetMock).toHaveBeenCalledTimes(1)
    expect(apiGetMock).toHaveBeenCalledWith('/api/v1/polos/', {
      params: { busca: undefined, dre_codigo_eol: undefined, tipo_ue: undefined },
    })
  })

  it('envia os filtros informados para a API', async () => {
    apiGetMock.mockResolvedValue({ data: polos })

    await listarPolos('Polo Centro', '108100', 'EMEF')

    expect(apiGetMock).toHaveBeenCalledWith('/api/v1/polos/', {
      params: {
        busca: 'Polo Centro',
        dre_codigo_eol: '108100',
        tipo_ue: 'EMEF',
      },
    })
  })

  it('propaga o erro retornado pela API', async () => {
    const erro = {
      response: { status: 500, data: { detalhe: 'Erro interno.' } },
    }
    apiGetMock.mockRejectedValue(erro)

    await expect(listarPolos()).rejects.toBe(erro)
  })
})
