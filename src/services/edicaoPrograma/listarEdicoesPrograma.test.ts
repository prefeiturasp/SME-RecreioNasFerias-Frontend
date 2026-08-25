import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '../api/http'
import { listarEdicoesPrograma } from './listarEdicoesPrograma'
import type { EdicaoPrograma } from './types'

vi.mock('../api/http', () => ({
  api: { get: vi.fn(), post: vi.fn(), put: vi.fn() },
}))

const apiGetMock = vi.mocked(api.get)

const itemListagemExemplo: EdicaoPrograma = {
  id: '04153eb1-5f40-4f0d-8b59-1290ba4684a0',
  nome: 'Programa teste',
  dataInicioEdicao: '2026-08-02',
  dataFimEdicao: '2026-08-08',
  dataInicioInscricoes: '2026-08-02',
  dataFimInscricoes: '2026-08-08',
  quantidadeInscritos: 0,
  quantidadeAtendimentoEfetivo: 0,
  quantidadePasseios: 0,
  quantidadeApresentacoes: 0,
}

describe('listarEdicoesPrograma', () => {
  beforeEach(() => {
    apiGetMock.mockReset()
  })

  it('envia GET sem paginação e devolve o array da API', async () => {
    apiGetMock.mockResolvedValue({ data: [itemListagemExemplo] })

    await expect(listarEdicoesPrograma()).resolves.toEqual([itemListagemExemplo])

    expect(apiGetMock).toHaveBeenCalledTimes(1)
    expect(apiGetMock).toHaveBeenCalledWith('/api/v1/edicoes/')
  })

  it('retorna lista vazia quando a API devolve array vazio', async () => {
    apiGetMock.mockResolvedValue({ data: [] })

    await expect(listarEdicoesPrograma()).resolves.toEqual([])
  })

  it('lança erro quando a API retorna falha', async () => {
    apiGetMock.mockRejectedValue({
      response: {
        status: 401,
        data: { detalhe: 'Credenciais inválidas.' },
      },
    })

    await expect(listarEdicoesPrograma()).rejects.toMatchObject({
      response: {
        data: { detalhe: 'Credenciais inválidas.' },
      },
    })
  })

  it('não inventa mensagem quando o corpo de erro está vazio', async () => {
    apiGetMock.mockRejectedValue({ response: { status: 500, data: {} } })

    await expect(listarEdicoesPrograma()).rejects.toMatchObject({
      response: { data: {} },
    })
  })
})
