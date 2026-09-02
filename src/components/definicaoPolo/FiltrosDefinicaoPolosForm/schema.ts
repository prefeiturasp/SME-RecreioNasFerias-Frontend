import { z } from 'zod'

const filtrosDefinicaoPolosSchema = z.object({
  dre: z.string(),
  tipoUe: z.string(),
  nomeUeOuCodigoEol: z.string(),
  nomeEdicao: z.string(),
  tipoPolo: z.string(),
  gestao: z.string(),
})

export type FiltrosDefinicaoPolosFormValues = z.infer<
  typeof filtrosDefinicaoPolosSchema
>

export default filtrosDefinicaoPolosSchema
