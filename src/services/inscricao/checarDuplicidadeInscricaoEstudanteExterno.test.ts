import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '../api/http'
import { checarDuplicidadeInscricaoEstudanteExterno } from './checarDuplicidadeInscricaoEstudanteExterno'

vi.mock('../api/http', () => ({
  api: { get: vi.fn() },
}))

const apiGetMock = vi.mocked(api.get)

describe('checarDuplicidadeInscricaoEstudanteExterno', () => {
  beforeEach(() => {
    apiGetMock.mockReset()
  })

  it('consulta a duplicidade pelo CPF e devolve a resposta da API', async () => {
    const resposta = { possui_inscricao: true }
    apiGetMock.mockResolvedValue({ data: resposta })

    await expect(
      checarDuplicidadeInscricaoEstudanteExterno('12345678901'),
    ).resolves.toEqual(resposta)

    expect(apiGetMock).toHaveBeenCalledTimes(1)
    expect(apiGetMock).toHaveBeenCalledWith(
      '/api/v1/inscricoes/verificar-cpf-participante/',
      {
        params: { cpf_participante: '12345678901' },
      },
    )
  })

  it('devolve falso quando a API não encontra inscrição duplicada', async () => {
    const resposta = { possui_inscricao: false }
    apiGetMock.mockResolvedValue({ data: resposta })

    await expect(
      checarDuplicidadeInscricaoEstudanteExterno('12345678901'),
    ).resolves.toEqual(resposta)
  })

  it('propaga o erro quando a consulta à API falha', async () => {
    const erro = new Error('Erro ao verificar duplicidade')
    apiGetMock.mockRejectedValue(erro)

    await expect(
      checarDuplicidadeInscricaoEstudanteExterno('12345678901'),
    ).rejects.toBe(erro)
  })
})