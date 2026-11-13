import { describe, expect, it } from 'vitest'
import { corpoInscricao } from './corpoInscricao'
import type { DadosCadastroInscricao } from './types'

const dados: DadosCadastroInscricao = {
  polo: 'polo-1',
  tipoEstudante: 'ESTUDANTE_DA_REDE',
  grupo: 'BERCARIO_I',
  codigoEol: '1234567',
  cpf: '12345678901',
  cpf_participante: '',
  nomeCompleto: 'Ana Souza',
  dataNascimento: '2020-03-15',
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
  podeIrEmboraSozinho: 'sim',
  responsavelRetirada: 'Maria Souza',
  autorizaUsoPiscina: 'nao',
  tipoEscola: '',
}

describe('corpoInscricao', () => {
  it('monta o corpo com os nomes do contrato', () => {
    expect(corpoInscricao(dados)).toMatchObject({
      edicao: null,
      polo: 'polo-1',
      nome_participante: 'Ana Souza',
      data_nascimento: '2020-03-15',
      tipo_logradouro: 'Rua',
      pode_ir_embora_sozinho: true,
      autoriza_uso_piscina: false,
    })
  })

  it('envia nulo quando polo, nascimento ou sim/não estão vazios', () => {
    expect(
      corpoInscricao({
        ...dados,
        polo: '   ',
        dataNascimento: '  ',
        tipoLogradouro: '',
        podeIrEmboraSozinho: '',
        autorizaUsoPiscina: '',
      }),
    ).toMatchObject({
      polo: null,
      data_nascimento: null,
      tipo_logradouro: 'N/I',
      pode_ir_embora_sozinho: null,
      autoriza_uso_piscina: null,
    })
  })
})
