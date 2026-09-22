import { z } from 'zod'

const formSchema = z.object({
  projecaoInscritos: z
    .string()
    .trim()
    .min(1, 'Projeção de inscritos é obrigatória')
    .regex(/^\d+$/, 'Informe uma projeção de inscritos válida.'),
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
})

export type FormValues = z.infer<typeof formSchema>

export function calcularTotalInscritos(projecaoInscritos: number): number {
  if (!Number.isFinite(projecaoInscritos) || projecaoInscritos < 0) {
    return 0
  }

  return Math.floor(projecaoInscritos * 1.3)
}

export default formSchema
