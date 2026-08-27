import { z } from 'zod'

const formSchema = z.object({
  codigoEol: z
    .string()
    .trim()
    .min(6, 'Código EOL é obrigatório e não pode ser menor que 6 caracteres')
    .max(7, 'Código EOL não pode ser maior que 7 caracteres'),
  nomeOsc: z.string().trim().min(1, 'Nome da OSC é obrigatório'),
  nomePolo: z.string().trim().min(1, 'Nome do polo é obrigatório'),
  dreNome: z.string().trim().min(1, 'DRE é obrigatória'),
  dreCodigoEol: z.string().trim().min(1, 'DRE é obrigatória'),
  tipo: z.literal('pendente'),
  gestao: z.literal('parceira'),
  tipoUe: z.string().trim().min(1, 'Tipo de UE é obrigatório'),
  quantidadeMaximaAlunos: z
    .string()
    .trim()
    .min(1, 'Quantidade máxima de alunos é obrigatória')
    .regex(
      /^(?=.*[1-9])\d+$/,
      'Informe uma quantidade máxima de alunos válida.',
    ),
  cep: z
    .string()
    .trim()
    .min(1, 'CEP é obrigatório')
    .regex(/^\d{5}-?\d{3}$/, 'Informe um CEP válido.'),
  tipoLogradouro: z.string().trim().min(1, 'Tipo de logradouro é obrigatório'),
  logradouro: z.string().trim().min(1, 'Logradouro é obrigatório'),
  bairro: z.string().trim().min(1, 'Bairro é obrigatório'),
  numero: z.string().trim().min(1, 'Número é obrigatório'),
  complemento: z.string(),
  nomeGestor: z.string().trim().min(1, 'Nome do gestor é obrigatório'),
  email: z
    .email({
      error: 'Digite um e-mail válido para o gestor.',
    })
    .trim()
    .toLowerCase(),
  telefone: z
    .string()
    .trim()
    .min(1, 'Telefone do polo é obrigatório')
    .regex(
      /^(?:\d{10}|\d{11}|\(\d{2}\) \d{4,5}-\d{4})$/,
      'Informe um telefone válido para o polo.',
    ),
  status: z.enum(['ativo', 'inativo'], {
    error: 'Selecione um status válido.',
  }),
  observacoesGerais: z.string(),
})

export type FormValues = z.infer<typeof formSchema>

export default formSchema
