import { api } from '../api/http'
import type { DadosCadastroPolo, PoloDetalhado } from './types'

export async function cadastrarPolo(
  dados: DadosCadastroPolo,
): Promise<PoloDetalhado> {
  const { data } = await api.post<PoloDetalhado>('/api/polos/', {
    nomeOsc: dados.nomeOsc.trim(),
    nomePolo: dados.nomePolo.trim(),
    dre: dados.dre.trim(),
    tipoUe: dados.tipoUe.trim(),
    quantidadeMaximaAlunos: Number(dados.quantidadeMaximaAlunos),
    cep: dados.cep.trim(),
    endereco: dados.endereco.trim(),
    nomeGestor: dados.nomeGestor.trim(),
    emailPolo: dados.emailPolo.trim(),
    telefonePolo: dados.telefonePolo.trim(),
    status: dados.status.trim(),
    observacoesGerais: dados.observacoes.trim(),
  })

  return data
}
