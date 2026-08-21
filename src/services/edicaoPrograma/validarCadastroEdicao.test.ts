import { describe, expect, it } from 'vitest'
import {
  formularioCadastroEstaPreenchido,
  validarCadastroEdicao,
  validarFimInscricoesAteFimEdicao,
  validarPeriodoEdicao,
  validarPeriodoInscricoes,
} from './validarCadastroEdicao'

describe('validarPeriodoEdicao', () => {
  it('aceita quando a data inicial é anterior ou igual à final', () => {
    expect(validarPeriodoEdicao('2026-06-01', '2026-06-30')).toBeNull()
    expect(validarPeriodoEdicao('2026-06-10', '2026-06-10')).toBeNull()
  })

  it('rejeita quando a data inicial é maior que a final', () => {
    expect(validarPeriodoEdicao('2026-06-20', '2026-06-10')).toBe(
      'No período da edição, a data "De" não pode ser maior que a data "Até".',
    )
  })

  it('ignora validação quando alguma data está vazia', () => {
    expect(validarPeriodoEdicao('', '2026-06-10')).toBeNull()
    expect(validarPeriodoEdicao('2026-06-10', '')).toBeNull()
  })
})

describe('validarPeriodoInscricoes', () => {
  it('aceita quando a data inicial é anterior ou igual à final', () => {
    expect(validarPeriodoInscricoes('2026-05-01', '2026-05-31')).toBeNull()
    expect(validarPeriodoInscricoes('2026-05-10', '2026-05-10')).toBeNull()
  })

  it('rejeita quando a data inicial é maior que a final', () => {
    expect(validarPeriodoInscricoes('2026-05-20', '2026-05-10')).toBe(
      'No período das inscrições, a data "De" não pode ser maior que a data "Até".',
    )
  })

  it('ignora validação quando alguma data está vazia', () => {
    expect(validarPeriodoInscricoes('', '2026-05-10')).toBeNull()
    expect(validarPeriodoInscricoes('2026-05-10', '')).toBeNull()
  })
})

describe('validarFimInscricoesAteFimEdicao', () => {
  it('aceita quando o fim das inscrições é anterior ou igual ao fim da edição', () => {
    expect(
      validarFimInscricoesAteFimEdicao('2026-06-15', '2026-06-30'),
    ).toBeNull()
    expect(
      validarFimInscricoesAteFimEdicao('2026-06-30', '2026-06-30'),
    ).toBeNull()
  })

  it('rejeita quando o fim das inscrições é posterior ao fim da edição', () => {
    expect(
      validarFimInscricoesAteFimEdicao('2026-07-01', '2026-06-30'),
    ).toBe(
      'A data fim das inscrições não pode ser posterior à data fim da edição.',
    )
  })

  it('ignora validação quando alguma data está vazia', () => {
    expect(validarFimInscricoesAteFimEdicao('', '2026-06-30')).toBeNull()
    expect(validarFimInscricoesAteFimEdicao('2026-06-15', '')).toBeNull()
  })
})

describe('validarCadastroEdicao', () => {
  it('retorna erro quando o período da edição é inválido', () => {
    expect(
      validarCadastroEdicao({
        nome: 'Edição Teste',
        dataInicioEdicao: '2026-07-01',
        dataFimEdicao: '2026-06-01',
        dataInicioInscricoes: '2026-05-01',
        dataFimInscricoes: '2026-05-31',
      }),
    ).toBe(
      'No período da edição, a data "De" não pode ser maior que a data "Até".',
    )
  })

  it('retorna erro quando o período das inscrições é inválido', () => {
    expect(
      validarCadastroEdicao({
        nome: 'Edição Teste',
        dataInicioEdicao: '2026-06-01',
        dataFimEdicao: '2026-06-30',
        dataInicioInscricoes: '2026-05-31',
        dataFimInscricoes: '2026-05-01',
      }),
    ).toBe(
      'No período das inscrições, a data "De" não pode ser maior que a data "Até".',
    )
  })

  it('retorna erro quando o fim das inscrições é posterior ao fim da edição', () => {
    expect(
      validarCadastroEdicao({
        nome: 'Edição Teste',
        dataInicioEdicao: '2026-06-01',
        dataFimEdicao: '2026-06-30',
        dataInicioInscricoes: '2026-05-01',
        dataFimInscricoes: '2026-07-01',
      }),
    ).toBe(
      'A data fim das inscrições não pode ser posterior à data fim da edição.',
    )
  })

  it('aceita inscrições que começam depois do início da edição e terminam no fim da edição', () => {
    expect(
      validarCadastroEdicao({
        nome: 'Edição Teste',
        dataInicioEdicao: '2026-06-01',
        dataFimEdicao: '2026-06-30',
        dataInicioInscricoes: '2026-06-10',
        dataFimInscricoes: '2026-06-30',
      }),
    ).toBeNull()
  })

  it('retorna null quando os dados são válidos', () => {
    expect(
      validarCadastroEdicao({
        nome: 'Edição Teste',
        dataInicioEdicao: '2026-06-01',
        dataFimEdicao: '2026-06-30',
        dataInicioInscricoes: '2026-05-01',
        dataFimInscricoes: '2026-05-31',
      }),
    ).toBeNull()
  })
})

describe('formularioCadastroEstaPreenchido', () => {
  it('retorna false quando algum campo editável está vazio', () => {
    expect(
      formularioCadastroEstaPreenchido({
        nome: '',
        dataInicioEdicao: '2026-06-01',
        dataFimEdicao: '2026-06-30',
        dataInicioInscricoes: '2026-05-01',
        dataFimInscricoes: '2026-05-31',
      }),
    ).toBe(false)

    expect(
      formularioCadastroEstaPreenchido({
        nome: 'Edição Teste',
        dataInicioEdicao: '2026-06-01',
        dataFimEdicao: '2026-06-30',
        dataInicioInscricoes: '2026-05-01',
        dataFimInscricoes: '',
      }),
    ).toBe(false)
  })

  it('retorna true quando todos os campos editáveis estão preenchidos', () => {
    expect(
      formularioCadastroEstaPreenchido({
        nome: 'Edição Teste',
        dataInicioEdicao: '2026-06-01',
        dataFimEdicao: '2026-06-30',
        dataInicioInscricoes: '2026-05-01',
        dataFimInscricoes: '2026-05-31',
      }),
    ).toBe(true)
  })
})
