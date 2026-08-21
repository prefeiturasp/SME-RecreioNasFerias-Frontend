import { z } from 'zod'
import {
  validarFimInscricoesAteFimEdicao,
  validarPeriodoEdicao,
  validarPeriodoInscricoes,
} from '@/services/edicaoPrograma/validarCadastroEdicao'

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
        validarPeriodoEdicao(dados.dataInicioEdicao, dados.dataFimEdicao),
      ],
      [
        'dataFimInscricoes',
        validarPeriodoInscricoes(
          dados.dataInicioInscricoes,
          dados.dataFimInscricoes,
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
