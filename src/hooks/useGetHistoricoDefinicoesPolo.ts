import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type {
  ListagemHistoricoDefinicaoPolo,
  ParametrosHistoricoDefinicaoPolo,
} from '@/services/definicaoPolo/types'
import { listarHistoricoDefinicaoPolo } from '@/services/definicaoPolo/listarHistoricoDefinicaoPolo'

export function useGetHistoricoDefinicoesPolo(
  parametros: ParametrosHistoricoDefinicaoPolo,
) {
  const page = parametros.page ?? 1
  const page_size = parametros.page_size ?? 10
  const desabilita_paginacao = parametros.desabilita_paginacao ?? false
  const parametrosComPaginacao = {
    ...parametros,
    page,
    page_size,
    desabilita_paginacao,
  }

  return useQuery<ListagemHistoricoDefinicaoPolo, Error>({
    queryKey: ['historicoDefinicoesPolo', parametrosComPaginacao],
    queryFn: () => listarHistoricoDefinicaoPolo(parametrosComPaginacao),
    placeholderData: keepPreviousData,
  })
}

export default useGetHistoricoDefinicoesPolo
