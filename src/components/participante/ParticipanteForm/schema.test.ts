import { describe, expect, it } from 'vitest'
import formSchema from './schema'

const vazio = {
  agrupamento: '',
  tipoEstudante: '',
  codigoEol: '',
  cpf: '',
  nomeCompleto: '',
  dataNascimento: '',
  nomeResponsavel: '',
  nomeSocialResponsavel: '',
  cep: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  telefone1: '',
  telefone2: '',
  email: '',
  dreCodigoEol: '',
  polo: '',
  grupoParticipante: '',
  estaNaRede: '',
  tipoEscola: '',
  unidadeEducacional: '',
  turmaAno: '',
  podeIrSozinho: '',
  responsavelRetirada: '',
  autorizaPiscina: '',
  criancaDeficiencia: '',
  criancaDeficienciaQual: '',
  problemaSaude: '',
  problemaSaudeQual: '',
  medicacao: '',
  medicacaoQual: '',
  restricaoMedicamento: '',
  restricaoMedicamentoQual: '',
  convenioMedico: '',
  convenioMedicoQual: '',
}

describe('ParticipanteForm schema', () => {
  it('aceita o formulário vazio', () => {
    expect(formSchema.safeParse(vazio).success).toBe(true)
  })

  it('rejeita CPF incompleto', () => {
    const resultado = formSchema.safeParse({ ...vazio, cpf: '123' })
    expect(resultado.success).toBe(false)
  })

  it('aceita CPF com 11 dígitos', () => {
    expect(formSchema.safeParse({ ...vazio, cpf: '12345678901' }).success).toBe(
      true,
    )
  })

  it('rejeita telefone incompleto', () => {
    expect(formSchema.safeParse({ ...vazio, telefone1: '123' }).success).toBe(
      false,
    )
    expect(formSchema.safeParse({ ...vazio, telefone2: '123' }).success).toBe(
      false,
    )
  })

  it('aceita telefone com 10 ou 11 dígitos', () => {
    expect(
      formSchema.safeParse({ ...vazio, telefone1: '1133334444' }).success,
    ).toBe(true)
    expect(
      formSchema.safeParse({ ...vazio, telefone2: '(11) 99999-9999' }).success,
    ).toBe(true)
  })

  it('rejeita e-mail preenchido em formato inválido', () => {
    const resultado = formSchema.safeParse({ ...vazio, email: 'ana' })
    expect(resultado.success).toBe(false)
  })

  it('aceita e-mail preenchido em formato válido', () => {
    expect(
      formSchema.safeParse({ ...vazio, email: 'ana@email.com' }).success,
    ).toBe(true)
  })

  it('grava o e-mail em minúsculas', () => {
    const resultado = formSchema.safeParse({
      ...vazio,
      email: ' Ana@Email.com ',
    })
    expect(resultado.success && resultado.data.email).toBe('ana@email.com')
  })
})
