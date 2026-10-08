import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '../api/http'
import { obterParticipanteEol } from './obterParticipanteEol'
import type { ParticipanteEol } from './types'

vi.mock('../api/http', () => ({
  api: { get: vi.fn(), post: vi.fn(), put: vi.fn() },
}))

const apiGetMock = vi.mocked(api.get)

const participanteEolExemplo: ParticipanteEol = {
  codigo_eol: '6034178',
  nome_participante: 'ANNA JULIA ARAUJO SA',
  data_nascimento: '2013-10-16',
  responsavel_nome: 'SAMARA LIMA ARAUJO',
  responsavel_nome_social: '',
  cep: '08411-010',
  logradouro: 'DA PASSAGEM FUNDA',
  numero: '72',
  complemento: '',
  bairro: 'VILA SANTA CRUZ ZONA LESTE',
  cidade: 'SAO PAULO',
  telefone_contato_1: '',
  telefone_contato_2: '',
  email: '',
}

describe('obterParticipanteEol', () => {
  beforeEach(() => {
    apiGetMock.mockReset()
  })

  it('busca o participante pelo código EOL e devolve a resposta da API', async () => {
    apiGetMock.mockResolvedValue({ data: participanteEolExemplo })

    await expect(obterParticipanteEol('6034178')).resolves.toEqual(
      participanteEolExemplo,
    )

    expect(apiGetMock).toHaveBeenCalledTimes(1)
    expect(apiGetMock).toHaveBeenCalledWith(
      '/api/v1/inscricoes/participante-eol/',
      {
        params: { codigo_eol: '6034178' },
      },
    )
  })

  it('lança erro quando a API retorna falha na consulta', async () => {
    apiGetMock.mockRejectedValue({
      response: {
        status: 400,
        data: {
          detalhe:
            'Código EOL não encontrado. Verifique o número digitado e tente novamente.',
        },
      },
    })

    await expect(obterParticipanteEol('000')).rejects.toMatchObject({
      response: {
        data: {
          detalhe:
            'Código EOL não encontrado. Verifique o número digitado e tente novamente.',
        },
      },
    })
  })

  it('não inventa mensagem quando o corpo de erro está vazio', async () => {
    apiGetMock.mockRejectedValue({ response: { status: 500, data: {} } })

    await expect(obterParticipanteEol('6034178')).rejects.toMatchObject({
      response: { data: {} },
    })
  })
})
