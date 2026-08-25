import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '../api/http'
import { cadastrarEdicaoPrograma } from './cadastrarEdicaoPrograma'

vi.mock('../api/http', () => ({
  api: { get: vi.fn(), post: vi.fn(), put: vi.fn() },
}))

const apiPostMock = vi.mocked(api.post)

const dadosEdicaoExemplo = {
  nome: 'Edição Julho 2026',
  dataInicioEdicao: '2026-07-01',
  dataFimEdicao: '2026-07-31',
  dataInicioInscricoes: '2026-06-01',
  dataFimInscricoes: '2026-06-20',
} as const

const respostaCadastroExemplo = {
  uuid: '22222222-2222-2222-2222-222222222222',
  nome: 'Edição Julho 2026',
  data_inicio: '2026-07-01',
  data_fim: '2026-07-31',
  inscricoes_inicio: '2026-06-01',
  inscricoes_fim: '2026-06-20',
  quantidade_inscritos: 0,
  quantidade_atendimento_efetivo: 0,
  quantidade_passeios: 0,
  quantidade_apresentacoes: 0,
  status: 'planejada',
  ativo: true,
  criado_em: '2026-08-24T13:52:23.280Z',
  atualizado_em: '2026-08-24T13:52:23.280Z',
}

describe('cadastrarEdicaoPrograma', () => {
  beforeEach(() => {
    apiPostMock.mockReset()
  })

  it('envia payload esperado e retorna a edição criada', async () => {
    apiPostMock.mockResolvedValue({ data: respostaCadastroExemplo })

    await expect(cadastrarEdicaoPrograma(dadosEdicaoExemplo)).resolves.toEqual({
      id: '22222222-2222-2222-2222-222222222222',
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

    expect(apiPostMock).toHaveBeenCalledTimes(1)
    expect(apiPostMock).toHaveBeenCalledWith('/api/v1/edicoes/', {
      nome: 'Edição Julho 2026',
      data_inicio: '2026-07-01',
      data_fim: '2026-07-31',
      inscricoes_inicio: '2026-06-01',
      inscricoes_fim: '2026-06-20',
    })
  })

  it('lança erro quando a API retorna falha no cadastro', async () => {
    apiPostMock.mockRejectedValue({
      response: {
        status: 400,
        data: { detalhe: 'Já existe uma edição com este nome.' },
      },
    })

    await expect(
      cadastrarEdicaoPrograma({
        nome: 'Edição Verão 2026',
        dataInicioEdicao: '2026-02-01',
        dataFimEdicao: '2026-02-15',
        dataInicioInscricoes: '2026-01-01',
        dataFimInscricoes: '2026-01-20',
      }),
    ).rejects.toMatchObject({
      response: {
        data: { detalhe: 'Já existe uma edição com este nome.' },
      },
    })
  })

  it('lança erro quando a resposta de cadastro é inválida', async () => {
    apiPostMock.mockResolvedValue({ data: { nome: 'sem id' } })

    await expect(cadastrarEdicaoPrograma(dadosEdicaoExemplo)).rejects.toThrow()
  })

  it('não inventa mensagem quando o corpo de erro está vazio', async () => {
    apiPostMock.mockRejectedValue({ response: { status: 500, data: {} } })

    await expect(
      cadastrarEdicaoPrograma(dadosEdicaoExemplo),
    ).rejects.toMatchObject({
      response: { data: {} },
    })
  })
})
