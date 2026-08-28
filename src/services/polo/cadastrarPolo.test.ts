import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '../api/http'
import { cadastrarPolo } from './cadastrarPolo'
import type { DadosCadastroPolo, PoloDetalhado } from './types'

vi.mock('../api/http', () => ({
  api: { get: vi.fn(), post: vi.fn(), put: vi.fn() },
}))

const apiPostMock = vi.mocked(api.post)

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

const respostaCadastroExemplo: PoloDetalhado = {
  uuid: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  ...payloadEsperado,
  ativo: true,
  criado_em: '2026-08-27T11:28:47.128Z',
  atualizado_em: '2026-08-27T11:28:47.128Z',
}

describe('cadastrarPolo', () => {
  beforeEach(() => {
    apiPostMock.mockReset()
  })

  it('envia payload esperado e retorna o polo criado', async () => {
    apiPostMock.mockResolvedValue({ data: respostaCadastroExemplo })

    await expect(cadastrarPolo(dadosPoloExemplo)).resolves.toEqual(
      respostaCadastroExemplo,
    )

    expect(apiPostMock).toHaveBeenCalledTimes(1)
    expect(apiPostMock).toHaveBeenCalledWith('/api/v1/polos/', payloadEsperado)
  })

  it('lança erro quando a API retorna falha no cadastro', async () => {
    apiPostMock.mockRejectedValue({
      response: {
        status: 400,
        data: { detalhe: 'Já existe polo parceiro com o nome cadastrado.' },
      },
    })

    await expect(cadastrarPolo(dadosPoloExemplo)).rejects.toMatchObject({
      response: {
        data: { detalhe: 'Já existe polo parceiro com o nome cadastrado.' },
      },
    })
  })

  it('não inventa mensagem quando o corpo de erro está vazio', async () => {
    apiPostMock.mockRejectedValue({ response: { status: 500, data: {} } })

    await expect(cadastrarPolo(dadosPoloExemplo)).rejects.toMatchObject({
      response: { data: {} },
    })
  })
})
