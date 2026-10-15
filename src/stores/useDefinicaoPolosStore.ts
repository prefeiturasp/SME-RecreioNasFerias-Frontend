import { create } from 'zustand'
import {
  FILTROS_LISTAGEM_DEFINICAO_POLOS_INICIAIS,
  type FiltrosListagemDefinicaoPolos,
} from '@/services/definicaoPolo/types'

type FiltrosDefinicaoPolosStore = {
  filtros: FiltrosListagemDefinicaoPolos
  filtrosAplicados: FiltrosListagemDefinicaoPolos
  definirFiltros: (filtros: FiltrosListagemDefinicaoPolos) => void
  alterarFiltro: <Campo extends keyof FiltrosListagemDefinicaoPolos>(
    campo: Campo,
    valor: FiltrosListagemDefinicaoPolos[Campo],
  ) => void
  aplicarFiltros: () => void
  limparFiltros: () => void
  paginaAtual: number
  setPaginaAtual: (pagina: number) => void
  itensPorPagina: number
  setItensPorPagina: (itens: number) => void
}

export const useDefinicaoPoloStore = create<FiltrosDefinicaoPolosStore>(
  (set) => ({
    paginaAtual: 1,
    setPaginaAtual: (pagina) => set({ paginaAtual: pagina }),
    itensPorPagina: 10,
    setItensPorPagina: (itens) => set({ itensPorPagina: itens }),
    filtros: { ...FILTROS_LISTAGEM_DEFINICAO_POLOS_INICIAIS },
    filtrosAplicados: { ...FILTROS_LISTAGEM_DEFINICAO_POLOS_INICIAIS },

    definirFiltros: (filtros) => set({ filtros: { ...filtros } }),

    alterarFiltro: (campo, valor) =>
      set((estado) => ({
        filtros: {
          ...estado.filtros,
          [campo]: valor,
        },
      })),

    aplicarFiltros: () =>
      set((estado) => ({
        filtrosAplicados: { ...estado.filtros },
      })),

    limparFiltros: () =>
      set({
        filtros: { ...FILTROS_LISTAGEM_DEFINICAO_POLOS_INICIAIS },
        filtrosAplicados: { ...FILTROS_LISTAGEM_DEFINICAO_POLOS_INICIAIS },
        paginaAtual: 1,
      }),
  }),
)
