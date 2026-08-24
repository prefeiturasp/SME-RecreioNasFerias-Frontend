import { describe, expect, it } from 'vitest'
import {
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
    expect(validarFimInscricoesAteFimEdicao('2026-07-01', '2026-06-30')).toBe(
      'A data fim das inscrições não pode ser posterior à data fim da edição.',
    )
  })

  it('ignora validação quando alguma data está vazia', () => {
    expect(validarFimInscricoesAteFimEdicao('', '2026-06-30')).toBeNull()
    expect(validarFimInscricoesAteFimEdicao('2026-06-15', '')).toBeNull()
  })
})
