import { PaginacaoListagem } from '../../components/ListagemTabela/PaginacaoListagem'

type PaginacaoListagemEdicoesProps = {
  paginaAtual: number
  totalPaginas: number
  itensPorPagina: number
  onMudarPagina: (pagina: number) => void
  onMudarItensPorPagina: (itensPorPagina: number) => void
}

export function PaginacaoListagemEdicoes(
  props: Readonly<PaginacaoListagemEdicoesProps>,
) {
  return (
    <PaginacaoListagem
      rotuloAcessivel="Paginação da listagem de edições"
      {...props}
    />
  )
}
