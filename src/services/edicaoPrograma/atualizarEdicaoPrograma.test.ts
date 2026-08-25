import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '../api/http'
import { atualizarEdicaoPrograma } from './atualizarEdicaoPrograma'

vi.mock('../api/http', () => ({
  api: { get: vi.fn(), post: vi.fn(), put: vi.fn() },
}))

const apiPutMock = vi.mocked(api.put)

const idEdicao = '22222222-2222-2222-2222-222222222222'

const dadosEdicaoExemplo = {
  nome: 'Edição Julho 2026',
  dataInicioEdicao: '2026-07-01',
  dataFimEdicao: '2026-07-31',
  dataInicioInscricoes: '2026-06-01',
  dataFimInscricoes: '2026-06-20',
} as const

const respostaAtualizacaoExemplo = {
  uuid: idEdicao,
  nome: 'Edição Julho 2026',
  data_inicio: '2026-07-01',
  data_fim: '2026-07-31',
  inscricoes_inicio: '2026-06-01',
  inscricoes_fim: '2026-06-20',
  quantidade_inscritos: 12,
  quantidade_atendimento_efetivo: 10,
  quantidade_passeios: 3,
  quantidade_apresentacoes: 2,
  status: 'planejada',
  ativo: true,
  criado_em: '2026-08-24T13:52:23.280Z',
  atualizado_em: '2026-08-24T13:52:23.280Z',
}

describe('atualizarEdicaoPrograma', () => {
  beforeEach(() => {
    apiPutMock.mockReset()
  })

  it('envia payload esperado e retorna a edição atualizada', async () => {
    apiPutMock.mockResolvedValue({ data: respostaAtualizacaoExemplo })

    await expect(
      atualizarEdicaoPrograma(idEdicao, dadosEdicaoExemplo),
    ).resolves.toEqual({
      id: idEdicao,
      nome: 'Edição Julho 2026',
      dataInicioEdicao: '2026-07-01',
      dataFimEdicao: '2026-07-31',
      dataInicioInscricoes: '2026-06-01',
      dataFimInscricoes: '2026-06-20',
      quantidadeInscritos: 12,
      quantidadeAtendimentoEfetivo: 10,
      quantidadePasseios: 3,
      quantidadeApresentacoes: 2,
    })

    expect(apiPutMock).toHaveBeenCalledTimes(1)
    expect(apiPutMock).toHaveBeenCalledWith(`/api/v1/edicoes/${idEdicao}/`, {
      nome: 'Edição Julho 2026',
      data_inicio: '2026-07-01',
      data_fim: '2026-07-31',
      inscricoes_inicio: '2026-06-01',
      inscricoes_fim: '2026-06-20',
    })
  })

  it('lança erro quando a API retorna falha na atualização', async () => {
    apiPutMock.mockRejectedValue({
      response: {
        status: 400,
        data: { detalhe: 'Já existe uma edição com este nome.' },
      },
    })

    await expect(
      atualizarEdicaoPrograma(idEdicao, dadosEdicaoExemplo),
    ).rejects.toMatchObject({
      response: {
        data: { detalhe: 'Já existe uma edição com este nome.' },
      },
    })
  })

  it('lança erro quando a resposta de atualização é inválida', async () => {
    apiPutMock.mockResolvedValue({ data: { nome: 'sem uuid' } })

    await expect(
      atualizarEdicaoPrograma(idEdicao, dadosEdicaoExemplo),
    ).rejects.toThrow()
  })

  it('não inventa mensagem quando o corpo de erro está vazio', async () => {
    apiPutMock.mockRejectedValue({ response: { status: 500, data: {} } })

    await expect(
      atualizarEdicaoPrograma(idEdicao, dadosEdicaoExemplo),
    ).rejects.toMatchObject({
      response: { data: {} },
    })
  })
})
