import { z } from 'zod'

const pontoFocalFields = {
  pontoFocalNome: z.string(),
  pontoFocalTelefone: z
    .string()
    .trim()
    .regex(
      /^(?:\d{8,11}|\(\d{2}\) \d{4,5}-\d{4})?$/,
      'Informe um telefone válido para o ponto focal.',
    ),
  pontoFocalEmail: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(
      z.union([
        z.literal(''),
        z.email({ error: 'Digite um e-mail válido para o ponto focal.' }),
      ]),
    ),
}

export const pontoFocalSchema = z.object(pontoFocalFields)

const formSchema = z.object({
  projecaoInscritos: z
    .string()
    .trim()
    .min(1, 'Projeção de inscritos é obrigatória')
    .regex(/^\d+$/, 'Informe uma projeção de inscritos válida.'),
  ...pontoFocalFields,
})

export type FormValues = z.infer<typeof formSchema>
export type PontoFocalFormValues = z.infer<typeof pontoFocalSchema>

export default formSchema
