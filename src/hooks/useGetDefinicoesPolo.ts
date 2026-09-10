import { useQuery } from '@tanstack/react-query'
import { listarDefinicoesPolo } from '@/services/definicaoPolo/listarDefinicoesPolo'
import type {
  ListagemDefinicoesPoloPaginada,
  ParametrosListagemDefinicoesPolo,
} from '@/services/definicaoPolo/types'

type OpcoesUseGetDefinicoesPolo = {
  refetchInterval?: number | false
}

export function useGetDefinicoesPolo(
  parametros: ParametrosListagemDefinicoesPolo = {},
  opcoes?: OpcoesUseGetDefinicoesPolo,
) {
  const page = parametros.page ?? 1
  const page_size = parametros.page_size ?? 10
  const parametrosComPaginacao = { ...parametros, page, page_size }

  return useQuery<ListagemDefinicoesPoloPaginada, Error>({
    queryKey: ['definicoesPolo', parametrosComPaginacao],
    queryFn: () => listarDefinicoesPolo(parametrosComPaginacao),
    refetchInterval: opcoes?.refetchInterval,
  })
}

export default useGetDefinicoesPolo
