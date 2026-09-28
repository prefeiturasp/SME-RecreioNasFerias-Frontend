export type TipoEstudanteInscricao = 'ESTUDANTE_DA_REDE' | 'ESTUDANTE_EXTERNO'

export type GrupoInscricao =
  | 'BERCARIO_I'
  | 'BERCARIO_II'
  | 'MINI_GRUPO_I'
  | 'MINI_GRUPO_II'
  | 'QUATRO_A_14_ANOS'

export type StatusInscricao = 'RASCUNHO' | 'COMPLETA' | 'CANCELADA'

export type DadosCadastroInscricao = {
  edicao: string | null
  polo: string | null
  tipo_estudante: TipoEstudanteInscricao
  grupo: GrupoInscricao
  codigo_eol: string
  cpf: string
  nome_participante: string
  data_nascimento: string | null
  responsavel_nome: string
  responsavel_nome_social: string
  cep: string
  tipo_logradouro: string
  logradouro: string
  numero: string
  complemento: string
  bairro: string
  cidade: string
  telefone_contato_1: string
  telefone_contato_2: string
  email: string
  dre_codigo_eol: string
  dre_nome: string
}

export type Inscricao = DadosCadastroInscricao & {
  uuid: string
  tipo_estudante_label: string
  grupo_label: string
  status: StatusInscricao
  status_label: string
  ativo: boolean
}
