import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '../api/http'
import { cadastrarPolo } from './cadastrarPolo'
import type { PoloDetalhado } from './types'

vi.mock('../api/http', () => ({
  api: { get: vi.fn(), post: vi.fn(), put: vi.fn() },
}))

const apiPostMock = vi.mocked(api.post)

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

const respostaCadastroExemplo: PoloDetalhado = {
  id: '22222222-2222-2222-2222-222222222222',
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
    expect(apiPostMock).toHaveBeenCalledWith('/api/polos/', {
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
