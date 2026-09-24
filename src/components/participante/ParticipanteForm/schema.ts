import { z } from 'zod'

const formSchema = z.object({})

export type FormValues = z.infer<typeof formSchema>

export default formSchema
