import { describe, expect, it } from 'vitest'
import formSchema, { formSchemaRascunho } from './schema'
import { MENSAGEM_DUPLICIDADE_CPF_PARTICIPANTE } from './constantes'

const vazio = {
  grupo: '',
  tipoEstudante: '',
  codigoEol: '',
  cpf: '',
  cpf_participante: '',
  possuiInscricaoCpfParticipante: false,
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
  unidadeEducacional: '',
  unidadeEducacionalCodigoEol: '',
  unidadeEducacionalTipo: '',
  nomeTurma: '',
  ano: '',
  podeIrEmboraSozinho: '',
  responsavelRetirada: '',
  autorizaUsoPiscina: '',
}

describe('ParticipanteForm schema', () => {
  it('aceita o formulário vazio apenas como rascunho', () => {
    expect(formSchemaRascunho.safeParse(vazio).success).toBe(true)
  })

  it.each([
    ['sem CPF nem código EOL', ''],
    ['com código EOL incompleto', '12345'],
  ])('exige CPF ou código EOL válido %s', (_descricao, codigoEol) => {
    const resultado = formSchema.safeParse({ ...vazio, codigoEol })

    expect(resultado.success).toBe(false)
    if (resultado.success) return
    expect(resultado.error.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: ['codigoEol'],
          message: 'Informe um CPF ou código EOL válido.',
        }),
        expect.objectContaining({
          path: ['cpf'],
          message: 'Informe um CPF ou código EOL válido.',
        }),
      ]),
    )
  })

  it.each([
    ['CPF', { cpf: '12345678901' }],
    ['código EOL', { codigoEol: '123456' }],
    ['código EOL com sete dígitos', { codigoEol: '1234567' }],
  ])('aceita identificação por %s', (_descricao, identificador) => {
    expect(
      formSchema.safeParse({
        ...vazio,
        grupo: 'grupo',
        tipoEstudante: 'estudante',
        telefone1: '11999999999',
        email: 'ana@email.com',
        dreCodigoEol: 'dre',
        polo: 'polo',
        ...identificador,
      }).success,
    ).toBe(true)
  })

  it('exige o CPF do participante externo e não exige a identificação EOL', () => {
    const resultado = formSchema.safeParse({
      ...vazio,
      grupo: 'QUATRO_A_14_ANOS',
      tipoEstudante: 'ESTUDANTE_EXTERNO',
      cpf_participante: '12345678901',
      nomeCompleto: 'Ana Souza',
      dataNascimento: '2018-01-01',
      cpf: '12345678901',
      nomeResponsavel: 'Maria Souza',
      cep: '01001000',
      logradouro: 'Praça da Sé',
      numero: '1',
      bairro: 'Sé',
      cidade: 'São Paulo',
      telefone1: '11999999999',
      email: 'ana@email.com',
      dreCodigoEol: 'dre',
      polo: 'polo',
    })

    expect(resultado.success).toBe(true)
  })

  it('rejeita CPF de estudante externo com inscrição na edição vigente', () => {
    const resultado = formSchema.safeParse({
      ...vazio,
      tipoEstudante: 'ESTUDANTE_EXTERNO',
      cpf_participante: '12345678901',
      possuiInscricaoCpfParticipante: true,
    })

    expect(resultado.success).toBe(false)
    if (resultado.success) return
    expect(resultado.error.issues).toContainEqual(
      expect.objectContaining({
        path: ['cpf_participante'],
        message: MENSAGEM_DUPLICIDADE_CPF_PARTICIPANTE,
      }),
    )
  })

  it.each([
    ['', 'Este campo é obrigatório.'],
    ['123', 'Informe um CPF válido.'],
  ])(
    'mantém os erros de CPF e duplicidade para estudante externo com CPF %s',
    (cpfParticipante, mensagem) => {
      const resultado = formSchema.safeParse({
        ...vazio,
        tipoEstudante: 'ESTUDANTE_EXTERNO',
        cpf_participante: cpfParticipante,
        possuiInscricaoCpfParticipante: true,
      })

      expect(resultado.success).toBe(false)
      if (resultado.success) return
      expect(
        resultado.error.issues
          .filter(
            (issue) =>
              issue.code === 'custom' && issue.path[0] === 'cpf_participante',
          )
          .map((issue) => issue.message),
      ).toEqual([mensagem, MENSAGEM_DUPLICIDADE_CPF_PARTICIPANTE])
    },
  )

  it('exige todos os dados de identificação do estudante externo na ordem prevista', () => {
    const resultado = formSchema.safeParse({
      ...vazio,
      tipoEstudante: 'ESTUDANTE_EXTERNO',
      cpf_participante: '12345678901',
    })

    expect(resultado.success).toBe(false)
    if (resultado.success) return
    expect(
      resultado.error.issues
        .filter((issue) =>
          [
            'nomeCompleto',
            'dataNascimento',
            'cpf',
            'nomeResponsavel',
            'cep',
            'logradouro',
            'numero',
            'bairro',
            'cidade',
          ].includes(String(issue.path[0])),
        )
        .map((issue) => [issue.path[0], issue.message]),
    ).toEqual(
      [
        'nomeCompleto',
        'dataNascimento',
        'cpf',
        'nomeResponsavel',
        'cep',
        'logradouro',
        'numero',
        'bairro',
        'cidade',
      ].map((campo) => [campo, 'Este campo é obrigatório.']),
    )
  })

  it('exige CPF do participante somente para estudante externo', () => {
    const resultado = formSchema.safeParse({
      ...vazio,
      tipoEstudante: 'ESTUDANTE_EXTERNO',
      cpf_participante: '',
    })

    expect(resultado.success).toBe(false)
    if (resultado.success) return
    expect(resultado.error.issues).toContainEqual(
      expect.objectContaining({
        path: ['cpf_participante'],
        message: 'Este campo é obrigatório.',
      }),
    )
    const caminhosDosErros = resultado.error.issues.map(
      (issue) => issue.path[0],
    )
    expect(caminhosDosErros).not.toContain('codigoEol')
    expect(caminhosDosErros).toContain('cpf')
  })

  it.each(['codigoEol', 'cpf'] as const)(
    'exige telefone, e-mail, DRE e polo após consulta por %s',
    (campoConsulta) => {
      const resultado = formSchema.safeParse({
        ...vazio,
        [campoConsulta]: campoConsulta === 'cpf' ? '12345678901' : '123456',
      })

      expect(resultado.success).toBe(false)
      if (resultado.success) return
      expect(resultado.error.issues.map((issue) => issue.path[0])).toEqual(
        expect.arrayContaining(['telefone1', 'email', 'dreCodigoEol', 'polo']),
      )
    },
  )

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
    expect(
      formSchemaRascunho.safeParse({ ...vazio, cpf: '12345678901' }).success,
    ).toBe(true)
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
      formSchemaRascunho.safeParse({ ...vazio, telefone1: '1133334444' })
        .success,
    ).toBe(true)
    expect(
      formSchemaRascunho.safeParse({ ...vazio, telefone2: '(11) 99999-9999' })
        .success,
    ).toBe(true)
  })

  it('rejeita e-mail preenchido em formato inválido', () => {
    const resultado = formSchema.safeParse({ ...vazio, email: 'ana' })
    expect(resultado.success).toBe(false)
  })

  it('aceita e-mail preenchido em formato válido', () => {
    expect(
      formSchemaRascunho.safeParse({ ...vazio, email: 'ana@email.com' })
        .success,
    ).toBe(true)
  })

  it('grava o e-mail em minúsculas', () => {
    const resultado = formSchemaRascunho.safeParse({
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
    expect(formSchemaRascunho.safeParse(vazio).success).toBe(true)
  })

  it('aceita informações por grupo vazias no rascunho da rede', () => {
    expect(
      formSchemaRascunho.safeParse({
        ...vazio,
        tipoEstudante: 'ESTUDANTE_DA_REDE',
      }).success,
    ).toBe(true)
  })

  it('exige saída, retirada e piscina ao finalizar estudante da rede', () => {
    const resultado = formSchema.safeParse({
      ...vazio,
      grupo: 'BERCARIO_I',
      tipoEstudante: 'ESTUDANTE_DA_REDE',
      cpf: '12345678901',
      telefone1: '11999999999',
      email: 'ana@email.com',
      dreCodigoEol: 'dre',
      polo: 'polo',
      responsavelRetirada: '   ',
    })

    expect(resultado.success).toBe(false)
    if (resultado.success) return
    expect(resultado.error.issues.map((issue) => issue.path[0])).toEqual(
      expect.arrayContaining([
        'podeIrEmboraSozinho',
        'responsavelRetirada',
        'autorizaUsoPiscina',
      ]),
    )
  })

  it('aceita a finalização da rede com as respostas da seção', () => {
    expect(
      formSchema.safeParse({
        ...vazio,
        grupo: 'BERCARIO_I',
        tipoEstudante: 'ESTUDANTE_DA_REDE',
        cpf: '12345678901',
        telefone1: '11999999999',
        email: 'ana@email.com',
        dreCodigoEol: 'dre',
        polo: 'polo',
        podeIrEmboraSozinho: 'nao',
        responsavelRetirada: 'Maria Fernanda Santos',
        autorizaUsoPiscina: 'sim',
      }).success,
    ).toBe(true)
  })

  it('rejeita a finalização com idade igual ou superior a 15 anos', () => {
    const dataNascimento = `${new Date().getFullYear() - 16}-01-01`
    const resultado = formSchema.safeParse({
      ...vazio,
      dataNascimento,
    })

    expect(resultado.success).toBe(false)
    if (resultado.success) return
    expect(resultado.error.issues).toContainEqual(
      expect.objectContaining({
        path: ['dataNascimento'],
        message:
          'A data de nascimento informada excede a faixa etária permitida para participação no Recreio nas Férias.',
      }),
    )
  })

  it('mantém a validação de idade fora do rascunho', () => {
    const dataNascimento = `${new Date().getFullYear() - 16}-01-01`
    expect(
      formSchemaRascunho.safeParse({ ...vazio, dataNascimento }).success,
    ).toBe(true)
  })

  it('não exige informações por grupo de quem não é estudante da rede', () => {
    expect(
      formSchema.safeParse({
        ...vazio,
        grupo: 'QUATRO_A_14_ANOS',
        tipoEstudante: 'ESTUDANTE_EXTERNO',
        cpf_participante: '12345678901',
        nomeCompleto: 'Ana Souza',
        dataNascimento: '2018-01-01',
        cpf: '12345678901',
        nomeResponsavel: 'Maria Souza',
        cep: '01001000',
        logradouro: 'Praça da Sé',
        numero: '1',
        bairro: 'Sé',
        cidade: 'São Paulo',
        telefone1: '11999999999',
        email: 'ana@email.com',
        dreCodigoEol: 'dre',
        polo: 'polo',
      }).success,
    ).toBe(true)
  })
})
