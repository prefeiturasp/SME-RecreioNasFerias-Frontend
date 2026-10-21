import { z } from 'zod'

import { extrairDigitos } from '@/utils/mascarasEntrada'

const telefone = z
  .string()
  .trim()
  .refine((valor) => {
    if (valor === '') return true
    const quantidade = extrairDigitos(valor).length
    return quantidade === 10 || quantidade === 11
  }, 'Informe um telefone válido.')

export const formSchemaRascunho = z.object({
  grupo: z.string(),
  tipoEstudante: z.string(),
  codigoEol: z.string(),
  cpf: z.string().regex(/^(\d{11})?$/, 'Informe um CPF válido.'),
  nomeCompleto: z.string(),
  dataNascimento: z.string(),
  nomeResponsavel: z.string(),
  nomeSocialResponsavel: z.string(),
  cep: z.string(),
  logradouro: z.string(),
  numero: z.string(),
  complemento: z.string(),
  bairro: z.string(),
  cidade: z.string(),
  telefone1: telefone,
  telefone2: telefone,
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(
      z.union([z.literal(''), z.email({ error: 'Digite um e-mail válido.' })]),
    ),
  dreCodigoEol: z.string(),
  polo: z.string(),
  criancaComDeficiencia: z.enum(['sim', 'nao', '']),
  qualDeficiencia: z.array(z.object({ value: z.string(), label: z.string() })),
  outraDeficiencia: z.string(),
  criancaComProblemaSaude: z.enum(['sim', 'nao', '']),
  qualProblemaSaude: z.array(
    z.object({ value: z.string(), label: z.string() }),
  ),
  outroProblemaSaude: z.string().max(300),
  medicacaoTratamentoContinuo: z.enum(['sim', 'nao', '']),
  qualMedicacaoTratamentoContinuo: z.string(),
  restricaoMedicamentoProntoAtendimento: z.enum(['sim', 'nao', '']),
  qualRestricaoMedicamentoProntoAtendimento: z.string(),
  temConvenioMedico: z.enum(['sim', 'nao', '']),
  qualConvenioMedico: z.string(),
})

const formSchema = formSchemaRascunho.superRefine((dados, contexto) => {
  const camposObrigatorios = [
    {
      condicao: !dados.criancaComDeficiencia,
      preenchido: false,
      caminho: 'criancaComDeficiencia',
    },
    {
      condicao: !dados.criancaComProblemaSaude,
      preenchido: false,
      caminho: 'criancaComProblemaSaude',
    },
    {
      condicao: !dados.medicacaoTratamentoContinuo,
      preenchido: false,
      caminho: 'medicacaoTratamentoContinuo',
    },
    {
      condicao: !dados.restricaoMedicamentoProntoAtendimento,
      preenchido: false,
      caminho: 'restricaoMedicamentoProntoAtendimento',
    },
    {
      condicao: !dados.temConvenioMedico,
      preenchido: false,
      caminho: 'temConvenioMedico',
    },
    {
      condicao: dados.criancaComDeficiencia === 'sim',
      preenchido: dados.qualDeficiencia.length > 0,
      caminho: 'qualDeficiencia',
    },
    {
      condicao: dados.criancaComProblemaSaude === 'sim',
      preenchido: dados.qualProblemaSaude.length > 0,
      caminho: 'qualProblemaSaude',
    },
    {
      condicao: dados.medicacaoTratamentoContinuo === 'sim',
      preenchido: Boolean(dados.qualMedicacaoTratamentoContinuo.trim()),
      caminho: 'qualMedicacaoTratamentoContinuo',
    },
    {
      condicao: dados.restricaoMedicamentoProntoAtendimento === 'sim',
      preenchido: Boolean(
        dados.qualRestricaoMedicamentoProntoAtendimento.trim(),
      ),
      caminho: 'qualRestricaoMedicamentoProntoAtendimento',
    },
    {
      condicao: dados.temConvenioMedico === 'sim',
      preenchido: Boolean(dados.qualConvenioMedico.trim()),
      caminho: 'qualConvenioMedico',
    },
    {
      condicao:
        dados.criancaComDeficiencia === 'sim' &&
        dados.qualDeficiencia.some((opcao) =>
          ['outro', 'outra'].includes(
            opcao.label.trim().toLocaleLowerCase('pt-BR'),
          ),
        ),
      preenchido: Boolean(dados.outraDeficiencia.trim()),
      caminho: 'outraDeficiencia',
    },
    {
      condicao:
        dados.criancaComProblemaSaude === 'sim' &&
        dados.qualProblemaSaude.some((opcao) =>
          ['outro', 'outra'].includes(
            opcao.label.trim().toLocaleLowerCase('pt-BR'),
          ),
        ),
      preenchido: Boolean(dados.outroProblemaSaude.trim()),
      caminho: 'outroProblemaSaude',
    },
  ]

  for (const { condicao, preenchido, caminho } of camposObrigatorios) {
    if (!condicao || preenchido) continue

    contexto.addIssue({
      code: 'custom',
      path: [caminho],
      message: 'Este campo é obrigatório.',
    })
  }
})

export type FormValues = z.infer<typeof formSchema>

export default formSchema
