import { beforeEach, describe, expect, it, vi } from 'vitest'
import { definirSessaoAutenticacao } from '../autenticacao'
import {
  atualizarEdicaoPrograma,
  cadastrarEdicaoPrograma,
  ErroAtualizacaoEdicaoPrograma,
  ErroCadastroEdicaoPrograma,
  ErroListagemEdicoesPrograma,
  listarEdicoesPrograma,
} from './api'
import { QUANTIDADES_MOCK_CADASTRO_EDICAO } from './mocks'

const respostaListagemExemplo = {
  results: [
    {
      id: '11111111-1111-1111-1111-111111111111',
      nome: 'Janeiro 2026',
      periodoEdicao: { de: '2026-01-01', ate: '2026-01-31' },
      periodoInscricoes: { de: '2025-12-01', ate: '2025-12-31' },
      quantidadeInscritos: 50,
      quantidadeAtendimentoEfetivo: 40,
      quantidadePasseios: null,
      quantidadeApresentacoes: null,
    },
  ],
  page: 1,
  pageSize: 10,
  total: 1,
  totalPages: 1,
}

const dadosEdicaoExemplo = {
  nome: 'Edição Julho 2026',
  dataInicioEdicao: '2026-07-01',
  dataFimEdicao: '2026-07-31',
  dataInicioInscricoes: '2026-06-01',
  dataFimInscricoes: '2026-06-20',
} as const

const respostaCadastroExemplo = {
  id: '22222222-2222-2222-2222-222222222222',
  nome: 'Edição Julho 2026',
  periodoEdicao: { de: '2026-07-01', ate: '2026-07-31' },
  periodoInscricoes: { de: '2026-06-01', ate: '2026-06-20' },
  quantidadeInscritos: null,
  quantidadeAtendimentoEfetivo: null,
  quantidadePasseios: null,
  quantidadeApresentacoes: null,
}

describe('cadastrarEdicaoPrograma', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('envia payload esperado e retorna a edição criada', async () => {
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

    await expect(cadastrarEdicaoPrograma(dadosEdicaoExemplo)).resolves.toEqual({
      id: '22222222-2222-2222-2222-222222222222',
      nome: 'Edição Julho 2026',
      dataInicioEdicao: '2026-07-01',
      dataFimEdicao: '2026-07-31',
      dataInicioInscricoes: '2026-06-01',
      dataFimInscricoes: '2026-06-20',
      quantidadeInscritos: 0,
      quantidadeAtendimentoEfetivo: 0,
    })

    expect(fetchMock).toHaveBeenCalledTimes(1)

    const [, options] = fetchMock.mock.calls[0] as [string, RequestInit]
    const headers = options.headers as Headers

    expect(options.method).toBe('POST')
    expect(headers.get('Authorization')).toBe('Bearer eyJ-token')
    expect(headers.get('Content-Type')).toBe('application/json')
    expect(options.body).toBe(
      JSON.stringify({
        nome: 'Edição Julho 2026',
        periodoEdicao: { de: '2026-07-01', ate: '2026-07-31' },
        periodoInscricoes: { de: '2026-06-01', ate: '2026-06-20' },
        ...QUANTIDADES_MOCK_CADASTRO_EDICAO,
      }),
    )
  })

  it('lança erro quando a API retorna falha no cadastro', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      text: async () =>
        JSON.stringify({ error: 'Já existe uma edição com este nome.' }),
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(
      cadastrarEdicaoPrograma({
        nome: 'Edição Verão 2026',
        dataInicioEdicao: '2026-02-01',
        dataFimEdicao: '2026-02-15',
        dataInicioInscricoes: '2026-01-01',
        dataFimInscricoes: '2026-01-20',
      }),
    ).rejects.toBeInstanceOf(ErroCadastroEdicaoPrograma)

    await expect(
      cadastrarEdicaoPrograma({
        nome: 'Edição Verão 2026',
        dataInicioEdicao: '2026-02-01',
        dataFimEdicao: '2026-02-15',
        dataInicioInscricoes: '2026-01-01',
        dataFimInscricoes: '2026-01-20',
      }),
    ).rejects.toMatchObject({
      mensagemUsuario: 'Já existe uma edição com este nome.',
    })
  })

  it('lança erro quando a resposta de cadastro é inválida', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({ nome: 'sem id' }),
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(
      cadastrarEdicaoPrograma(dadosEdicaoExemplo),
    ).rejects.toMatchObject({
      mensagemUsuario: 'Resposta de cadastro inválida.',
    })
  })

  it('usa mensagem padrão quando o corpo de erro está vazio', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => '   ',
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(
      cadastrarEdicaoPrograma(dadosEdicaoExemplo),
    ).rejects.toMatchObject({
      mensagemUsuario: 'Não foi possível cadastrar a edição do programa.',
    })
  })
})

describe('atualizarEdicaoPrograma', () => {
  const idEdicao = '22222222-2222-2222-2222-222222222222'

  beforeEach(() => {
    localStorage.clear()
  })

  it('envia payload esperado com quantidades e retorna a edição atualizada', async () => {
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
      atualizarEdicaoPrograma(idEdicao, dadosEdicaoExemplo),
    ).resolves.toEqual({
      id: idEdicao,
      nome: 'Edição Julho 2026',
      dataInicioEdicao: '2026-07-01',
      dataFimEdicao: '2026-07-31',
      dataInicioInscricoes: '2026-06-01',
      dataFimInscricoes: '2026-06-20',
      quantidadeInscritos: 0,
      quantidadeAtendimentoEfetivo: 0,
    })

    const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit]
    const headers = options.headers as Headers

    expect(url).toBe(`/api/edicoes/${idEdicao}/`)
    expect(options.method).toBe('PUT')
    expect(headers.get('Authorization')).toBe('Bearer eyJ-token')
    expect(headers.get('Content-Type')).toBe('application/json')
    expect(options.body).toBe(
      JSON.stringify({
        nome: 'Edição Julho 2026',
        periodoEdicao: { de: '2026-07-01', ate: '2026-07-31' },
        periodoInscricoes: { de: '2026-06-01', ate: '2026-06-20' },
        ...QUANTIDADES_MOCK_CADASTRO_EDICAO,
      }),
    )
  })

  it('lança erro quando a API retorna falha na atualização', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      text: async () => JSON.stringify({ detail: 'Edição não encontrada.' }),
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(
      atualizarEdicaoPrograma(idEdicao, dadosEdicaoExemplo),
    ).rejects.toBeInstanceOf(ErroAtualizacaoEdicaoPrograma)
    await expect(
      atualizarEdicaoPrograma(idEdicao, dadosEdicaoExemplo),
    ).rejects.toMatchObject({
      mensagemUsuario: 'Edição não encontrada.',
    })
  })

  it('lança erro quando a resposta de atualização é inválida', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => null,
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(
      atualizarEdicaoPrograma(idEdicao, dadosEdicaoExemplo),
    ).rejects.toMatchObject({
      mensagemUsuario: 'Resposta de atualização inválida.',
    })
  })
})

describe('listarEdicoesPrograma', () => {
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

    await expect(listarEdicoesPrograma()).resolves.toEqual({
      edicoes: [
        {
          id: '11111111-1111-1111-1111-111111111111',
          nome: 'Janeiro 2026',
          dataInicioEdicao: '2026-01-01',
          dataFimEdicao: '2026-01-31',
          dataInicioInscricoes: '2025-12-01',
          dataFimInscricoes: '2025-12-31',
          quantidadeInscritos: 50,
          quantidadeAtendimentoEfetivo: 40,
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

    expect(url).toBe('/api/edicoes/?page=1&pageSize=10')
    expect(options.method).toBe('GET')
    expect(headers.get('Authorization')).toBe('Bearer eyJ-token')
  })

  it('lança erro quando a API retorna falha', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      text: async () => JSON.stringify({ detail: 'Credenciais inválidas.' }),
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(listarEdicoesPrograma()).rejects.toBeInstanceOf(
      ErroListagemEdicoesPrograma,
    )
    await expect(listarEdicoesPrograma()).rejects.toMatchObject({
      mensagemUsuario: 'Credenciais inválidas.',
    })
  })

  it('envia parâmetros de paginação customizados', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => respostaListagemExemplo,
    })
    vi.stubGlobal('fetch', fetchMock)

    await listarEdicoesPrograma({ pagina: 2, tamanhoPagina: 20 })

    const [url] = fetchMock.mock.calls[0] as [string]
    expect(url).toBe('/api/edicoes/?page=2&pageSize=20')
  })

  it('lança erro quando a resposta de listagem é inválida', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ results: 'invalido' }),
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(listarEdicoesPrograma()).rejects.toMatchObject({
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

    await expect(listarEdicoesPrograma()).rejects.toMatchObject({
      mensagemUsuario: 'Erro interno do servidor',
    })
  })
})
