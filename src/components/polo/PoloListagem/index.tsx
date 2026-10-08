import { useEffect } from 'react'
import type { AxiosError } from 'axios'
import { Link } from 'react-router-dom'
import { iconeLapisEditar } from '@/assets'
import { IndicadorCarregamento } from '@/components/IndicadorCarregamento'
import { TabelaListagem } from '@/components/TabelaListagem'
import type { DefinicaoColuna } from '@/components/TabelaListagem/types'
import { Button } from '@/components/ui/button'
import { useGetPolos } from '@/hooks/useGetPolos'
import type { FiltrosPolo } from '@/constants/filtroPolos'
import type { PoloListagemItem } from '@/services/polo/types'
import { usePoloParceiroStore } from '@/stores/filtroPolosParceirosStore'
import { Filtros } from './Filtros'
import { CollapsibleFilter } from '@/components/CollapsibleFilter'
import { IconeFiltro } from '@/components/icons'
import { useToast } from '@/hooks/useToast'
import { useShallow } from 'zustand/react/shallow'

const TOAST_ERRO_LISTAGEM_ID = 'erro-listagem-polos-parceiros'
type ErroApi = AxiosError<{ detalhe: string }>

const COLUNAS = [
  {
    id: 'nome_polo',
    rotulo: 'Nome do polo',
    valorOrdenacao: (polo) => polo.nome_polo,
    renderizar: (polo) => polo.nome_polo,
  },
  {
    id: 'nome_osc',
    rotulo: 'Nome da OSC',
    valorOrdenacao: (polo) => polo.nome_osc,
    renderizar: (polo) => polo.nome_osc,
  },
  {
    id: 'dre_nome',
    rotulo: 'DRE',
    valorOrdenacao: (polo) => polo.dre_nome,
    renderizar: (polo) => polo.dre_nome,
  },
  {
    id: 'tipo_ue',
    rotulo: 'Tipo de UE',
    valorOrdenacao: (polo) => polo.tipo_ue,
    renderizar: (polo) => polo.tipo_ue,
  },
  {
    id: 'gestao',
    rotulo: 'Gestão',
    valorOrdenacao: (polo) => polo.gestao,
    renderizar: (polo) => polo.gestao_label,
  },
  {
    id: 'status',
    rotulo: 'Status',
    valorOrdenacao: (polo) => polo.status,
    renderizar: (polo) => polo.status_label,
  },
] as const satisfies readonly DefinicaoColuna<PoloListagemItem>[]

function existemFiltrosAplicados(filtros: FiltrosPolo) {
  return Boolean(filtros.busca || filtros.dre_codigo_eol || filtros.tipo_ue)
}

export function PoloListagem() {
  const { showToast } = useToast()

  const {
    filtrosAplicados,
    paginaAtual,
    itensPorPagina,
    setPaginaAtual,
    setItensPorPagina,
  } = usePoloParceiroStore(
    useShallow((estado) => ({
      filtrosAplicados: estado.filtrosAplicados,
      paginaAtual: estado.paginaAtual,
      itensPorPagina: estado.itensPorPagina,
      setPaginaAtual: estado.setPaginaAtual,
      setItensPorPagina: estado.setItensPorPagina,
    })),
  )

  const { data: listagemPolos, isPending, isError, error } = useGetPolos()

  function mudarItensPorPagina(novoTamanho: number) {
    setItensPorPagina(novoTamanho)
    setPaginaAtual(1)
  }

  const polosCarregados = listagemPolos?.results ?? []
  const totalRegistros = listagemPolos?.count ?? 0
  const totalPaginas = Math.ceil(totalRegistros / itensPorPagina)

  useEffect(() => {
    if (!isError) return

    showToast({
      id: TOAST_ERRO_LISTAGEM_ID,
      variant: 'destructive',
      title: 'Erro ao carregar polos parceiros',
      description: (error as ErroApi).response?.data.detalhe,
    })
  }, [error, isError, showToast])

  return (
    <div className="flex flex-col gap-4 bg-white p-4">
      <CollapsibleFilter icon={<IconeFiltro />} title="Filtrar Polos">
        <Filtros />
      </CollapsibleFilter>

      {isPending && <IndicadorCarregamento mensagem="Carregando polos..." />}

      {!isPending && !isError && (
        <TabelaListagem
          itens={polosCarregados}
          colunas={COLUNAS}
          obterId={(polo) => polo.uuid}
          colunaOrdenacaoInicial="nome_polo"
          modoPaginacao="servidor"
          paginaAtual={paginaAtual}
          totalPaginas={totalPaginas}
          itensPorPagina={itensPorPagina}
          onMudarPagina={setPaginaAtual}
          onMudarItensPorPagina={mudarItensPorPagina}
          rotuloAcessivelPaginacao="Paginação da listagem de polos"
          mensagemVazia={
            existemFiltrosAplicados(filtrosAplicados)
              ? 'Nenhum resultado para os filtros selecionados'
              : 'Nenhum polo cadastrado'
          }
          renderizarAcoes={(polo) => (
            <Button
              asChild
              variant="ghost"
              size="icon-sm"
              className="text-brand-dark"
            >
              <Link
                to={`/editar-polo-parceiro/${polo.uuid}`}
                aria-label={`Editar polo ${polo.nome_polo}`}
              >
                <img
                  src={iconeLapisEditar}
                  alt=""
                  aria-hidden="true"
                  className="size-5"
                />
              </Link>
            </Button>
          )}
        />
      )}
    </div>
  )
}

export default PoloListagem
