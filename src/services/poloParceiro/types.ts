export type StatusPoloParceiro = 'ativo' | 'inativo'

export const STATUS_POLO_PARCEIRO_PADRAO: StatusPoloParceiro = 'ativo'

export const OPCOES_STATUS_POLO_PARCEIRO: readonly {
  valor: StatusPoloParceiro
  rotulo: string
}[] = [
  { valor: 'ativo', rotulo: 'Ativo' },
  { valor: 'inativo', rotulo: 'Inativo' },
]

export type PoloParceiro = {
  id: string
  dre: string
  tipoUe: string
  nomePolo: string
  nomeOsc: string
}

export type PoloParceiroDetalhado = {
  id: string
  tipo: string
  nomeOsc: string
  nomePolo: string
  dre: string
  tipoUe: string
  quantidadeMaximaAlunos: number
  cep: string
  endereco: string
  nomeGestor: string
  emailPolo: string
  telefonePolo: string
  status: StatusPoloParceiro
  observacoesGerais: string
}

export type FiltrosListagemPolosParceiros = {
  dre: string
  tipoUe: string
  nomePoloOuOsc: string
}

export type ParametrosListagemPolosParceiros = FiltrosListagemPolosParceiros & {
  pagina?: number
  tamanhoPagina?: number
}

export type ListagemPolosParceiros = {
  polos: PoloParceiro[]
  pagina: number
  tamanhoPagina: number
  total: number
  totalPaginas: number
}

export const FILTROS_LISTAGEM_POLOS_PARCEIROS_INICIAIS: FiltrosListagemPolosParceiros =
  {
    dre: '',
    tipoUe: '',
    nomePoloOuOsc: '',
  }

export type DadosCadastroPoloParceiro = {
  tipo: string
  nomeOsc: string
  nomePolo: string
  dre: string
  tipoUe: string
  quantidadeMaximaAlunos: string
  cep: string
  endereco: string
  nomeGestor: string
  emailPolo: string
  telefonePolo: string
  status: StatusPoloParceiro
  observacoes: string
}
