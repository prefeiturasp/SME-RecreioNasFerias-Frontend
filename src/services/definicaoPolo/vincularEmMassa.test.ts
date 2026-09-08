import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '../api/http'
import { vincularEmMassa } from './vincularEmMassa'
import type { DefinicaoPolo } from './types'

vi.mock('../api/http', () => ({
  api: { post: vi.fn() },
}))

const apiPostMock = vi.mocked(api.post)

const dados = {
  polos: [
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
  ],
  edicao: '33333333-3333-3333-3333-333333333333',
}

const resposta: DefinicaoPolo[] = [
  {
    uuid: '44444444-4444-4444-4444-444444444444',
    polo: dados.polos[0],
    edicao: dados.edicao,
    tipo: 'pendente',
    projecao_inscritos: 0,
    total_inscritos: 0,
    ponto_focal_nome: '',
    ponto_focal_telefone: '',
    ponto_focal_email: '',
    ativo: true,
    criado_em: '2026-09-08T19:16:43.873Z',
    atualizado_em: '2026-09-08T19:16:43.873Z',
  },
]

describe('vincularEmMassa', () => {
  beforeEach(() => {
    apiPostMock.mockReset()
  })

  it('envia payload esperado e retorna as definições vinculadas', async () => {
    apiPostMock.mockResolvedValue({ data: resposta })

    await expect(vincularEmMassa(dados)).resolves.toEqual(resposta)

    expect(apiPostMock).toHaveBeenCalledWith(
      '/api/v1/definicoes-polos/vincular-em-massa/',
      {
        polos: dados.polos,
        edicao: dados.edicao,
        projecao_inscritos: 0,
      },
    )
  })

  it('lança erro quando a API retorna falha', async () => {
    apiPostMock.mockRejectedValue({
      response: {
        status: 400,
        data: { detalhe: 'Não foi possível vincular os polos à edição.' },
      },
    })

    await expect(vincularEmMassa(dados)).rejects.toMatchObject({
      response: {
        data: { detalhe: 'Não foi possível vincular os polos à edição.' },
      },
    })
  })
})
