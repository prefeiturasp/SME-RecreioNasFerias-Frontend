import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IndicadorCarregamento } from '@/components/IndicadorCarregamento'
import { OPCOES_ITENS_POR_PAGINA } from '@/components/ListagemTabela/constantesPaginacao'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useGetEdicoesPrograma } from '@/hooks/useGetEdicoesPrograma'
import { ErroListagemEdicoesPrograma } from '@/services/edicaoPrograma/listarEdicoesPrograma'
import { TabelaListagemEdicoesPrograma } from './TabelaListagemEdicoesPrograma'

export function EdicaoListagem() {
  const navigate = useNavigate()
  const listagemQuery = useGetEdicoesPrograma()
  const [paginaAtual, setPaginaAtual] = useState(1)
  const [itensPorPagina, setItensPorPagina] = useState<number>(
    OPCOES_ITENS_POR_PAGINA[0],
  )

  const edicoes = listagemQuery.data ?? []
  const totalPaginas = Math.ceil(edicoes.length / itensPorPagina)
  const paginaAjustada =
    totalPaginas > 0 ? Math.min(paginaAtual, totalPaginas) : 1
  const inicio = (paginaAjustada - 1) * itensPorPagina
  const edicoesDaPagina = edicoes.slice(inicio, inicio + itensPorPagina)

  const mensagemErro =
    listagemQuery.error instanceof ErroListagemEdicoesPrograma
      ? listagemQuery.error.mensagemUsuario
      : ''

  function mudarItensPorPagina(novoTamanho: number) {
    setItensPorPagina(novoTamanho)
    setPaginaAtual(1)
  }

  if (listagemQuery.isPending) {
    return (
      <IndicadorCarregamento mensagem="Carregando edições do programa..." />
    )
  }

  return (
    <>
      {mensagemErro ? (
        <Alert
          variant="destructive"
          className="mb-4 border-[#e8b4b8] bg-[#f8d7da] text-center font-bold text-[#721c24]"
        >
          <AlertDescription className="text-[#721c24]">
            {mensagemErro}
          </AlertDescription>
        </Alert>
      ) : null}

      <TabelaListagemEdicoesPrograma
        edicoes={edicoesDaPagina}
        paginaAtual={paginaAjustada}
        totalPaginas={totalPaginas}
        itensPorPagina={itensPorPagina}
        onMudarPagina={setPaginaAtual}
        onMudarItensPorPagina={mudarItensPorPagina}
        onEditarEdicao={(idEdicao) =>
          navigate(`/editar-edicao-programa/${idEdicao}`)
        }
      />
    </>
  )
}
