import { api } from '../api/http'
import type {
  DadosCadastroInscricao,
  GrupoInscricao,
  Inscricao,
  TipoEstudanteInscricao,
} from './types'

const TIPOS_ESTUDANTE: TipoEstudanteInscricao[] = [
  'ESTUDANTE_DA_REDE',
  'ESTUDANTE_EXTERNO',
]

const GRUPOS_INSCRICAO: GrupoInscricao[] = [
  'BERCARIO_I',
  'BERCARIO_II',
  'MINI_GRUPO_I',
  'MINI_GRUPO_II',
  'QUATRO_A_14_ANOS',
]

export async function cadastrarInscricao(
  dados: DadosCadastroInscricao,
): Promise<Inscricao> {
  const { data } = await api.post<Inscricao>('/api/v1/inscricoes/', {
    edicao: null,
    polo: dados.polo.trim() === '' ? null : dados.polo,
    tipo_estudante:
      TIPOS_ESTUDANTE.find((tipo) => tipo === dados.tipoEstudante) ?? '',
    grupo:
      GRUPOS_INSCRICAO.find((grupo) => grupo === dados.grupoParticipante) ??
      '',
    codigo_eol: dados.codigoEol,
    cpf: dados.cpf,
    nome_participante: dados.nomeCompleto,
    data_nascimento:
      dados.dataNascimento.trim() === '' ? null : dados.dataNascimento,
    responsavel_nome: dados.nomeResponsavel,
    responsavel_nome_social: dados.nomeSocialResponsavel,
    cep: dados.cep,
    tipo_logradouro: '',
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
