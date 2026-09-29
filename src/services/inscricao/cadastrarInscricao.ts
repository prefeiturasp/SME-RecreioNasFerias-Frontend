import { api } from '../api/http'
import type { DadosCadastroInscricao, Inscricao } from './types'

export async function cadastrarInscricao(
  dados: DadosCadastroInscricao,
): Promise<Inscricao> {
  const { data } = await api.post<Inscricao>('/api/v1/inscricoes/', {
    edicao: null,
    polo: dados.polo.trim() === '' ? null : dados.polo,
    tipo_estudante: dados.tipoEstudante,
    grupo: dados.grupo,
    codigo_eol: dados.codigoEol,
    cpf: dados.cpf,
    nome_participante: dados.nomeCompleto,
    data_nascimento:
      dados.dataNascimento.trim() === '' ? null : dados.dataNascimento,
    responsavel_nome: dados.nomeResponsavel,
    responsavel_nome_social: dados.nomeSocialResponsavel,
    cep: dados.cep,
    logradouro: dados.logradouro,
    numero: dados.numero,
    complemento: dados.complemento,
    bairro: dados.bairro,
    cidade: dados.cidade,
    telefone_contato_1: dados.telefone1,
    telefone_contato_2: dados.telefone2,
    email: dados.email,
    dre_codigo_eol: dados.dreCodigoEol,
    dre_nome: dados.dreNome,
  })

  return data
}
