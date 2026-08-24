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

const itemListagemExemplo = {
  uuid: '04153eb1-5f40-4f0d-8b59-1290ba4684a0',
  nome: 'Programa teste',
  data_inicio: '2026-08-02',
  data_fim: '2026-08-08',
  inscricoes_inicio: '2026-08-02',
  inscricoes_fim: '2026-08-08',
  quantidade_inscritos: 0,
  quantidade_atendimento_efetivo: 0,
  quantidade_passeios: 0,
  quantidade_apresentacoes: 0,
  status: 'encerrada',
  ativo: true,
  criado_em: '2026-08-24T10:28:48.821542-03:00',
  atualizado_em: '2026-08-24T10:28:48.821553-03:00',
}

describe('listarEdicoesPrograma', () => {
  beforeEach(() => {
    apiGetMock.mockReset()
  })

  it('envia GET sem paginação e mapeia o array da API', async () => {
    apiGetMock.mockResolvedValue({ data: [itemListagemExemplo] })

    await expect(listarEdicoesPrograma()).resolves.toEqual([
      {
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
      },
    ])

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

    await expect(listarEdicoesPrograma()).rejects.toBeInstanceOf(
      ErroListagemEdicoesPrograma,
    )
    await expect(listarEdicoesPrograma()).rejects.toMatchObject({
      mensagemUsuario: 'Credenciais inválidas.',
    })
  })

  it('não inventa mensagem quando o corpo de erro está vazio', async () => {
    apiGetMock.mockRejectedValue({ response: { status: 500, data: {} } })

    await expect(listarEdicoesPrograma()).rejects.toMatchObject({
      mensagemUsuario: '',
    })
  })

  it('lança erro sem mensagem quando a resposta não é um array', async () => {
    apiGetMock.mockResolvedValue({ data: { results: [] } })

    await expect(listarEdicoesPrograma()).rejects.toMatchObject({
      mensagemUsuario: '',
    })
  })

  it('lança erro sem mensagem quando um item da lista é inválido', async () => {
    apiGetMock.mockResolvedValue({ data: [{ nome: 'sem uuid' }] })

    await expect(listarEdicoesPrograma()).rejects.toMatchObject({
      mensagemUsuario: '',
    })
  })
})
