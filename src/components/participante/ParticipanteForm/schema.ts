import { z } from 'zod'

const formSchema = z.object({
  agrupamento: z.string(),
  tipoEstudante: z.string(),
})

export type FormValues = z.infer<typeof formSchema>

export default formSchema
