import { describe, expect, it } from 'vitest'

import { interpretarRespostaPoloParceiroDetalhado } from './interpretarRespostaPoloParceiroDetalhado'

const poloDetalhadoExemplo = {
  id: '11111111-1111-1111-1111-111111111111',
  tipo: 'Parceiro',
  nomeOsc: 'Cantinho Feliz',
  nomePolo: 'CEI DIRET ALOYSIO DE MENEZES PINTO NETO',
  dre: 'DRE Butantã',
  tipoUe: 'CEI',
  quantidadeMaximaAlunos: 50,
  cep: '05510-000',
  endereco: 'Rua Exemplo, 100',
  nomeGestor: 'Maria Silva',
  emailPolo: 'polo@exemplo.com',
  telefonePolo: '11999999999',
  status: 'ativo',
  observacoesGerais: 'Observação teste',
}

describe('interpretarRespostaPoloParceiroDetalhado', () => {
  it('interpreta polo parceiro detalhado válido', () => {
    expect(
      interpretarRespostaPoloParceiroDetalhado(poloDetalhadoExemplo),
    ).toEqual(poloDetalhadoExemplo)
  })

  it('retorna null quando a resposta não é um objeto', () => {
    expect(interpretarRespostaPoloParceiroDetalhado(null)).toBeNull()
    expect(interpretarRespostaPoloParceiroDetalhado('texto')).toBeNull()
  })

  it('retorna null quando a resposta é inválida', () => {
    expect(interpretarRespostaPoloParceiroDetalhado({ id: '1' })).toBeNull()
  })

  it('retorna null quando o status é inválido', () => {
    expect(
      interpretarRespostaPoloParceiroDetalhado({
        ...poloDetalhadoExemplo,
        status: 'suspenso',
      }),
    ).toBeNull()
  })
})
