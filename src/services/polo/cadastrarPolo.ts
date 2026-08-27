import { api } from '../api/http'
import type { DadosCadastroPolo, PoloDetalhado } from './types'

export async function cadastrarPolo(
  dados: DadosCadastroPolo,
): Promise<PoloDetalhado> {
  const { data } = await api.post<PoloDetalhado>('/api/v1/polos/', {
    codigo_eol: dados.codigoEol.trim(),
    nome_polo: dados.nomePolo.trim(),
    nome_osc: dados.nomeOsc.trim(),
    dre_nome: dados.dreNome.trim(),
    dre_codigo_eol: dados.dreCodigoEol.trim(),
    tipo: dados.tipo,
    status: dados.status,
    gestao: dados.gestao,
    tipo_ue: dados.tipoUe.trim(),
    quantidade_maxima_alunos: Number(dados.quantidadeMaximaAlunos),
    cep: dados.cep.trim(),
    tipo_logradouro: dados.tipoLogradouro.trim(),
    logradouro: dados.logradouro.trim(),
    bairro: dados.bairro.trim(),
    numero: dados.numero.trim(),
    complemento: dados.complemento.trim(),
    nome_gestor: dados.nomeGestor.trim(),
    email: dados.email.trim(),
    telefone: dados.telefone.trim(),
    observacoes_gerais: dados.observacoesGerais.trim(),
  })

  return data
}
