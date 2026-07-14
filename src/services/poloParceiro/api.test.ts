import { beforeEach, describe, expect, it, vi } from 'vitest'

import { definirSessaoAutenticacao } from '../autenticacao'
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
    localStorage.clear()
  })

  it('envia requisição autenticada e mapeia a resposta da API', async () => {
    definirSessaoAutenticacao({
      token: 'eyJ-token',
      rf: '1234567',
      nome: 'Usuário Teste',
      descricaoCargo: 'Cargo Teste',
    })

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => respostaListagemExemplo,
    })
    vi.stubGlobal('fetch', fetchMock)

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

    expect(fetchMock).toHaveBeenCalledTimes(1)

    const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit]
    const headers = options.headers as Headers

    expect(url).toBe('/api/polos/?page=1&pageSize=10&gestao=Parceira')
    expect(options.method).toBe('GET')
    expect(headers.get('Authorization')).toBe('Bearer eyJ-token')
  })

  it('envia parâmetros de paginação e filtros customizados', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => respostaListagemExemplo,
    })
    vi.stubGlobal('fetch', fetchMock)

    await listarPolosParceiros({
      pagina: 2,
      tamanhoPagina: 20,
      dre: 'DRE Butantã',
      tipoUe: 'CEI',
      nomePoloOuOsc: 'Centro',
    })

    const [url] = fetchMock.mock.calls[0] as [string]
    expect(url).toBe(
      '/api/polos/?page=2&pageSize=20&gestao=Parceira&dre=DRE+Butant%C3%A3&tipoUe=CEI&nomePoloOuOsc=Centro',
    )
  })

  it('lança erro quando a API retorna falha', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      text: async () => JSON.stringify({ detail: 'Credenciais inválidas.' }),
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(listarPolosParceiros()).rejects.toBeInstanceOf(
      ErroListagemPolosParceiros,
    )
    await expect(listarPolosParceiros()).rejects.toMatchObject({
      mensagemUsuario: 'Credenciais inválidas.',
    })
  })

  it('lança erro quando a resposta de listagem é inválida', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ results: 'invalido' }),
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(listarPolosParceiros()).rejects.toMatchObject({
      mensagemUsuario: 'Resposta de listagem inválida.',
    })
  })

  it('exibe texto bruto quando o corpo de erro não é JSON', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => 'Erro interno do servidor',
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(listarPolosParceiros()).rejects.toMatchObject({
      mensagemUsuario: 'Erro interno do servidor',
    })
  })
})

describe('cadastrarPoloParceiro', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('envia payload esperado e retorna o polo criado', async () => {
    definirSessaoAutenticacao({
      token: 'eyJ-token',
      rf: '1234567',
      nome: 'Usuário Teste',
      descricaoCargo: 'Cargo Teste',
    })

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => respostaCadastroExemplo,
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(cadastrarPoloParceiro(dadosCadastroExemplo)).resolves.toEqual({
      id: '22222222-2222-2222-2222-222222222222',
      dre: 'DRE Butantã',
      tipoUe: 'EMEF',
      nomePolo: 'Polo Centro',
      nomeOsc: 'OSC Parceira Exemplo',
    })

    expect(fetchMock).toHaveBeenCalledTimes(1)

    const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit]
    const headers = options.headers as Headers

    expect(url).toBe('/api/polos/')
    expect(options.method).toBe('POST')
    expect(headers.get('Authorization')).toBe('Bearer eyJ-token')
    expect(headers.get('Content-Type')).toBe('application/json')
    expect(options.body).toBe(
      JSON.stringify({
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
      }),
    )
  })

  it('lança erro quando a API retorna falha no cadastro', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      text: async () =>
        JSON.stringify({
          error: 'Erro: já existe polo parceiro com o nome cadastrado',
        }),
    })
    vi.stubGlobal('fetch', fetchMock)

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
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({ id: 1 }),
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(
      cadastrarPoloParceiro(dadosCadastroExemplo),
    ).rejects.toMatchObject({
      mensagemUsuario: 'Resposta de cadastro inválida.',
    })
  })
})

describe('obterPoloParceiro', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('envia requisição autenticada e retorna o polo detalhado', async () => {
    definirSessaoAutenticacao({
      token: 'eyJ-token',
      rf: '1234567',
      nome: 'Usuário Teste',
      descricaoCargo: 'Cargo Teste',
    })

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => respostaCadastroExemplo,
    })
    vi.stubGlobal('fetch', fetchMock)

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

    const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe(
      '/api/polos/22222222-2222-2222-2222-222222222222/',
    )
    expect(options.method).toBe('GET')
  })

  it('lança erro quando a API retorna falha', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      text: async () => JSON.stringify({ detail: 'Polo não encontrado.' }),
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(obterPoloParceiro('1')).rejects.toBeInstanceOf(
      ErroObterPoloParceiro,
    )
    await expect(obterPoloParceiro('1')).rejects.toMatchObject({
      mensagemUsuario: 'Polo não encontrado.',
    })
  })

  it('lança erro quando a resposta de consulta é inválida', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ id: '1' }),
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(obterPoloParceiro('1')).rejects.toMatchObject({
      mensagemUsuario: 'Resposta de consulta inválida.',
    })
  })

  it('usa mensagem padrão quando o corpo de erro está vazio', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => '',
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(obterPoloParceiro('1')).rejects.toMatchObject({
      mensagemUsuario: 'Não foi possível carregar o polo parceiro.',
    })
  })
})

describe('atualizarPoloParceiro', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('envia payload esperado e retorna o polo atualizado', async () => {
    definirSessaoAutenticacao({
      token: 'eyJ-token',
      rf: '1234567',
      nome: 'Usuário Teste',
      descricaoCargo: 'Cargo Teste',
    })

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => respostaCadastroExemplo,
    })
    vi.stubGlobal('fetch', fetchMock)

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

    const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe(
      '/api/polos/22222222-2222-2222-2222-222222222222/',
    )
    expect(options.method).toBe('PUT')
    expect(options.body).toBe(
      JSON.stringify({
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
      }),
    )
  })

  it('lança erro quando a API retorna falha', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      text: async () =>
        JSON.stringify({ error: 'Não foi possível atualizar.' }),
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(
      atualizarPoloParceiro('1', dadosCadastroExemplo),
    ).rejects.toBeInstanceOf(ErroAtualizacaoPoloParceiro)
  })

  it('lança erro quando a resposta de atualização é inválida', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ id: 1 }),
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(
      atualizarPoloParceiro('1', dadosCadastroExemplo),
    ).rejects.toMatchObject({
      mensagemUsuario: 'Resposta de atualização inválida.',
    })
  })
})
