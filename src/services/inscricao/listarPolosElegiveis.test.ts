import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '../api/http'
import { listarPolosElegiveis } from './listarPolosElegiveis'
import type { PoloElegivel } from './types'

vi.mock('../api/http', () => ({
  api: { get: vi.fn(), post: vi.fn(), put: vi.fn() },
}))

const apiGetMock = vi.mocked(api.get)

const poloElegivelExemplo: PoloElegivel = {
  uuid: '11111111-1111-1111-1111-111111111111',
  codigo_eol: '123456',
  nome_polo: 'Polo Centro',
  dre_codigo_eol: '108100',
  dre_nome: 'DRE Butantã',
}

describe('listarPolosElegiveis', () => {
  beforeEach(() => {
    apiGetMock.mockReset()
  })

  it('envia a DRE e devolve a lista da API', async () => {
    apiGetMock.mockResolvedValue({ data: [poloElegivelExemplo] })

    await expect(listarPolosElegiveis('108100')).resolves.toEqual([
      poloElegivelExemplo,
    ])

    expect(apiGetMock).toHaveBeenCalledTimes(1)
    expect(apiGetMock).toHaveBeenCalledWith(
      '/api/v1/inscricoes/polos-elegiveis/',
      {
        params: {
          dre_codigo_eol: '108100',
          desabilita_paginacao: true,
        },
      },
    )
  })

  it('retorna lista vazia quando a API devolve array vazio', async () => {
    apiGetMock.mockResolvedValue({ data: [] })

    await expect(listarPolosElegiveis('108100')).resolves.toEqual([])
  })

  it('lança erro quando a API retorna falha', async () => {
    apiGetMock.mockRejectedValue({
      response: {
        status: 400,
        data: { detalhe: 'Falha ao carregar polos.' },
      },
    })

    await expect(listarPolosElegiveis('108100')).rejects.toMatchObject({
      response: {
        data: { detalhe: 'Falha ao carregar polos.' },
      },
    })
  })

  it('não inventa mensagem quando o corpo de erro está vazio', async () => {
    apiGetMock.mockRejectedValue({ response: { status: 500, data: {} } })

    await expect(listarPolosElegiveis('108100')).rejects.toMatchObject({
      response: { data: {} },
    })
  })
})
