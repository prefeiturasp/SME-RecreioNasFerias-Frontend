import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '../api/http'
import { alterarTipoEmMassa } from './alterarTipoEmMassa'
import type { ResultadoAlterarTipoEmMassa } from './types'

vi.mock('../api/http', () => ({
  api: { post: vi.fn() },
}))

const apiPostMock = vi.mocked(api.post)

const payload = [
  {
    polo_uuid: '11111111-1111-1111-1111-111111111111',
    edicao: '33333333-3333-3333-3333-333333333333',
    tipo: 'oficial',
  },
  {
    polo_uuid: '22222222-2222-2222-2222-222222222222',
    edicao: null,
    tipo: 'oficial',
  },
]

const resposta: ResultadoAlterarTipoEmMassa = {
  mensagem:
    'Houve polos que não tiveram o tipo alterado, pois não existe vínculo com edição.',
  alterados: [
    {
      polo_uuid: payload[0].polo_uuid,
      edicao_uuid: '33333333-3333-3333-3333-333333333333',
      tipo: 'oficial',
    },
  ],
  ignorados: [
    {
      polo_uuid: payload[1].polo_uuid,
      motivo: 'Polo sem vínculo com edição.',
    },
  ],
}

describe('alterarTipoEmMassa', () => {
  beforeEach(() => {
    apiPostMock.mockReset()
  })

  it('envia payload esperado e retorna o resultado da API', async () => {
    apiPostMock.mockResolvedValue({ data: resposta })

    await expect(alterarTipoEmMassa(payload)).resolves.toEqual(resposta)

    expect(apiPostMock).toHaveBeenCalledWith(
      '/api/v1/definicoes-polos/alterar-tipo-em-massa/',
      payload,
    )
  })

  it('lança erro quando a API retorna falha', async () => {
    apiPostMock.mockRejectedValue({
      response: {
        status: 400,
        data: { detalhe: 'Não foi possível alterar o tipo dos polos.' },
      },
    })

    await expect(alterarTipoEmMassa(payload)).rejects.toMatchObject({
      response: {
        data: { detalhe: 'Não foi possível alterar o tipo dos polos.' },
      },
    })
  })
})
