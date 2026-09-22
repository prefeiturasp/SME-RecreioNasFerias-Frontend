import { describe, it, expect, vi, beforeEach } from 'vitest'
import { listarDetalheDefinicaoPolo } from './listarDetalheDefinicaoPolo'
import { api } from '../api/http'
import type { DetalheDefinicaoPolo } from './types'

// Mock do módulo da API
vi.mock('../api/http', () => ({
  api: {
    get: vi.fn(),
  },
}))

describe('listarDetalheDefinicaoPolo', () => {
  const mockUuid = '123e4567-e89b-12d3-a456-426614174000'

  const mockDetalheDefinicaoPolo: DetalheDefinicaoPolo = {
    ativo: true,
    edicao: {
      uuid: 'edicao-uuid',
      nome: 'Edição Exemplo',
    },
    polo: {
      ativo: true,
      atualizado_em: '2024-06-01T00:00:00Z',
      bairro: 'Bairro Exemplo',
      cep: '12345-678',
      codigo_eol: 'EOL123',
      complemento: 'Complemento Exemplo',
      criado_em: '2024-06-01T00:00:00Z',
      dre_codigo_eol: 'DRE123',
      dre_nome: 'DRE Exemplo',
      email: 'polo@example.com',
      gestao: 'Gestão Exemplo',
      logradouro: 'Rua Exemplo',
      nome_gestor: 'Gestor Exemplo',
      nome_osc: 'OSC Exemplo',
      nome_polo: 'Polo Exemplo',
      numero: '123',
      observacoes_gerais: 'Observações gerais',
      quantidade_maxima_alunos: 100,
      status: 'Ativo',
      telefone: '1234-5678',
      tipo: 'Tipo Exemplo',
      tipo_logradouro: 'Tipo Logradouro Exemplo',
      tipo_ue: 'Tipo UE Exemplo',
      uuid: 'polo-uuid',
    },
    ponto_focal_nome: 'Renato Silva',
    ponto_focal_telefone: '1234-5678',
    ponto_focal_email: 'renato@example.com',
    projecao_inscritos: 50,
    total_inscritos: 45,
    tipo: 'Tipo Exemplo',
    uuid: mockUuid,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve fazer uma requisição GET para o endpoint correto e retornar os dados', async () => {
    // Configura o mock da API para retornar os dados esperados
    vi.mocked(api.get).mockResolvedValueOnce({
      data: mockDetalheDefinicaoPolo,
    })

    const resultado = await listarDetalheDefinicaoPolo(mockUuid)

    // Verifica se a API foi chamada com a URL correta incluindo o UUID
    expect(api.get).toHaveBeenCalledTimes(1)
    expect(api.get).toHaveBeenCalledWith(
      `/api/v1/definicoes-polos/${mockUuid}/`,
    )

    // Verifica se a função retornou os dados corretamente
    expect(resultado).toEqual(mockDetalheDefinicaoPolo)
  })

  it('deve propagar o erro caso a requisição da API falhe', async () => {
    const mockError = new Error('Erro ao buscar dados')
    vi.mocked(api.get).mockRejectedValueOnce(mockError)

    // Verifica se a função repassa o erro corretamente
    await expect(listarDetalheDefinicaoPolo(mockUuid)).rejects.toThrow(
      'Erro ao buscar dados',
    )

    expect(api.get).toHaveBeenCalledWith(
      `/api/v1/definicoes-polos/${mockUuid}/`,
    )
  })
})
