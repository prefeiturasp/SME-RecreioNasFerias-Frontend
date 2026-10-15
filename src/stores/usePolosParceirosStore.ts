import { create } from 'zustand'

import {
  FILTROS_POLO_INICIAIS,
  type FiltrosPolo,
} from '@/constants/filtroPolos'

type FiltroPolosParceirosStore = {
  filtros: FiltrosPolo
  filtrosAplicados: FiltrosPolo
  definirFiltros: (filtros: FiltrosPolo) => void
  alterarFiltro: <Campo extends keyof FiltrosPolo>(
    campo: Campo,
    valor: FiltrosPolo[Campo],
  ) => void
  aplicarFiltros: () => void
  limparFiltros: () => void
  paginaAtual: number
  setPaginaAtual: (pagina: number) => void
  itensPorPagina: number
  setItensPorPagina: (itens: number) => void
  gestao: string
}

export const usePoloParceiroStore = create<FiltroPolosParceirosStore>(
  (set) => ({
    filtros: { ...FILTROS_POLO_INICIAIS },
    filtrosAplicados: { ...FILTROS_POLO_INICIAIS },

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
        filtros: { ...FILTROS_POLO_INICIAIS },
        filtrosAplicados: { ...FILTROS_POLO_INICIAIS },
        paginaAtual: 1,
      }),
    paginaAtual: 1,
    setPaginaAtual: (pagina) => set({ paginaAtual: pagina }),
    itensPorPagina: 10,
    setItensPorPagina: (itens) => set({ itensPorPagina: itens }),
    gestao: 'parceira',
  }),
)
