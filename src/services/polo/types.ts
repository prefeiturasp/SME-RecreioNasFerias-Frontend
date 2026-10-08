export type StatusPolo = 'ativo' | 'inativo'
export type TipoPolo = 'pendente'
export type GestaoPolo = 'parceira' | 'direta'

export type Polo = {
  id: string
  dre: string
  tipoUe: string
  nomePolo: string
  nomeOsc: string
}

export type PoloDetalhado = {
  uuid: string
  codigo_eol: string
  nome_polo: string
  nome_osc: string
  dre_nome: string
  dre_codigo_eol: string
  tipo: TipoPolo
  status: StatusPolo
  gestao: GestaoPolo
  tipo_ue: string
  quantidade_maxima_alunos: number
  cep: string
  tipo_logradouro: string
  logradouro: string
  bairro: string
  numero: string
  complemento: string
  nome_gestor: string
  email: string
  telefone: string
  ponto_focal_nome: string
  ponto_focal_telefone: string
  ponto_focal_email: string
  observacoes_gerais: string
  endereco_completo: string
  ativo: boolean
  criado_em: string
  atualizado_em: string
}

export type DadosPontoFocalPolo = Pick<
  PoloDetalhado,
  'ponto_focal_nome' | 'ponto_focal_telefone' | 'ponto_focal_email'
>

export type PoloListagemItem = Omit<PoloDetalhado, 'gestao'> & {
  gestao: GestaoPolo | 'direta'
  gestao_label: string
  status_label: string
}

export type ListagemPolosPaginada = {
  count: number
  next: string | null
  previous: string | null
  results: PoloListagemItem[]
}

export type DadosDaUnidade = {
  nome: string
  codigo_eol: string
  sigla_tipo_escola: string
  nome_dre: string
  sigla_dre: string
  codigo_dre: string
  email: string
  telefone: string
  cep: string
  tipo_logradouro: string
  logradouro: string
  bairro: string
  numero: string
  complemento: string
  municipio: string
  uf: string
}

export type DadosCadastroPolo = {
  codigoEol: string
  nomePolo: string
  nomeOsc: string
  dreNome: string
  dreCodigoEol: string
  tipo: TipoPolo
  status: StatusPolo
  gestao: GestaoPolo
  tipoUe: string
  quantidadeMaximaAlunos: string
  cep: string
  tipoLogradouro: string
  logradouro: string
  bairro: string
  numero: string
  complemento: string
  nomeGestor: string
  email: string
  telefone: string
  observacoesGerais: string
}
