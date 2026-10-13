import { create } from 'zustand'
import {
  type FiltrosIncricoesParticipantes,
  FILTROS_LISTAGEM_INSCRICOES_PARTICIPANTES_INICIAIS,
} from '../services/inscricao/types'

type FiltrosInscricoesParticipantesStore = {
  filtros: FiltrosIncricoesParticipantes
  filtrosAplicados: FiltrosIncricoesParticipantes
  definirFiltros: (filtros: FiltrosIncricoesParticipantes) => void
  alterarFiltro: <Campo extends keyof FiltrosIncricoesParticipantes>(
    campo: Campo,
    valor: FiltrosIncricoesParticipantes[Campo],
  ) => void
  aplicarFiltros: () => void
  limparFiltros: () => void
  paginaAtual: number
  setPaginaAtual: (pagina: number) => void
  itensPorPagina: number
  setItensPorPagina: (itens: number) => void
}

export const useInscricoesParticipantesStore =
  create<FiltrosInscricoesParticipantesStore>((set) => ({
    paginaAtual: 1,
    setPaginaAtual: (pagina) => set({ paginaAtual: pagina }),
    itensPorPagina: 10,
    setItensPorPagina: (itens) => set({ itensPorPagina: itens }),
    filtros: { ...FILTROS_LISTAGEM_INSCRICOES_PARTICIPANTES_INICIAIS },
    filtrosAplicados: { ...FILTROS_LISTAGEM_INSCRICOES_PARTICIPANTES_INICIAIS },

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
        filtros: { ...FILTROS_LISTAGEM_INSCRICOES_PARTICIPANTES_INICIAIS },
        filtrosAplicados: {
          ...FILTROS_LISTAGEM_INSCRICOES_PARTICIPANTES_INICIAIS,
        },
        paginaAtual: 1,
      }),
  }))
