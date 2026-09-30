import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '../api/http'
import { cadastrarInscricao } from './cadastrarInscricao'
import type { DadosCadastroInscricao, Inscricao } from './types'

vi.mock('../api/http', () => ({
  api: { get: vi.fn(), post: vi.fn(), put: vi.fn() },
}))

const apiPostMock = vi.mocked(api.post)

const dadosInscricaoExemplo: DadosCadastroInscricao = {
  polo: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  tipoEstudante: 'ESTUDANTE_DA_REDE',
  grupo: 'BERCARIO_I',
  codigoEol: '1234567',
  cpf: '12345678901',
  nomeCompleto: 'Ana Souza',
  dataNascimento: '2020-03-15',
  nomeResponsavel: 'Maria Souza',
  nomeSocialResponsavel: '',
  cep: '05508000',
  logradouro: 'Exemplo',
  numero: '100',
  complemento: '',
  bairro: 'Centro',
  cidade: 'São Paulo',
  telefone1: '11999999999',
  telefone2: '',
  email: 'maria@example.com',
  dreCodigoEol: '108100',
  dreNome: 'DRE Butantã',
}

const payloadEsperado = {
  edicao: null,
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
} as const

const respostaCadastroExemplo: Inscricao = {
  uuid: '22222222-2222-2222-2222-222222222222',
  ...payloadEsperado,
  tipo_logradouro: '',
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
      payloadEsperado,
    )
  })

  it('envia nulo nos campos vazios e o tipo e o grupo informados', async () => {
    apiPostMock.mockResolvedValue({ data: respostaCadastroExemplo })

    await cadastrarInscricao({
      ...dadosInscricaoExemplo,
      polo: '   ',
      dataNascimento: '',
      tipoEstudante: 'ESTUDANTE_EXTERNO',
      grupo: 'MINI_GRUPO_I',
    })

    expect(apiPostMock).toHaveBeenCalledWith(
      '/api/v1/inscricoes/',
      expect.objectContaining({
        polo: null,
        data_nascimento: null,
        tipo_estudante: 'ESTUDANTE_EXTERNO',
        grupo: 'MINI_GRUPO_I',
      }),
    )
    expect(apiPostMock.mock.calls[0]?.[1]).not.toHaveProperty('tipo_logradouro')
  })

  it('não envia campos que ficam só no formulário', async () => {
    apiPostMock.mockResolvedValue({ data: respostaCadastroExemplo })

    const dados = {
      ...dadosInscricaoExemplo,
      agrupamento: 'Berçário',
    }

    await cadastrarInscricao(dados)

    const payload = apiPostMock.mock.calls[0][1]
    expect(payload).not.toHaveProperty('agrupamento')
    expect(payload).toMatchObject({ grupo: 'BERCARIO_I' })
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
