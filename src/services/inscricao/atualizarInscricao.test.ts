import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '../api/http'
import { atualizarInscricao } from './atualizarInscricao'
import type { DadosCadastroInscricao, Inscricao } from './types'

vi.mock('../api/http', () => ({
  api: { get: vi.fn(), post: vi.fn(), put: vi.fn() },
}))

const apiPutMock = vi.mocked(api.put)

const uuidInscricao = '22222222-2222-2222-2222-222222222222'

const dadosInscricaoExemplo: DadosCadastroInscricao = {
  polo: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  tipoEstudante: 'ESTUDANTE_DA_REDE',
  grupo: 'QUATRO_A_14_ANOS',
  codigoEol: '1234567',
  cpf: '12345678901',
  cpf_participante: '',
  nomeCompleto: 'Ana Souza',
  dataNascimento: '2019-05-16',
  nomeResponsavel: 'Maria Souza',
  nomeSocialResponsavel: '',
  cep: '05508000',
  logradouro: 'Exemplo',
  tipoLogradouro: 'Rua',
  numero: '100',
  complemento: '',
  bairro: 'Centro',
  cidade: 'São Paulo',
  telefone1: '11999999999',
  telefone2: '',
  email: 'maria@example.com',
  dreCodigoEol: '108100',
  dreNome: 'DRE Butantã',
  possui_deficiencia: false,
  deficiencias: [],
  outra_deficiencia: '',
  possui_problema_saude: false,
  problemas_saude: [],
  outro_problema_saude: '',
  usuario_medicacao_ou_tratamento_continuo: false,
  medicacao_ou_tratamento_continuo: '',
  possui_restricao_medicamento_pronto_atendimento: false,
  restricao_medicamento_pronto_atendimento: '',
  possui_convenio_medico: false,
  convenio_medico: '',
  unidadeEducacional: 'EMEF Teste',
  unidadeEducacionalCodigoEol: '094633',
  unidadeEducacionalTipo: 'EMEF',
  nomeTurma: '7C',
  ano: '7',
  podeIrEmboraSozinho: 'nao',
  responsavelRetirada: 'Maria Souza',
  autorizaUsoPiscina: 'sim',
  tipoEscola: '',
}

const respostaAtualizacaoExemplo = {
  uuid: uuidInscricao,
  status: 'COMPLETA',
  status_label: 'Completa',
} as Inscricao

describe('atualizarInscricao', () => {
  beforeEach(() => {
    apiPutMock.mockReset()
  })

  it('envia o payload no PUT da inscrição e devolve a resposta', async () => {
    apiPutMock.mockResolvedValue({ data: respostaAtualizacaoExemplo })

    await expect(
      atualizarInscricao(uuidInscricao, dadosInscricaoExemplo),
    ).resolves.toEqual(respostaAtualizacaoExemplo)

    expect(apiPutMock).toHaveBeenCalledWith(
      `/api/v1/inscricoes/${uuidInscricao}/`,
      expect.objectContaining({
        codigo_eol: '1234567',
        polo: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        unidade_educacional: 'EMEF Teste',
        unidade_educacional_codigo_eol: '094633',
        unidade_educacional_tipo: 'EMEF',
        pode_ir_embora_sozinho: false,
        autoriza_uso_piscina: true,
        tipo_escola: '',
      }),
    )
  })

  it('envia nulo quando polo, nascimento e respostas de grupo estão vazios', async () => {
    apiPutMock.mockResolvedValue({ data: respostaAtualizacaoExemplo })

    await atualizarInscricao(uuidInscricao, {
      ...dadosInscricaoExemplo,
      polo: '   ',
      dataNascimento: '',
      podeIrEmboraSozinho: '',
      autorizaUsoPiscina: '',
      tipoLogradouro: '',
    })

    expect(apiPutMock).toHaveBeenCalledWith(
      `/api/v1/inscricoes/${uuidInscricao}/`,
      expect.objectContaining({
        polo: null,
        data_nascimento: null,
        pode_ir_embora_sozinho: null,
        autoriza_uso_piscina: null,
        tipo_logradouro: 'N/I',
      }),
    )
  })

  it('lança erro quando a API recusa a atualização', async () => {
    apiPutMock.mockRejectedValue({
      response: {
        status: 400,
        data: { detalhe: 'Polo informado não pertence à DRE.' },
      },
    })

    await expect(
      atualizarInscricao(uuidInscricao, dadosInscricaoExemplo),
    ).rejects.toMatchObject({
      response: {
        data: { detalhe: 'Polo informado não pertence à DRE.' },
      },
    })
  })
})
