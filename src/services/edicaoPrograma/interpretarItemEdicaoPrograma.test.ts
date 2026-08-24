import { describe, expect, it } from 'vitest'
import { interpretarItemEdicaoPrograma } from './interpretarItemEdicaoPrograma'

const itemApiExemplo = {
  uuid: '04153eb1-5f40-4f0d-8b59-1290ba4684a0',
  nome: 'Programa teste',
  data_inicio: '2026-08-02',
  data_fim: '2026-08-08',
  inscricoes_inicio: '2026-08-02',
  inscricoes_fim: '2026-08-08',
  quantidade_inscritos: 0,
  quantidade_atendimento_efetivo: 0,
  quantidade_passeios: 0,
  quantidade_apresentacoes: 0,
  status: 'encerrada',
  ativo: true,
  criado_em: '2026-08-24T10:28:48.821542-03:00',
  atualizado_em: '2026-08-24T10:28:48.821553-03:00',
}

describe('interpretarItemEdicaoPrograma', () => {
  it('mapeia o item da API para o domínio da edição', () => {
    expect(interpretarItemEdicaoPrograma(itemApiExemplo)).toEqual({
      id: '04153eb1-5f40-4f0d-8b59-1290ba4684a0',
      nome: 'Programa teste',
      dataInicioEdicao: '2026-08-02',
      dataFimEdicao: '2026-08-08',
      dataInicioInscricoes: '2026-08-02',
      dataFimInscricoes: '2026-08-08',
      quantidadeInscritos: 0,
      quantidadeAtendimentoEfetivo: 0,
      quantidadePasseios: 0,
      quantidadeApresentacoes: 0,
    })
  })

  it('aceita quantidade nula como zero', () => {
    expect(
      interpretarItemEdicaoPrograma({
        ...itemApiExemplo,
        quantidade_inscritos: null,
      }),
    ).toMatchObject({ quantidadeInscritos: 0 })
  })

  it('retorna null quando o payload é inválido', () => {
    expect(interpretarItemEdicaoPrograma(null)).toBeNull()
    expect(interpretarItemEdicaoPrograma({ nome: 'sem uuid' })).toBeNull()
    expect(
      interpretarItemEdicaoPrograma({ ...itemApiExemplo, uuid: 1 }),
    ).toBeNull()
  })
})
