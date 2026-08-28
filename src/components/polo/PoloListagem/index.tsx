import { useState } from 'react'
import { Link } from 'react-router-dom'
import { iconeLapisEditar } from '@/assets'
import { AlertaErroApi } from '@/components/AlertaErroApi'
import { IndicadorCarregamento } from '@/components/IndicadorCarregamento'
import {
  TabelaListagem,
  type DefinicaoColuna,
} from '@/components/TabelaListagem'
import { Button } from '@/components/ui/button'
import { OPCOES_ITENS_POR_PAGINA } from '@/constants/paginacao'
import { useGetPolos } from '@/hooks/useGetPolos'
import type { PoloDetalhado } from '@/services/polo/types'
import { Filtros } from './Filtros'
import {
  FILTROS_POLO_INICIAIS,
  type FiltrosPolo,
} from '@/constants/filtroPolos'
import { CollapsibleFilter } from '@/components/CollapsibleFilter'
import { IconeFiltro } from '@/components/icons'

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
    renderizar: (polo) => polo.gestao,
  },
  {
    id: 'status',
    rotulo: 'Status',
    valorOrdenacao: (polo) => polo.status,
    renderizar: (polo) => polo.status,
  },
] as const satisfies readonly DefinicaoColuna<PoloDetalhado>[]

function existemFiltrosAplicados(filtros: FiltrosPolo) {
  return Boolean(filtros.busca || filtros.dre_codigo_eol || filtros.tipo_ue)
}

export function PoloListagem() {
  const [filtros, setFiltros] = useState<FiltrosPolo>(FILTROS_POLO_INICIAIS)
  const [filtrosAplicados, setFiltrosAplicados] = useState<FiltrosPolo>(
    FILTROS_POLO_INICIAIS,
  )
  const [paginaAtual, setPaginaAtual] = useState(1)
  const [itensPorPagina, setItensPorPagina] = useState<number>(
    OPCOES_ITENS_POR_PAGINA[0],
  )

  const {
    data: polos,
    isPending,
    isError,
    error,
  } = useGetPolos(
    filtrosAplicados.busca,
    filtrosAplicados.dre_codigo_eol,
    filtrosAplicados.tipo_ue,
  )

  function mudarItensPorPagina(novoTamanho: number) {
    setItensPorPagina(novoTamanho)
    setPaginaAtual(1)
  }

  function aplicarFiltros() {
    setFiltrosAplicados(filtros)
    setPaginaAtual(1)
  }

  function limparFiltros() {
    setFiltros(FILTROS_POLO_INICIAIS)
    setFiltrosAplicados(FILTROS_POLO_INICIAIS)
    setPaginaAtual(1)
  }

  const polosCarregados = polos ?? []
  const totalPaginas = Math.ceil(polosCarregados.length / itensPorPagina)
  const paginaAjustada =
    totalPaginas > 0 ? Math.min(paginaAtual, totalPaginas) : 1

  return (
    <div className="flex flex-col gap-4 bg-white p-4">
      <CollapsibleFilter icon={<IconeFiltro />} title="Filtrar Polos">
        <Filtros
          valores={filtros}
          onChange={setFiltros}
          onFiltrar={aplicarFiltros}
          onLimpar={limparFiltros}
        />
      </CollapsibleFilter>

      {isPending && <IndicadorCarregamento mensagem="Carregando polos..." />}
      {isError && <AlertaErroApi erro={error} />}

      {!isPending && !isError && (
        <TabelaListagem
          itens={polosCarregados}
          colunas={COLUNAS}
          obterId={(polo) => polo.uuid}
          colunaOrdenacaoInicial="nome_polo"
          paginaAtual={paginaAjustada}
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
