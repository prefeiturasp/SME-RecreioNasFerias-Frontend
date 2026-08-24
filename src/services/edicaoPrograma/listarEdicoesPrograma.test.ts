import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '../api/http'
import {
  ErroListagemEdicoesPrograma,
  listarEdicoesPrograma,
} from './listarEdicoesPrograma'

vi.mock('../api/http', () => ({
  api: { get: vi.fn(), post: vi.fn(), put: vi.fn() },
}))

const apiGetMock = vi.mocked(api.get)

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
    expect(apiGetMock).toHaveBeenCalledWith('/api/v1/edicoes/', {
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

    expect(apiGetMock).toHaveBeenCalledWith('/api/v1/edicoes/', {
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
