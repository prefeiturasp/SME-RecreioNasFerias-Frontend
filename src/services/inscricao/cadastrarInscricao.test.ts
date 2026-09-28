import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '../api/http'
import { cadastrarInscricao } from './cadastrarInscricao'
import type { DadosCadastroInscricao, Inscricao } from './types'

vi.mock('../api/http', () => ({
  api: { get: vi.fn(), post: vi.fn(), put: vi.fn() },
}))

const apiPostMock = vi.mocked(api.post)

const dadosInscricaoExemplo: DadosCadastroInscricao = {
  edicao: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  polo: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  tipo_estudante: 'ESTUDANTE_DA_REDE',
  grupo: 'BERCARIO_I',
  codigo_eol: '1234567',
  cpf: '12345678901',
  nome_participante: 'Ana Souza',
  data_nascimento: '2020-03-15',
  responsavel_nome: 'Maria Souza',
  responsavel_nome_social: '',
  cep: '05508000',
  tipo_logradouro: 'Rua',
  logradouro: 'Exemplo',
  numero: '100',
  complemento: '',
  bairro: 'Centro',
  cidade: 'São Paulo',
  telefone_contato_1: '11999999999',
  telefone_contato_2: '',
  email: 'maria@example.com',
  dre_codigo_eol: '108100',
  dre_nome: 'DRE Butantã',
}

const respostaCadastroExemplo: Inscricao = {
  uuid: '22222222-2222-2222-2222-222222222222',
  ...dadosInscricaoExemplo,
  tipo_estudante_label: 'Estudante da rede',
  grupo_label: 'Berçário I',
  status: 'RASCUNHO',
  status_label: 'Rascunho',
  ativo: true,
}

describe('cadastrarInscricao', () => {
  beforeEach(() => {
    apiPostMock.mockReset()
  })

  it('envia payload esperado e retorna a inscrição criada', async () => {
    apiPostMock.mockResolvedValue({ data: respostaCadastroExemplo })

    await expect(cadastrarInscricao(dadosInscricaoExemplo)).resolves.toEqual(
      respostaCadastroExemplo,
    )

    expect(apiPostMock).toHaveBeenCalledTimes(1)
    expect(apiPostMock).toHaveBeenCalledWith(
      '/api/v1/inscricoes/',
      dadosInscricaoExemplo,
    )
  })

  it('lança erro quando a API retorna falha no cadastro', async () => {
    apiPostMock.mockRejectedValue({
      response: {
        status: 400,
        data: {
          detalhe:
            'Já existe inscrição com o identificador informado neste polo.',
        },
      },
    })

    await expect(
      cadastrarInscricao(dadosInscricaoExemplo),
    ).rejects.toMatchObject({
      response: {
        data: {
          detalhe:
            'Já existe inscrição com o identificador informado neste polo.',
        },
      },
    })
  })

  it('não inventa mensagem quando o corpo de erro está vazio', async () => {
    apiPostMock.mockRejectedValue({ response: { status: 500, data: {} } })

    await expect(
      cadastrarInscricao(dadosInscricaoExemplo),
    ).rejects.toMatchObject({
      response: { data: {} },
    })
  })
})
