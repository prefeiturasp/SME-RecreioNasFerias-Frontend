export type TipoEstudanteInscricao = 'ESTUDANTE_DA_REDE' | 'ESTUDANTE_EXTERNO'

export type GrupoInscricao =
  | 'BERCARIO_I'
  | 'BERCARIO_II'
  | 'MINI_GRUPO_I'
  | 'MINI_GRUPO_II'
  | 'QUATRO_A_14_ANOS'

export type StatusInscricao = 'RASCUNHO' | 'COMPLETA' | 'CANCELADA'

export type DadosCadastroInscricao = {
  polo: string
  tipoEstudante: string
  grupoParticipante: string
  codigoEol: string
  cpf: string
  nomeCompleto: string
  dataNascimento: string
  nomeResponsavel: string
  nomeSocialResponsavel: string
  cep: string
  logradouro: string
  numero: string
  complemento: string
  bairro: string
  cidade: string
  telefone1: string
  telefone2: string
  email: string
  dreCodigoEol: string
  dreNome: string
}

export type Inscricao = {
  uuid: string
  edicao: string | null
  polo: string | null
  tipo_estudante: TipoEstudanteInscricao | ''
  tipo_estudante_label: string
  grupo: GrupoInscricao | ''
  grupo_label: string
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
  status: StatusInscricao
  status_label: string
  ativo: boolean
}

export type OpcaoChoice = {
  value: string
  label: string
}

export type ValoresChoicesInscricao = {
  grupo_inscricao: OpcaoChoice[]
  tipo_estudante: OpcaoChoice[]
  status_inscricao: OpcaoChoice[]
}

export type PoloElegivel = {
  uuid: string
  codigo_eol: string
  nome_polo: string
  dre_codigo_eol: string
  dre_nome: string
}
