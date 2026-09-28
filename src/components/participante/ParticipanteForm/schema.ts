import { z } from 'zod'

const formSchema = z.object({
  agrupamento: z.string(),
  tipoEstudante: z.string(),
  codigoEol: z.string(),
  cpf: z.string(),
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
  telefone1: z.string(),
  telefone2: z.string(),
  email: z.string(),
  dreCodigoEol: z.string(),
  polo: z.string(),
  estaNaRede: z.string(),
  tipoVaga: z.string(),
  unidadeEducacional: z.string(),
  turno: z.string(),
  podeIrSozinho: z.string(),
  responsavelRetirada: z.string(),
  autorizaImagens: z.string(),
})

export type FormValues = z.infer<typeof formSchema>

export default formSchema
