import { z } from 'zod'

const formSchema = z.object({
  usuario: z.string().min(1, 'Usuário é obrigatório'),
  senha: z
    .string()
    .min(1, 'Senha é obrigatória')
    .min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

export type FormValues = z.infer<typeof formSchema>

export default formSchema
