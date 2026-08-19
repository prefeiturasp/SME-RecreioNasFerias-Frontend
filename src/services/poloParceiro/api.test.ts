import { beforeEach, describe, expect, it, vi } from 'vitest'

import { api } from '../api/http'
import {
  atualizarPoloParceiro,
  cadastrarPoloParceiro,
  ErroAtualizacaoPoloParceiro,
  ErroCadastroPoloParceiro,
  ErroListagemPolosParceiros,
  ErroObterPoloParceiro,
  listarPolosParceiros,
  obterPoloParceiro,
} from './api'
import type { DadosCadastroPoloParceiro } from './types'

vi.mock('../api/http', () => ({
  api: { get: vi.fn(), post: vi.fn(), put: vi.fn() },
}))

const apiGetMock = vi.mocked(api.get)
const apiPostMock = vi.mocked(api.post)
const apiPutMock = vi.mocked(api.put)

const respostaListagemExemplo = {
  results: [
    {
      id: '11111111-1111-1111-1111-111111111111',
      tipo: 'Pendente',
      nomeOsc: 'Cantinho Feliz',
      nomePolo: 'CEI DIRET ALOYSIO DE MENEZES PINTO NETO',
      dre: 'DRE Butantã',
      tipoUe: 'CEI',
      quantidadeMaximaAlunos: 50,
      cep: '05510-000',
      endereco: 'Rua Exemplo, 100',
      nomeGestor: 'Maria Silva',
      emailPolo: 'polo@exemplo.com',
      telefonePolo: '11999999999',
      status: 'ativo',
      observacoesGerais: '',
    },
  ],
  page: 1,
  pageSize: 10,
  total: 1,
  totalPages: 1,
}

const dadosCadastroExemplo: DadosCadastroPoloParceiro = {
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
}

const respostaCadastroExemplo = {
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

describe('listarPolosParceiros', () => {
  beforeEach(() => {
    apiGetMock.mockReset()
  })

  it('envia requisição autenticada e mapeia a resposta da API', async () => {
    apiGetMock.mockResolvedValue({ data: respostaListagemExemplo })

    await expect(listarPolosParceiros()).resolves.toEqual({
      polos: [
        {
          id: '11111111-1111-1111-1111-111111111111',
          dre: 'DRE Butantã',
          tipoUe: 'CEI',
          nomePolo: 'CEI DIRET ALOYSIO DE MENEZES PINTO NETO',
          nomeOsc: 'Cantinho Feliz',
        },
      ],
      pagina: 1,
      tamanhoPagina: 10,
      total: 1,
      totalPaginas: 1,
    })

    expect(apiGetMock).toHaveBeenCalledTimes(1)
    expect(apiGetMock).toHaveBeenCalledWith('/api/polos/', {
      params: { page: '1', pageSize: '10', gestao: 'Parceira' },
    })
  })

  it('envia parâmetros de paginação e filtros customizados', async () => {
    apiGetMock.mockResolvedValue({ data: respostaListagemExemplo })

    await listarPolosParceiros({
      pagina: 2,
      tamanhoPagina: 20,
      dre: 'DRE Butantã',
      tipoUe: 'CEI',
      nomePoloOuOsc: 'Centro',
    })

    expect(apiGetMock).toHaveBeenCalledWith('/api/polos/', {
      params: {
        page: '2',
        pageSize: '20',
        gestao: 'Parceira',
        dre: 'DRE Butantã',
        tipoUe: 'CEI',
        nomePoloOuOsc: 'Centro',
      },
    })
  })

  it('lança erro quando a API retorna falha', async () => {
    apiGetMock.mockRejectedValue({
      response: {
        status: 401,
        data: { detail: 'Credenciais inválidas.' },
      },
    })

    await expect(listarPolosParceiros()).rejects.toBeInstanceOf(
      ErroListagemPolosParceiros,
    )
    await expect(listarPolosParceiros()).rejects.toMatchObject({
      mensagemUsuario: 'Credenciais inválidas.',
    })
  })

  it('lança erro quando a resposta de listagem é inválida', async () => {
    apiGetMock.mockResolvedValue({ data: { results: 'invalido' } })

    await expect(listarPolosParceiros()).rejects.toMatchObject({
      mensagemUsuario: 'Resposta de listagem inválida.',
    })
  })

  it('usa o texto bruto quando o corpo de erro é uma string', async () => {
    apiGetMock.mockRejectedValue({
      response: { status: 500, data: 'Erro interno do servidor' },
    })

    await expect(listarPolosParceiros()).rejects.toMatchObject({
      mensagemUsuario: 'Erro interno do servidor',
    })
  })
})

describe('cadastrarPoloParceiro', () => {
  beforeEach(() => {
    apiPostMock.mockReset()
  })

  it('envia payload esperado e retorna o polo criado', async () => {
    apiPostMock.mockResolvedValue({ data: respostaCadastroExemplo })

    await expect(cadastrarPoloParceiro(dadosCadastroExemplo)).resolves.toEqual({
      id: '22222222-2222-2222-2222-222222222222',
      dre: 'DRE Butantã',
      tipoUe: 'EMEF',
      nomePolo: 'Polo Centro',
      nomeOsc: 'OSC Parceira Exemplo',
    })

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
        data: {
          error: 'Erro: já existe polo parceiro com o nome cadastrado',
        },
      },
    })

    await expect(
      cadastrarPoloParceiro(dadosCadastroExemplo),
    ).rejects.toBeInstanceOf(ErroCadastroPoloParceiro)
    await expect(
      cadastrarPoloParceiro(dadosCadastroExemplo),
    ).rejects.toMatchObject({
      mensagemUsuario: 'Erro: já existe polo parceiro com o nome cadastrado',
    })
  })

  it('lança erro quando a resposta de cadastro é inválida', async () => {
    apiPostMock.mockResolvedValue({ data: { id: 1 } })

    await expect(
      cadastrarPoloParceiro(dadosCadastroExemplo),
    ).rejects.toMatchObject({
      mensagemUsuario: 'Resposta de cadastro inválida.',
    })
  })
})

describe('obterPoloParceiro', () => {
  beforeEach(() => {
    apiGetMock.mockReset()
  })

  it('envia requisição autenticada e retorna o polo detalhado', async () => {
    apiGetMock.mockResolvedValue({ data: respostaCadastroExemplo })

    await expect(
      obterPoloParceiro('22222222-2222-2222-2222-222222222222'),
    ).resolves.toEqual({
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
    })

    expect(apiGetMock).toHaveBeenCalledWith(
      '/api/polos/22222222-2222-2222-2222-222222222222/',
    )
  })

  it('lança erro quando a API retorna falha', async () => {
    apiGetMock.mockRejectedValue({
      response: { status: 404, data: { detail: 'Polo não encontrado.' } },
    })

    await expect(obterPoloParceiro('1')).rejects.toBeInstanceOf(
      ErroObterPoloParceiro,
    )
    await expect(obterPoloParceiro('1')).rejects.toMatchObject({
      mensagemUsuario: 'Polo não encontrado.',
    })
  })

  it('lança erro quando a resposta de consulta é inválida', async () => {
    apiGetMock.mockResolvedValue({ data: { id: '1' } })

    await expect(obterPoloParceiro('1')).rejects.toMatchObject({
      mensagemUsuario: 'Resposta de consulta inválida.',
    })
  })

  it('usa mensagem padrão quando o corpo de erro está vazio', async () => {
    apiGetMock.mockRejectedValue({ response: { status: 500, data: {} } })

    await expect(obterPoloParceiro('1')).rejects.toMatchObject({
      mensagemUsuario: 'Não foi possível carregar o polo parceiro.',
    })
  })
})

describe('atualizarPoloParceiro', () => {
  beforeEach(() => {
    apiPutMock.mockReset()
  })

  it('envia payload esperado e retorna o polo atualizado', async () => {
    apiPutMock.mockResolvedValue({ data: respostaCadastroExemplo })

    await expect(
      atualizarPoloParceiro(
        '22222222-2222-2222-2222-222222222222',
        dadosCadastroExemplo,
      ),
    ).resolves.toEqual({
      id: '22222222-2222-2222-2222-222222222222',
      dre: 'DRE Butantã',
      tipoUe: 'EMEF',
      nomePolo: 'Polo Centro',
      nomeOsc: 'OSC Parceira Exemplo',
    })

    expect(apiPutMock).toHaveBeenCalledWith(
      '/api/polos/22222222-2222-2222-2222-222222222222/',
      {
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
      },
    )
  })

  it('lança erro quando a API retorna falha', async () => {
    apiPutMock.mockRejectedValue({
      response: { status: 400, data: { error: 'Não foi possível atualizar.' } },
    })

    await expect(
      atualizarPoloParceiro('1', dadosCadastroExemplo),
    ).rejects.toBeInstanceOf(ErroAtualizacaoPoloParceiro)
  })

  it('lança erro quando a resposta de atualização é inválida', async () => {
    apiPutMock.mockResolvedValue({ data: { id: 1 } })

    await expect(
      atualizarPoloParceiro('1', dadosCadastroExemplo),
    ).rejects.toMatchObject({
      mensagemUsuario: 'Resposta de atualização inválida.',
    })
  })
})
