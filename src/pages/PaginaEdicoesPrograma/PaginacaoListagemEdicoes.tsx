import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '../../components/icons'
import { OPCOES_ITENS_POR_PAGINA } from './constantesPaginacao'
import { montarPaginasVisiveis } from './montarPaginasVisiveis'
import {
  BotaoNavegacaoPagina,
  BotaoPaginaNumerica,
  ContainerPaginacaoListagem,
  GrupoControlesPaginacao,
  IndicadorReticenciasPagina,
  ListaPaginas,
  RotuloAcessivelSeletorItensPorPagina,
  SeletorItensPorPagina,
} from './tabelaListagemStyles'

type PaginacaoListagemEdicoesProps = {
  paginaAtual: number
  totalPaginas: number
  itensPorPagina: number
  onMudarPagina: (pagina: number) => void
  onMudarItensPorPagina: (itensPorPagina: number) => void
}

export function PaginacaoListagemEdicoes({
  paginaAtual,
  totalPaginas,
  itensPorPagina,
  onMudarPagina,
  onMudarItensPorPagina,
}: PaginacaoListagemEdicoesProps) {
  const paginasVisiveis = montarPaginasVisiveis(paginaAtual, totalPaginas)

  return (
    <ContainerPaginacaoListagem aria-label="Paginação da listagem de edições">
      <GrupoControlesPaginacao>
        <BotaoNavegacaoPagina
          type="button"
          aria-label="Página anterior"
          disabled={paginaAtual <= 1}
          onClick={() => onMudarPagina(paginaAtual - 1)}
        >
          <ChevronLeftIcon />
        </BotaoNavegacaoPagina>

        <ListaPaginas>
          {paginasVisiveis.map((item, index) => {
            if (item === 'ellipsis') {
              return (
                <IndicadorReticenciasPagina
                  key={`ellipsis-${index}`}
                  aria-hidden="true"
                >
                  ...
                </IndicadorReticenciasPagina>
              )
            }

            const pagina = item
            const ativa = pagina === paginaAtual

            return (
              <BotaoPaginaNumerica
                key={pagina}
                type="button"
                $ativa={ativa}
                aria-label={`Página ${pagina}`}
                aria-current={ativa ? 'page' : undefined}
                onClick={() => onMudarPagina(pagina)}
              >
                {pagina}
              </BotaoPaginaNumerica>
            )
          })}
        </ListaPaginas>

        <BotaoNavegacaoPagina
          type="button"
          aria-label="Próxima página"
          disabled={paginaAtual >= totalPaginas}
          onClick={() => onMudarPagina(paginaAtual + 1)}
        >
          <ChevronRightIcon />
        </BotaoNavegacaoPagina>

        <SeletorItensPorPagina>
          <RotuloAcessivelSeletorItensPorPagina>
            Itens por página
          </RotuloAcessivelSeletorItensPorPagina>
          <select
            value={itensPorPagina}
            aria-label="Itens por página"
            onChange={(evento) =>
              onMudarItensPorPagina(Number(evento.target.value))
            }
          >
            {OPCOES_ITENS_POR_PAGINA.map((opcao) => (
              <option key={opcao} value={opcao}>
                {opcao}
              </option>
            ))}
          </select>
          <ChevronDownIcon />
        </SeletorItensPorPagina>
      </GrupoControlesPaginacao>
    </ContainerPaginacaoListagem>
  )
}
