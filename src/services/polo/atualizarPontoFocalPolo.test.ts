import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '../api/http'
import { atualizarPontoFocalPolo } from './atualizarPontoFocalPolo'
import type { DadosPontoFocalPolo, PoloDetalhado } from './types'

vi.mock('../api/http', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
  },
}))

const apiPatchMock = vi.mocked(api.patch)

const poloUuid = 'polo-uuid-123'

const dadosPontoFocal: DadosPontoFocalPolo = {
  ponto_focal_nome: '  Maria Silva  ',
  ponto_focal_telefone: ' (11) 99999-9999 ',
  ponto_focal_email: ' focal@example.com ',
}

const poloAtualizado: PoloDetalhado = {
  uuid: poloUuid,
  codigo_eol: '123456',
  nome_polo: 'EMEF Exemplo',
  nome_osc: '',
  dre_nome: 'DRE Exemplo',
  dre_codigo_eol: '000001',
  tipo: 'pendente',
  status: 'ativo',
  gestao: 'direta',
  tipo_ue: 'EMEF',
  quantidade_maxima_alunos: 100,
  cep: '01000-000',
  tipo_logradouro: 'Rua',
  logradouro: 'Exemplo',
  bairro: 'Centro',
  numero: '10',
  complemento: '',
  nome_gestor: 'João Gestor',
  email: 'gestor@example.com',
  telefone: '(11) 3333-4444',
  ponto_focal_nome: 'Maria Silva',
  ponto_focal_telefone: '(11) 99999-9999',
  ponto_focal_email: 'focal@example.com',
  observacoes_gerais: '',
  endereco_completo: 'Rua Exemplo, 10 - Centro',
  ativo: true,
  criado_em: '2026-01-01T10:00:00Z',
  atualizado_em: '2026-01-02T10:00:00Z',
}

describe('atualizarPontoFocalPolo', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('atualiza o Ponto Focal do Polo e retorna os dados recebidos pela API', async () => {
    apiPatchMock.mockResolvedValue({ data: poloAtualizado })

    await expect(
      atualizarPontoFocalPolo(poloUuid, dadosPontoFocal),
    ).resolves.toEqual(poloAtualizado)

    expect(apiPatchMock).toHaveBeenCalledTimes(1)
    expect(apiPatchMock).toHaveBeenCalledWith(
      `/api/v1/polos/${poloUuid}/`,
      {
        ponto_focal_nome: 'Maria Silva',
        ponto_focal_telefone: '(11) 99999-9999',
        ponto_focal_email: 'focal@example.com',
      },
    )
  })

  it('propaga o erro quando a API não consegue atualizar o Polo', async () => {
    const erro = new Error('Falha ao atualizar o Polo')
    apiPatchMock.mockRejectedValue(erro)

    await expect(
      atualizarPontoFocalPolo(poloUuid, dadosPontoFocal),
    ).rejects.toBe(erro)
  })
})
