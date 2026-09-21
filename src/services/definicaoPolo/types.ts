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

export type DetalheDefinicaoPolo = {
  ativo: boolean
  edicao: {
    uuid: string
    nome: string
  }
  polo: {
    ativo: boolean
    atualizado_em: string
    bairro: string
    cep: string
    codigo_eol: string
    complemento: string
    criado_em: string
    dre_codigo_eol: string
    dre_nome: string
    email: string
    gestao: string
    logradouro: string
    nome_gestor: string
    nome_osc: string
    nome_polo: string
    numero: string
    observacoes_gerais: string
    quantidade_maxima_alunos: number | null
    status: string
    telefone: string
    tipo: string
    tipo_logradouro: string
    tipo_ue: string
    uuid: string
  }
  ponto_focal_nome: string
  ponto_focal_telefone: string
  ponto_focal_email: string
  projecao_inscritos: number | null
  total_inscritos: number | null
  tipo: string | null
  uuid: string
}

export type Historico = {
  edicao: {
    nome: string
  }
  tipo: string | null
  projecao_inscritos: number | null
  total_inscritos?: number | null
  resultado_final_de_inscritos: number | null
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
