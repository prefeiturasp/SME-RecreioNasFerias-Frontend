import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '../api/http'
import { atualizarDefinicoesPoloEmLote } from './atualizarDefinicoesPoloEmLote'

vi.mock('../api/http', () => ({
  api: { patch: vi.fn() },
}))

const apiPatchMock = vi.mocked(api.patch)

describe('atualizarDefinicoesPoloEmLote', () => {
  beforeEach(() => {
    apiPatchMock.mockReset()
  })

  it('envia payload esperado e retorna o total atualizado', async () => {
    apiPatchMock.mockResolvedValue({ data: { totalAtualizados: 2 } })

    await expect(
      atualizarDefinicoesPoloEmLote({
        ids: [
          '11111111-1111-1111-1111-111111111111',
          '22222222-2222-2222-2222-222222222222',
        ],
        nomeEdicao: 'Janeiro 2026',
      }),
    ).resolves.toEqual({ totalAtualizados: 2 })

    expect(apiPatchMock).toHaveBeenCalledWith('/api/polos/atualizacao-lote/', {
      ids: [
        '11111111-1111-1111-1111-111111111111',
        '22222222-2222-2222-2222-222222222222',
      ],
      nomeEdicao: 'Janeiro 2026',
    })
  })

  it('envia tipo de polo quando informado', async () => {
    apiPatchMock.mockResolvedValue({ data: { totalAtualizados: 1 } })

    await atualizarDefinicoesPoloEmLote({
      ids: ['11111111-1111-1111-1111-111111111111'],
      tipo: 'Polo oficial',
    })

    expect(apiPatchMock).toHaveBeenCalledWith('/api/polos/atualizacao-lote/', {
      ids: ['11111111-1111-1111-1111-111111111111'],
      tipo: 'Polo oficial',
    })
  })

  it('lança erro quando a API retorna falha na atualização', async () => {
    apiPatchMock.mockRejectedValue({
      response: {
        status: 400,
        data: { detalhe: 'Não foi possível atualizar os polos selecionados.' },
      },
    })

    await expect(
      atualizarDefinicoesPoloEmLote({
        ids: ['11111111-1111-1111-1111-111111111111'],
        tipo: 'Polo oficial',
      }),
    ).rejects.toMatchObject({
      response: {
        data: { detalhe: 'Não foi possível atualizar os polos selecionados.' },
      },
    })
  })
})
