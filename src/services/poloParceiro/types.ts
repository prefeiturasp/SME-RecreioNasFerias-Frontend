export type PoloParceiro = {
  id: string
  dre: string
  tipoUe: string
  nomePolo: string
  nomeOsc: string
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

export const PARAMETROS_LISTAGEM_POLOS_PARCEIROS_INICIAIS: ParametrosListagemPolosParceiros =
  {
    ...FILTROS_LISTAGEM_POLOS_PARCEIROS_INICIAIS,
  }
