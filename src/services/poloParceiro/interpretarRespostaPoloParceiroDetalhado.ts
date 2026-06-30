import type { PoloParceiroDetalhado, StatusPoloParceiro } from './types'
import { OPCOES_STATUS_POLO_PARCEIRO } from './types'

function ehStatusPoloParceiroValido(status: string): status is StatusPoloParceiro {
  return OPCOES_STATUS_POLO_PARCEIRO.some((opcao) => opcao.valor === status)
}

export function interpretarRespostaPoloParceiroDetalhado(
  dados: unknown,
): PoloParceiroDetalhado | null {
  if (!dados || typeof dados !== 'object') {
    return null
  }

  const registro = dados as Record<string, unknown>

  if (
    typeof registro.id !== 'string' ||
    typeof registro.tipo !== 'string' ||
    typeof registro.nomeOsc !== 'string' ||
    typeof registro.nomePolo !== 'string' ||
    typeof registro.dre !== 'string' ||
    typeof registro.tipoUe !== 'string' ||
    typeof registro.quantidadeMaximaAlunos !== 'number' ||
    typeof registro.cep !== 'string' ||
    typeof registro.endereco !== 'string' ||
    typeof registro.nomeGestor !== 'string' ||
    typeof registro.emailPolo !== 'string' ||
    typeof registro.telefonePolo !== 'string' ||
    typeof registro.status !== 'string' ||
    !ehStatusPoloParceiroValido(registro.status) ||
    typeof registro.observacoesGerais !== 'string'
  ) {
    return null
  }

  return {
    id: registro.id,
    tipo: registro.tipo,
    nomeOsc: registro.nomeOsc,
    nomePolo: registro.nomePolo,
    dre: registro.dre,
    tipoUe: registro.tipoUe,
    quantidadeMaximaAlunos: registro.quantidadeMaximaAlunos,
    cep: registro.cep,
    endereco: registro.endereco,
    nomeGestor: registro.nomeGestor,
    emailPolo: registro.emailPolo,
    telefonePolo: registro.telefonePolo,
    status: registro.status,
    observacoesGerais: registro.observacoesGerais,
  }
}
