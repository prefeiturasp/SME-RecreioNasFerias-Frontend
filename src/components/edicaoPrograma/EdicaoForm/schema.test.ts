import { describe, expect, it } from 'vitest'
import formSchema from './schema'

const dadosValidos = {
  nome: 'Edição Teste',
  dataInicioEdicao: '2026-06-01',
  dataFimEdicao: '2026-06-30',
  dataInicioInscricoes: '2026-05-01',
  dataFimInscricoes: '2026-05-31',
}

function mensagensDeErro(dados: typeof dadosValidos) {
  const resultado = formSchema.safeParse(dados)
  if (resultado.success) return []
  return resultado.error.issues.map((issue) => issue.message)
}

describe('EdicaoForm schema', () => {
  it('aceita quando os períodos são válidos', () => {
    expect(formSchema.safeParse(dadosValidos).success).toBe(true)
  })

  it('aceita inscrições que começam depois do início da edição e terminam no fim da edição', () => {
    expect(
      formSchema.safeParse({
        ...dadosValidos,
        dataInicioInscricoes: '2026-06-10',
        dataFimInscricoes: '2026-06-30',
      }).success,
    ).toBe(true)
  })

  it('rejeita quando a data inicial da edição é maior que a final', () => {
    expect(
      mensagensDeErro({
        ...dadosValidos,
        dataInicioEdicao: '2026-06-20',
        dataFimEdicao: '2026-06-10',
      }),
    ).toContain(
      'No período da edição, a data "De" não pode ser maior que a data "Até".',
    )
  })

  it('rejeita quando a data inicial das inscrições é maior que a final', () => {
    expect(
      mensagensDeErro({
        ...dadosValidos,
        dataInicioInscricoes: '2026-05-20',
        dataFimInscricoes: '2026-05-10',
      }),
    ).toContain(
      'No período das inscrições, a data "De" não pode ser maior que a data "Até".',
    )
  })

  it('rejeita quando o fim das inscrições é posterior ao fim da edição', () => {
    expect(
      mensagensDeErro({
        ...dadosValidos,
        dataFimInscricoes: '2026-07-01',
      }),
    ).toContain(
      'A data fim das inscrições não pode ser posterior à data fim da edição.',
    )
  })
})
