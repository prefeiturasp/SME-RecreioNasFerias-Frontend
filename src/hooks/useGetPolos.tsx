import { useQuery } from '@tanstack/react-query'
import { listarPolos } from '@/services/polo/listarPolos'
import type { ListagemPolosPaginada } from '@/services/polo/types'

export function useGetPolos(
  busca?: string,
  dre_codigo_eol?: string,
  tipo_ue?: string,
  page = 1,
  page_size = 10,
  gestao?: string,
) {
  return useQuery<ListagemPolosPaginada, Error>({
    queryKey: [
      'polos',
      busca,
      dre_codigo_eol,
      tipo_ue,
      page,
      page_size,
      gestao,
    ],
    queryFn: () =>
      listarPolos(busca, dre_codigo_eol, tipo_ue, page, page_size, gestao),
  })
}

export default useGetPolos
