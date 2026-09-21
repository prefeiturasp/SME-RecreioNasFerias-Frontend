export type StatusPolo = 'ativo' | 'inativo'
export type TipoPolo = 'pendente'
export type GestaoPolo = 'parceira'

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
  observacoes_gerais: string
  ativo: boolean
  criado_em: string
  atualizado_em: string
}

export type PoloListagemItem = Omit<PoloDetalhado, 'gestao'> & {
  gestao: GestaoPolo | 'direta'
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
