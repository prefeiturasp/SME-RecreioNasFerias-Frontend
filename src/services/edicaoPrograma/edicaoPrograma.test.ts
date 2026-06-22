import { beforeEach, describe, expect, it } from 'vitest'
import { formatarDataBr, formatarPeriodo } from './formatarPeriodo'
import {
  adicionarEdicaoPrograma,
  limparEdicoesPrograma,
  listarEdicoesPrograma,
} from './storage'

const edicaoExemplo = {
  nome: 'Fevereiro 2026',
  dataInicioEdicao: '2026-01-26',
  dataFimEdicao: '2026-02-26',
  dataInicioInscricoes: '2026-12-26',
  dataFimInscricoes: '2026-01-26',
  quantidadeInscritos: 100,
  quantidadeAtendimentoEfetivo: 100,
  quantidadePasseios: 0,
  quantidadeApresentacoes: 0,
}

describe('edicaoPrograma storage', () => {
  beforeEach(() => {
    limparEdicoesPrograma()
  })

  it('retorna 3 edições mock quando não há edições salvas', () => {
    const edicoes = listarEdicoesPrograma()

    expect(edicoes).toHaveLength(3)
    expect(edicoes.map((edicao) => edicao.nome)).toEqual([
      'Janeiro 2026',
      'Fevereiro 2026',
      'Março 2026',
    ])
  })

  it('adiciona edição à lista existente', () => {
    listarEdicoesPrograma()
    adicionarEdicaoPrograma(edicaoExemplo)

    const edicoes = listarEdicoesPrograma()
    expect(edicoes).toHaveLength(4)
    expect(edicoes.some((edicao) => edicao.nome === 'Fevereiro 2026')).toBe(
      true,
    )
  })
})

describe('formatarPeriodo', () => {
  it('formata data no padrão brasileiro', () => {
    expect(formatarDataBr('2026-01-26')).toBe('26/01/2026')
  })

  it('formata período com intervalo', () => {
    expect(formatarPeriodo('2026-01-26', '2026-02-26')).toBe(
      '26/01/2026 - 26/02/2026',
    )
  })
})
