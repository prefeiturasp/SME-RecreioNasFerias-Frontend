import { useQuery } from '@tanstack/react-query'
import { listarPolos } from '@/services/polo/listarPolos'
import type { ListagemPolosPaginada } from '@/services/polo/types'
import { usePoloParceiroStore } from '@/stores/filtroPolosParceirosStore'
import { useShallow } from 'zustand/react/shallow'

export function useGetPolos() {
  const { filtrosAplicados, paginaAtual, itensPorPagina, gestao } =
    usePoloParceiroStore(
      useShallow((estado) => ({
        filtrosAplicados: estado.filtrosAplicados,
        paginaAtual: estado.paginaAtual,
        itensPorPagina: estado.itensPorPagina,
        gestao: estado.gestao,
      })),
    )

  const parametrosComPaginacao = {
    ...filtrosAplicados,
    page: paginaAtual,
    page_size: itensPorPagina,
    gestao: gestao,
  }

  return useQuery<ListagemPolosPaginada, Error>({
    queryKey: ['polos', parametrosComPaginacao],
    queryFn: () => listarPolos(parametrosComPaginacao),
    enabled: true,
  })
}

export default useGetPolos
