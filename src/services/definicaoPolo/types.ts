export type DefinicaoPoloApi = {
  polo_uuid: string
  codigo_eol: string
  nome_polo: string
  dre_nome: string
  dre_codigo_eol: string
  tipo_ue: string
  gestao: string
  status: string
  ativo: boolean
  definicao_uuid: string | null
  edicao_uuid: string | null
  nome_edicao: string | null
  tipo_polo_edicao: string | null
  projecao_inscritos_edicao: number | null
  total_inscritos_edicao: number | null
  resultado_final_de_inscritos_edicao: number | null
}

export type FiltrosListagemDefinicaoPolos = {
  dre: string
  tipoUe: string
  nomeUeOuCodigoEol: string
  edicao: string
  tipoPolo: string
  gestao: string
}

export type ParametrosListagemDefinicoesPolo = {
  busca?: string
  dre_codigos_eol?: string
  tipo_ue?: string
  edicao?: string
  gestao?: string
  tipo_polo?: string
  page?: number
  page_size?: number
}

export type ListagemDefinicoesPoloPaginada = {
  count: number
  next: string | null
  previous: string | null
  results: DefinicaoPoloApi[]
}

export type DadosVincularEmMassa = {
  polos: string[]
  edicao: string
}

export type PoloParaAlterarTipo = {
  polo_uuid: string
  edicao_uuid: string | null
}

export type ItemAlterarTipoEmMassa = {
  polo_uuid: string
  edicao: string | null
  tipo: string
}

export type ResultadoAlterarTipoEmMassa = {
  mensagem: string
  alterados: {
    polo_uuid: string
    edicao_uuid: string
    tipo: string
  }[]
  ignorados: {
    polo_uuid: string
    motivo: string
  }[]
}

export type DefinicaoPolo = {
  uuid: string
  polo: string
  edicao: string
  tipo: string
  projecao_inscritos: number
  total_inscritos: number
  ponto_focal_nome: string
  ponto_focal_telefone: string
  ponto_focal_email: string
  ativo: boolean
  criado_em: string
  atualizado_em: string
}

export type PoloDefinicaoDetalhe = {
  uuid: string
  codigo_eol: string
  nome_polo: string
  nome_osc: string
  dre_nome: string
  dre_codigo_eol: string
  tipo: string
  status: string
  gestao: string
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
  endereco_completo: string
}

export type EdicaoResumoDefinicao = {
  uuid: string
  nome: string
}

export type DefinicaoPoloDetalhe = {
  uuid: string
  polo: PoloDefinicaoDetalhe
  edicao: EdicaoResumoDefinicao
  tipo: string
  projecao_inscritos: number
  total_inscritos: number
  ponto_focal_nome: string
  ponto_focal_telefone: string
  ponto_focal_email: string
  ativo: boolean
  resultado_final_de_inscritos: number
}

export type DadosAtualizacaoDefinicaoPolo = {
  polo: string
  edicao: string
  tipo: string
  projecao_inscritos: number
  ponto_focal_nome: string
  ponto_focal_telefone: string
  ponto_focal_email: string
}

export const FILTROS_LISTAGEM_DEFINICAO_POLOS_INICIAIS: FiltrosListagemDefinicaoPolos =
  {
    dre: '',
    tipoUe: '',
    nomeUeOuCodigoEol: '',
    edicao: '',
    tipoPolo: '',
    gestao: '',
  }

export const OPCOES_TIPO_POLO = [
  { valor: 'pendente', rotulo: 'Pendente' },
  { valor: 'oficial', rotulo: 'Polo oficial' },
  { valor: 'reserva', rotulo: 'Polo reserva' },
] as const

export type Historico = {
  edicao: {
    nome: string
  }
  tipo: string
  projecao_inscritos: number
  total_inscritos?: number
  resultado_final_de_inscritos: number
}

export type ParametrosHistoricoDefinicaoPolo = {
  polo: string
  page?: number
  page_size?: number
  desabilita_paginacao?: boolean
}

export type ListagemHistoricoDefinicaoPoloPaginada = {
  count: number
  next: string | null
  previous: string | null
  results: Historico[]
}
