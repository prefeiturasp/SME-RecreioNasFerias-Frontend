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

const formSchema = z.object({
  agrupamento: z.string(),
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
  dreNome: z.string(),
  polo: z.string(),
  grupoParticipante: z.string(),
  estaNaRede: z.string(),
  tipoEscola: z.string(),
  unidadeEducacional: z.string(),
  turmaAno: z.string(),
  podeIrSozinho: z.string(),
  responsavelRetirada: z.string(),
  autorizaPiscina: z.string(),
  criancaDeficiencia: z.string(),
  criancaDeficienciaQual: z.string(),
  problemaSaude: z.string(),
  problemaSaudeQual: z.string(),
  medicacao: z.string(),
  medicacaoQual: z.string(),
  restricaoMedicamento: z.string(),
  restricaoMedicamentoQual: z.string(),
  convenioMedico: z.string(),
  convenioMedicoQual: z.string(),
})

export type FormValues = z.infer<typeof formSchema>

export default formSchema
