import { z } from 'zod'

function validarPeriodo(
  dataInicio: string,
  dataFim: string,
  nomePeriodo: string,
): string | null {
  if (!dataInicio || !dataFim) return null

  if (dataInicio > dataFim) {
    return `No ${nomePeriodo}, a data "De" não pode ser maior que a data "Até".`
  }

  return null
}

function validarFimInscricoesAteFimEdicao(
  dataFimInscricoes: string,
  dataFimEdicao: string,
): string | null {
  if (!dataFimInscricoes || !dataFimEdicao) return null

  if (dataFimInscricoes > dataFimEdicao) {
    return 'A data fim das inscrições não pode ser posterior à data fim da edição.'
  }

  return null
}

const formSchema = z
  .object({
    nome: z.string().min(1, 'Nome da edição é obrigatório'),
    dataInicioEdicao: z
      .string()
      .min(1, 'Data de início da edição é obrigatória'),
    dataFimEdicao: z.string().min(1, 'Data de fim da edição é obrigatória'),
    dataInicioInscricoes: z
      .string()
      .min(1, 'Data de início das inscrições é obrigatória'),
    dataFimInscricoes: z
      .string()
      .min(1, 'Data de fim das inscrições é obrigatória'),
  })
  .superRefine((dados, ctx) => {
    const erros = [
      [
        'dataFimEdicao',
        validarPeriodo(
          dados.dataInicioEdicao,
          dados.dataFimEdicao,
          'período da edição',
        ),
      ],
      [
        'dataFimInscricoes',
        validarPeriodo(
          dados.dataInicioInscricoes,
          dados.dataFimInscricoes,
          'período das inscrições',
        ),
      ],
      [
        'dataFimInscricoes',
        validarFimInscricoesAteFimEdicao(
          dados.dataFimInscricoes,
          dados.dataFimEdicao,
        ),
      ],
    ] as const

    for (const [path, mensagem] of erros) {
      if (mensagem) {
        ctx.addIssue({ code: 'custom', path: [path], message: mensagem })
      }
    }
  })

export type FormValues = z.infer<typeof formSchema>

export default formSchema
