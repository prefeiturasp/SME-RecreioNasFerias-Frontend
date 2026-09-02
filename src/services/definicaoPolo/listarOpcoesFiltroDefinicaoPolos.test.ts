import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '../api/http'
import { listarOpcoesFiltroDefinicaoPolos } from './listarOpcoesFiltroDefinicaoPolos'

vi.mock('../api/http', () => ({
  api: { get: vi.fn() },
}))

const apiGetMock = vi.mocked(api.get)

const opcoesExemplo = {
  dres: ['DIRETORIA REGIONAL DE EDUCACAO PENHA'],
  tiposUe: ['CEI DIRET', 'EMEF'],
  gestoes: ['Direta', 'Parceira'],
  nomesEdicao: ['-', 'Janeiro 2025'],
  tiposPolo: ['Pendente', 'Polo oficial', 'Polo reserva'],
}

describe('listarOpcoesFiltroDefinicaoPolos', () => {
  beforeEach(() => {
    apiGetMock.mockReset()
  })

  it('lista opções de filtro e retorna os dados da API', async () => {
    apiGetMock.mockResolvedValue({ data: opcoesExemplo })

    await expect(listarOpcoesFiltroDefinicaoPolos()).resolves.toEqual(
      opcoesExemplo,
    )

    expect(apiGetMock).toHaveBeenCalledWith('/api/polos/opcoes-filtro/')
  })

  it('lança erro quando a API retorna falha', async () => {
    apiGetMock.mockRejectedValue({
      response: {
        status: 503,
        data: { detalhe: 'Não foi possível carregar as opções dos filtros.' },
      },
    })

    await expect(listarOpcoesFiltroDefinicaoPolos()).rejects.toMatchObject({
      response: {
        data: { detalhe: 'Não foi possível carregar as opções dos filtros.' },
      },
    })
  })
})
