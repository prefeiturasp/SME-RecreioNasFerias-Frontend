import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { listarDefinicoesPolo } from '@/services/definicaoPolo/listarDefinicoesPolo'
import type { ListagemDefinicoesPoloPaginada } from '@/services/definicaoPolo/types'
import { useDefinicaoPoloStore } from '@/stores/filtroDefinicaoPolosStore'
import { useShallow } from 'zustand/react/shallow'

export function useGetDefinicoesPolo() {
  const { filtrosAplicados, paginaAtual, itensPorPagina } =
    useDefinicaoPoloStore(
      useShallow((estado) => ({
        filtrosAplicados: estado.filtrosAplicados,
        paginaAtual: estado.paginaAtual,
        itensPorPagina: estado.itensPorPagina,
      })),
    )

  const parametrosComPaginacao = {
    ...filtrosAplicados,
    page: paginaAtual,
    page_size: itensPorPagina,
  }

  return useQuery<ListagemDefinicoesPoloPaginada, Error>({
    queryKey: ['definicoesPolo', parametrosComPaginacao],
    queryFn: () => listarDefinicoesPolo(parametrosComPaginacao),
    placeholderData: keepPreviousData,
  })
}

export default useGetDefinicoesPolo
