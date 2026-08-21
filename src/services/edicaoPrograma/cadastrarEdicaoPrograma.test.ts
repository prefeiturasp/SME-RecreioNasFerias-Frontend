import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '../api/http'
import {
  cadastrarEdicaoPrograma,
  ErroCadastroEdicaoPrograma,
} from './cadastrarEdicaoPrograma'
import { QUANTIDADES_MOCK_CADASTRO_EDICAO } from './mocks'

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
    expect(apiPostMock).toHaveBeenCalledWith('/api/edicoes/', {
      nome: 'Edição Julho 2026',
      periodoEdicao: { de: '2026-07-01', ate: '2026-07-31' },
      periodoInscricoes: { de: '2026-06-01', ate: '2026-06-20' },
      ...QUANTIDADES_MOCK_CADASTRO_EDICAO,
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
    apiPostMock.mockResolvedValue({ data: { nome: 'sem id' } })

    await expect(
      cadastrarEdicaoPrograma(dadosEdicaoExemplo),
    ).rejects.toMatchObject({
      mensagemUsuario: '',
    })
  })

  it('não inventa mensagem quando o corpo de erro está vazio', async () => {
    apiPostMock.mockRejectedValue({ response: { status: 500, data: {} } })

    await expect(
      cadastrarEdicaoPrograma(dadosEdicaoExemplo),
    ).rejects.toMatchObject({
      mensagemUsuario: '',
    })
  })
})
