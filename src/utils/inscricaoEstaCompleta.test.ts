import { describe, expect, it } from 'vitest'
import {
  GRUPO_BERCARIO_I,
  TIPO_ESTUDANTE_REDE,
} from '@/components/participante/ParticipanteForm/constantes'
import type { FormValues } from '@/components/participante/ParticipanteForm/schema'
import { inscricaoEstaCompleta } from './inscricaoEstaCompleta'

function inscricaoCompleta(): FormValues {
  return {
    agrupamento: 'Berçário',
    tipoEstudante: TIPO_ESTUDANTE_REDE,
    codigoEol: '1234567',
    cpf: '12345678901',
    nomeCompleto: 'Ana',
    dataNascimento: '01/01/2018',
    nomeResponsavel: 'Maria',
    nomeSocialResponsavel: '',
    cep: '01001000',
    logradouro: 'Rua A',
    numero: '10',
    complemento: '',
    bairro: 'Centro',
    cidade: 'São Paulo',
    telefone1: '11999999999',
    telefone2: '',
    email: 'ana@email.com',
    dreCodigoEol: '108100',
    dreNome: 'DRE Butantã',
    polo: 'polo-1',
    grupoParticipante: GRUPO_BERCARIO_I,
    estaNaRede: 'Sim',
    tipoEscola: 'Estadual',
    unidadeEducacional: 'EMEI',
    turmaAno: 'Berçário',
    podeIrSozinho: 'Não',
    responsavelRetirada: 'Maria',
    autorizaPiscina: 'Sim',
    criancaDeficiencia: 'Não',
    criancaDeficienciaQual: '',
    problemaSaude: 'Não',
    problemaSaudeQual: '',
    medicacao: 'Não',
    medicacaoQual: '',
    restricaoMedicamento: 'Não',
    restricaoMedicamentoQual: '',
    convenioMedico: 'Sim',
    convenioMedicoQual: 'Amil',
  }
}

describe('inscricaoEstaCompleta', () => {
  it('aceita a inscrição com os obrigatórios preenchidos', () => {
    expect(inscricaoEstaCompleta(inscricaoCompleta())).toBe(true)
  })

  it('trata como incompleta quando um obrigatório está vazio', () => {
    expect(
      inscricaoEstaCompleta({ ...inscricaoCompleta(), email: '   ' }),
    ).toBe(false)
  })

  it('exige o Qual quando a resposta de saúde é Sim', () => {
    expect(
      inscricaoEstaCompleta({
        ...inscricaoCompleta(),
        convenioMedicoQual: '',
      }),
    ).toBe(false)
  })
})
