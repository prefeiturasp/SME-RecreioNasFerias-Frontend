import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '../api/http'
import {
  ErroObterEdicaoPrograma,
  obterEdicaoPrograma,
} from './obterEdicaoPrograma'

vi.mock('../api/http', () => ({
  api: { get: vi.fn(), post: vi.fn(), put: vi.fn() },
}))

const apiGetMock = vi.mocked(api.get)

const idEdicao = '11111111-1111-1111-1111-111111111111'

const respostaObterExemplo = {
  uuid: idEdicao,
  nome: 'Janeiro 2026',
  data_inicio: '2026-01-01',
  data_fim: '2026-01-31',
  inscricoes_inicio: '2025-12-01',
  inscricoes_fim: '2025-12-31',
  quantidade_inscritos: 50,
  quantidade_atendimento_efetivo: 40,
  quantidade_passeios: 5,
  quantidade_apresentacoes: 2,
  status: 'planejada',
  ativo: true,
  criado_em: '2026-08-24T13:52:23.280Z',
  atualizado_em: '2026-08-24T13:52:23.280Z',
}

describe('obterEdicaoPrograma', () => {
  beforeEach(() => {
    apiGetMock.mockReset()
  })

  it('busca edição pelo uuid e mapeia a resposta da API', async () => {
    apiGetMock.mockResolvedValue({ data: respostaObterExemplo })

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

    expect(apiGetMock).toHaveBeenCalledTimes(1)
    expect(apiGetMock).toHaveBeenCalledWith(`/api/v1/edicoes/${idEdicao}/`)
  })

  it('lança erro quando a API retorna falha na consulta', async () => {
    apiGetMock.mockRejectedValue({
      response: {
        status: 404,
        data: { detalhe: 'Edição não encontrada.' },
      },
    })

    await expect(obterEdicaoPrograma(idEdicao)).rejects.toBeInstanceOf(
      ErroObterEdicaoPrograma,
    )
    await expect(obterEdicaoPrograma(idEdicao)).rejects.toMatchObject({
      mensagemUsuario: 'Edição não encontrada.',
    })
  })

  it('lança erro quando a resposta de consulta é inválida', async () => {
    apiGetMock.mockResolvedValue({ data: { nome: 'sem uuid' } })

    await expect(obterEdicaoPrograma(idEdicao)).rejects.toMatchObject({
      mensagemUsuario: '',
    })
  })

  it('não inventa mensagem quando o corpo de erro está vazio', async () => {
    apiGetMock.mockRejectedValue({ response: { status: 500, data: {} } })

    await expect(obterEdicaoPrograma(idEdicao)).rejects.toMatchObject({
      mensagemUsuario: '',
    })
  })
})
