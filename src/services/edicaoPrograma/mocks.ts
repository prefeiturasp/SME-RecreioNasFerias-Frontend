import type { EdicaoPrograma } from './types'

export const QUANTIDADES_MOCK_CADASTRO_EDICAO = {
  quantidadeInscritos: 0,
  quantidadeAtendimentoEfetivo: 0,
  quantidadePasseios: 0,
  quantidadeApresentacoes: 0,
} as const

export const EDICOES_PROGRAMA_MOCK: EdicaoPrograma[] = [
  {
    id: 'mock-edicao-janeiro-2026',
    nome: 'Janeiro 2026',
    dataInicioEdicao: '2026-01-01',
    dataFimEdicao: '2026-01-31',
    dataInicioInscricoes: '2025-12-01',
    dataFimInscricoes: '2025-12-31',
    quantidadeInscritos: 50,
    quantidadeAtendimentoEfetivo: 40,
    quantidadePasseios: 0,
    quantidadeApresentacoes: 0,
  },
  {
    id: 'mock-edicao-fevereiro-2026',
    nome: 'Fevereiro 2026',
    dataInicioEdicao: '2026-01-26',
    dataFimEdicao: '2026-02-26',
    dataInicioInscricoes: '2025-12-26',
    dataFimInscricoes: '2026-01-26',
    quantidadeInscritos: 100,
    quantidadeAtendimentoEfetivo: 100,
    quantidadePasseios: 0,
    quantidadeApresentacoes: 0,
  },
  {
    id: 'mock-edicao-marco-2026',
    nome: 'Março 2026',
    dataInicioEdicao: '2026-03-01',
    dataFimEdicao: '2026-03-31',
    dataInicioInscricoes: '2026-02-01',
    dataFimInscricoes: '2026-02-28',
    quantidadeInscritos: 200,
    quantidadeAtendimentoEfetivo: 180,
    quantidadePasseios: 0,
    quantidadeApresentacoes: 0,
  },
]
