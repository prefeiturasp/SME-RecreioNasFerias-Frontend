import { describe, expect, it } from 'vitest'
import formSchema from './schema'

const vazio = {
  grupo: '',
  tipoEstudante: '',
  codigoEol: '',
  cpf: '',
  nomeCompleto: '',
  dataNascimento: '',
  nomeResponsavel: '',
  nomeSocialResponsavel: '',
  cep: '',
  logradouro: '',
  tipoLogradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  telefone1: '',
  telefone2: '',
  email: '',
  dreCodigoEol: '',
  polo: '',
  criancaComDeficiencia: 'nao',
  qualDeficiencia: [],
  outraDeficiencia: '',
  criancaComProblemaSaude: 'nao',
  qualProblemaSaude: [],
  outroProblemaSaude: '',
  medicacaoTratamentoContinuo: 'nao',
  qualMedicacaoTratamentoContinuo: '',
  restricaoMedicamentoProntoAtendimento: 'nao',
  qualRestricaoMedicamentoProntoAtendimento: '',
  temConvenioMedico: 'nao',
  qualConvenioMedico: '',
}

describe('ParticipanteForm schema', () => {
  it('aceita o formulário vazio', () => {
    expect(formSchema.safeParse(vazio).success).toBe(true)
  })

  it('exige uma resposta explícita em todas as perguntas de saúde', () => {
    const resultado = formSchema.safeParse({
      ...vazio,
      criancaComDeficiencia: '',
      criancaComProblemaSaude: '',
      medicacaoTratamentoContinuo: '',
      restricaoMedicamentoProntoAtendimento: '',
      temConvenioMedico: '',
    })

    expect(resultado.success).toBe(false)
    if (resultado.success) return
    expect(resultado.error.issues.map((issue) => issue.path[0])).toEqual(
      expect.arrayContaining([
        'criancaComDeficiencia',
        'criancaComProblemaSaude',
        'medicacaoTratamentoContinuo',
        'restricaoMedicamentoProntoAtendimento',
        'temConvenioMedico',
      ]),
    )
  })

  it('rejeita CPF incompleto', () => {
    const resultado = formSchema.safeParse({ ...vazio, cpf: '123' })
    expect(resultado.success).toBe(false)
    if (resultado.success) return
    expect(resultado.error.issues.map((issue) => issue.message)).toContain(
      'Informe um CPF válido.',
    )
  })

  it('rejeita CPF com máscara', () => {
    expect(
      formSchema.safeParse({ ...vazio, cpf: '123.456.789-01' }).success,
    ).toBe(false)
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

  it.each([
    ['criancaComDeficiencia', 'qualDeficiencia'],
    ['criancaComProblemaSaude', 'qualProblemaSaude'],
    ['medicacaoTratamentoContinuo', 'qualMedicacaoTratamentoContinuo'],
    [
      'restricaoMedicamentoProntoAtendimento',
      'qualRestricaoMedicamentoProntoAtendimento',
    ],
    ['temConvenioMedico', 'qualConvenioMedico'],
  ] as const)(
    'exige %s quando marcado como sim',
    (campoRadio, campoDependente) => {
      const resultado = formSchema.safeParse({
        ...vazio,
        [campoRadio]: 'sim',
      })

      expect(resultado.success).toBe(false)
      if (resultado.success) return
      expect(resultado.error.issues.map((issue) => issue.path[0])).toContain(
        campoDependente,
      )
    },
  )

  it.each([
    ['OUTRO', 'outraDeficiencia'],
    ['OUTRA', 'outraDeficiencia'],
    ['OUTRO', 'outroProblemaSaude'],
    ['OUTRA', 'outroProblemaSaude'],
  ] as const)(
    'exige %s preenchido quando a opção de outro valor é selecionada',
    (opcaoOutro, campoDependente) => {
      const campoSelect =
        campoDependente === 'outraDeficiencia'
          ? 'qualDeficiencia'
          : 'qualProblemaSaude'
      const campoRadio =
        campoDependente === 'outraDeficiencia'
          ? 'criancaComDeficiencia'
          : 'criancaComProblemaSaude'
      const resultado = formSchema.safeParse({
        ...vazio,
        [campoRadio]: 'sim',
        [campoSelect]: [
          {
            value: opcaoOutro,
            label: opcaoOutro === 'OUTRA' ? 'Outra' : 'Outro',
          },
        ],
      })

      expect(resultado.success).toBe(false)
      if (resultado.success) return
      expect(resultado.error.issues.map((issue) => issue.path[0])).toContain(
        campoDependente,
      )
    },
  )

  it('aceita campos de saúde vazios quando não estão marcados como sim', () => {
    expect(formSchema.safeParse(vazio).success).toBe(true)
  })
})
