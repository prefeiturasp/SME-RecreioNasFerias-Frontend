import { describe, expect, it } from 'vitest'
import { interpretarRespostaEdicaoPrograma } from './interpretarRespostaListagemEdicoes'

describe('interpretarRespostaEdicaoPrograma', () => {
  it('mapeia uma edição válida da API', () => {
    expect(
      interpretarRespostaEdicaoPrograma({
        id: '11111111-1111-1111-1111-111111111111',
        nome: 'Edição Janeiro 2026',
        periodoEdicao: { de: '2026-01-10', ate: '2026-01-20' },
        periodoInscricoes: { de: '2025-12-01', ate: '2025-12-31' },
        quantidadeInscritos: null,
        quantidadeAtendimentoEfetivo: null,
      }),
    ).toEqual({
      id: '11111111-1111-1111-1111-111111111111',
      nome: 'Edição Janeiro 2026',
      dataInicioEdicao: '2026-01-10',
      dataFimEdicao: '2026-01-20',
      dataInicioInscricoes: '2025-12-01',
      dataFimInscricoes: '2025-12-31',
      quantidadeInscritos: 0,
      quantidadeAtendimentoEfetivo: 0,
      quantidadePasseios: 0,
      quantidadeApresentacoes: 0,
    })
  })

  it('retorna null quando o payload é inválido', () => {
    expect(interpretarRespostaEdicaoPrograma(null)).toBeNull()
    expect(interpretarRespostaEdicaoPrograma({ id: '1' })).toBeNull()
  })
})
