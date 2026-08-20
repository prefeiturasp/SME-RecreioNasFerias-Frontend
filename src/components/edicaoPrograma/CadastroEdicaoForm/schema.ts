import { z } from 'zod'
import {
  validarInscricoesAntesDoInicioEdicao,
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
    const erroPeriodoEdicao = validarPeriodoEdicao(
      dados.dataInicioEdicao,
      dados.dataFimEdicao,
    )
    if (erroPeriodoEdicao) {
      ctx.addIssue({
        code: 'custom',
        path: ['dataFimEdicao'],
        message: erroPeriodoEdicao,
      })
    }

    const erroPeriodoInscricoes = validarPeriodoInscricoes(
      dados.dataInicioInscricoes,
      dados.dataFimInscricoes,
    )
    if (erroPeriodoInscricoes) {
      ctx.addIssue({
        code: 'custom',
        path: ['dataFimInscricoes'],
        message: erroPeriodoInscricoes,
      })
    }

    const erroInscricoes = validarInscricoesAntesDoInicioEdicao(
      dados.dataFimInscricoes,
      dados.dataInicioEdicao,
    )
    if (erroInscricoes) {
      ctx.addIssue({
        code: 'custom',
        path: ['dataFimInscricoes'],
        message: erroInscricoes,
      })
    }
  })

export type FormValues = z.infer<typeof formSchema>

export default formSchema
