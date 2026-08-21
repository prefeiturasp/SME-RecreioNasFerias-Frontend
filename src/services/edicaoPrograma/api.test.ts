import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '../api/http'
import {
  atualizarEdicaoPrograma,
  ErroAtualizacaoEdicaoPrograma,
  ErroListagemEdicoesPrograma,
  ErroObterEdicaoPrograma,
  listarEdicoesPrograma,
  obterEdicaoPrograma,
} from './api'

vi.mock('../api/http', () => ({
  api: { get: vi.fn(), post: vi.fn(), put: vi.fn() },
}))

const apiGetMock = vi.mocked(api.get)
const apiPutMock = vi.mocked(api.put)

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

const quantidadesEdicaoExemplo = {
  quantidadeInscritos: 12,
  quantidadeAtendimentoEfetivo: 10,
  quantidadePasseios: 3,
  quantidadeApresentacoes: 2,
} as const

describe('obterEdicaoPrograma', () => {
  const idEdicao = '11111111-1111-1111-1111-111111111111'

  beforeEach(() => {
    apiGetMock.mockReset()
  })

  it('busca edição pelo id e mapeia a resposta da API', async () => {
    apiGetMock.mockResolvedValue({
      data: {
        id: idEdicao,
        nome: 'Janeiro 2026',
        periodoEdicao: { de: '2026-01-01', ate: '2026-01-31' },
        periodoInscricoes: { de: '2025-12-01', ate: '2025-12-31' },
        quantidadeInscritos: 50,
        quantidadeAtendimentoEfetivo: 40,
        quantidadePasseios: 5,
        quantidadeApresentacoes: 2,
      },
    })

    await expect(obterEdicaoPrograma(idEdicao)).resolves.toEqual({
      id: idEdicao,
      nome: 'Janeiro 2026',
      dataInicioEdicao: '2026-01-01',
      dataFimEdicao: '2026-01-31',
      dataInicioInscricoes: '2025-12-01',
      dataFimInscricoes: '2025-12-31',
      quantidadeInscritos: 50,
      quantidadeAtendimentoEfetivo: 40,
      quantidadePasseios: 5,
      quantidadeApresentacoes: 2,
    })

    expect(apiGetMock).toHaveBeenCalledWith(`/api/edicoes/${idEdicao}/`)
  })

  it('lança erro quando a API retorna falha na consulta', async () => {
    apiGetMock.mockRejectedValue({
      response: { status: 404, data: { detail: 'Edição não encontrada.' } },
    })

    await expect(obterEdicaoPrograma(idEdicao)).rejects.toBeInstanceOf(
      ErroObterEdicaoPrograma,
    )
    await expect(obterEdicaoPrograma(idEdicao)).rejects.toMatchObject({
      mensagemUsuario: 'Edição não encontrada.',
    })
  })

  it('lança erro quando a resposta de consulta é inválida', async () => {
    apiGetMock.mockResolvedValue({ data: { nome: 'sem id' } })

    await expect(obterEdicaoPrograma(idEdicao)).rejects.toMatchObject({
      mensagemUsuario: 'Resposta de consulta inválida.',
    })
  })
})

describe('atualizarEdicaoPrograma', () => {
  const idEdicao = '22222222-2222-2222-2222-222222222222'

  beforeEach(() => {
    apiPutMock.mockReset()
  })

  it('envia payload esperado com quantidades e retorna a edição atualizada', async () => {
    apiPutMock.mockResolvedValue({ data: respostaCadastroExemplo })

    await expect(
      atualizarEdicaoPrograma(
        idEdicao,
        dadosEdicaoExemplo,
        quantidadesEdicaoExemplo,
      ),
    ).resolves.toEqual({
      id: idEdicao,
      nome: 'Edição Julho 2026',
      dataInicioEdicao: '2026-07-01',
      dataFimEdicao: '2026-07-31',
      dataInicioInscricoes: '2026-06-01',
      dataFimInscricoes: '2026-06-20',
      quantidadeInscritos: 0,
      quantidadeAtendimentoEfetivo: 0,
      quantidadePasseios: 0,
      quantidadeApresentacoes: 0,
    })

    expect(apiPutMock).toHaveBeenCalledWith(`/api/edicoes/${idEdicao}/`, {
      nome: 'Edição Julho 2026',
      periodoEdicao: { de: '2026-07-01', ate: '2026-07-31' },
      periodoInscricoes: { de: '2026-06-01', ate: '2026-06-20' },
      ...quantidadesEdicaoExemplo,
    })
  })

  it('lança erro quando a API retorna falha na atualização', async () => {
    apiPutMock.mockRejectedValue({
      response: { status: 404, data: { detail: 'Edição não encontrada.' } },
    })

    await expect(
      atualizarEdicaoPrograma(
        idEdicao,
        dadosEdicaoExemplo,
        quantidadesEdicaoExemplo,
      ),
    ).rejects.toBeInstanceOf(ErroAtualizacaoEdicaoPrograma)
    await expect(
      atualizarEdicaoPrograma(
        idEdicao,
        dadosEdicaoExemplo,
        quantidadesEdicaoExemplo,
      ),
    ).rejects.toMatchObject({
      mensagemUsuario: 'Edição não encontrada.',
    })
  })

  it('lança erro quando a resposta de atualização é inválida', async () => {
    apiPutMock.mockResolvedValue({ data: null })

    await expect(
      atualizarEdicaoPrograma(
        idEdicao,
        dadosEdicaoExemplo,
        quantidadesEdicaoExemplo,
      ),
    ).rejects.toMatchObject({
      mensagemUsuario: 'Resposta de atualização inválida.',
    })
  })
})

describe('listarEdicoesPrograma', () => {
  beforeEach(() => {
    apiGetMock.mockReset()
  })

  it('envia requisição autenticada e mapeia a resposta da API', async () => {
    apiGetMock.mockResolvedValue({ data: respostaListagemExemplo })

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
          quantidadePasseios: 0,
          quantidadeApresentacoes: 0,
        },
      ],
      pagina: 1,
      tamanhoPagina: 10,
      total: 1,
      totalPaginas: 1,
    })

    expect(apiGetMock).toHaveBeenCalledTimes(1)
    expect(apiGetMock).toHaveBeenCalledWith('/api/edicoes/', {
      params: { page: '1', pageSize: '10' },
    })
  })

  it('lança erro quando a API retorna falha', async () => {
    apiGetMock.mockRejectedValue({
      response: {
        status: 401,
        data: { detail: 'Credenciais inválidas.' },
      },
    })

    await expect(listarEdicoesPrograma()).rejects.toBeInstanceOf(
      ErroListagemEdicoesPrograma,
    )
    await expect(listarEdicoesPrograma()).rejects.toMatchObject({
      mensagemUsuario: 'Credenciais inválidas.',
    })
  })

  it('envia parâmetros de paginação customizados', async () => {
    apiGetMock.mockResolvedValue({ data: respostaListagemExemplo })

    await listarEdicoesPrograma({ pagina: 2, tamanhoPagina: 20 })

    expect(apiGetMock).toHaveBeenCalledWith('/api/edicoes/', {
      params: { page: '2', pageSize: '20' },
    })
  })

  it('lança erro quando a resposta de listagem é inválida', async () => {
    apiGetMock.mockResolvedValue({ data: { results: 'invalido' } })

    await expect(listarEdicoesPrograma()).rejects.toMatchObject({
      mensagemUsuario: 'Resposta de listagem inválida.',
    })
  })

  it('usa o texto bruto quando o corpo de erro é uma string', async () => {
    apiGetMock.mockRejectedValue({
      response: { status: 500, data: 'Erro interno do servidor' },
    })

    await expect(listarEdicoesPrograma()).rejects.toMatchObject({
      mensagemUsuario: 'Erro interno do servidor',
    })
  })
})
