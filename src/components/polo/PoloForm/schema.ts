import { z } from 'zod'
import { extrairDigitos } from '@/utils/mascarasEntrada'

function cepEstaValido(valor: string): boolean {
  return extrairDigitos(valor).length === 8
}

function telefoneEstaValido(valor: string): boolean {
  const quantidadeDigitos = extrairDigitos(valor).length
  return quantidadeDigitos === 10 || quantidadeDigitos === 11
}

function emailPoloEstaValido(email: string): boolean {
  const indiceArroba = email.indexOf('@')

  if (indiceArroba <= 0 || indiceArroba !== email.lastIndexOf('@')) {
    return false
  }

  const parteLocal = email.slice(0, indiceArroba)
  const parteDominio = email.slice(indiceArroba + 1)
  const indicePonto = parteDominio.lastIndexOf('.')

  if (indicePonto <= 0 || indicePonto === parteDominio.length - 1) {
    return false
  }

  return (
    parteLocal.length > 0 &&
    !parteLocal.includes(' ') &&
    !parteDominio.includes(' ')
  )
}

function quantidadeMaximaAlunosEstaValida(valor: string): boolean {
  const quantidade = Number(valor)
  return Number.isInteger(quantidade) && quantidade > 0
}

const formSchema = z.object({
  tipo: z.string(),
  nomeOsc: z.string().trim().min(1, 'Nome da OSC é obrigatório'),
  nomePolo: z.string().trim().min(1, 'Nome do polo é obrigatório'),
  dre: z.string().trim().min(1, 'DRE é obrigatória'),
  tipoUe: z.string().trim().min(1, 'Tipo de UE é obrigatório'),
  quantidadeMaximaAlunos: z
    .string()
    .trim()
    .min(1, 'Quantidade máxima de alunos é obrigatória')
    .refine(
      quantidadeMaximaAlunosEstaValida,
      'Informe uma quantidade máxima de alunos válida.',
    ),
  cep: z
    .string()
    .trim()
    .min(1, 'CEP é obrigatório')
    .refine(cepEstaValido, 'Informe um CEP válido.'),
  endereco: z.string().trim().min(1, 'Endereço é obrigatório'),
  nomeGestor: z.string().trim().min(1, 'Nome do gestor é obrigatório'),
  emailPolo: z
    .string()
    .trim()
    .min(1, 'E-mail do polo é obrigatório')
    .refine(emailPoloEstaValido, 'Informe um e-mail válido para o polo.'),
  telefonePolo: z
    .string()
    .trim()
    .min(1, 'Telefone do polo é obrigatório')
    .refine(
      telefoneEstaValido,
      'Informe um telefone válido para o polo.',
    ),
  status: z.enum(['ativo', 'inativo'], {
    error: 'Selecione um status válido.',
  }),
  observacoes: z.string(),
})

export type FormValues = z.infer<typeof formSchema>

export default formSchema
