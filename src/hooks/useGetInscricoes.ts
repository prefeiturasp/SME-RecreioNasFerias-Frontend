import { useQuery } from '@tanstack/react-query'
import { listarInscricoes } from '@/services/inscricao/listarInscricoes'
import { useInscricoesParticipantesStore } from '@/stores/filtroInscricoesParticipantesStore'
import { useShallow } from 'zustand/react/shallow'

export function useGetInscricoes() {
  const { filtrosAplicados, paginaAtual, itensPorPagina } =
    useInscricoesParticipantesStore(
      useShallow((estado) => ({
        filtrosAplicados: estado.filtrosAplicados,
        paginaAtual: estado.paginaAtual,
        itensPorPagina: estado.itensPorPagina,
      })),
    )

  const filtrosPreenchidos = Object.fromEntries(
    Object.entries(filtrosAplicados).filter(([, valor]) => valor !== ''),
  )

  const parametrosComPaginacao = {
    ...filtrosPreenchidos,
    page: paginaAtual,
    page_size: itensPorPagina,
  }

  return useQuery({
    queryKey: ['inscricoes', parametrosComPaginacao],
    queryFn: () => listarInscricoes(parametrosComPaginacao),
  })
}

export default useGetInscricoes
