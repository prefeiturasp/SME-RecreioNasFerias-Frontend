import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '../icons'
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
} from './style'

type PaginacaoListagemProps = {
  paginaAtual: number
  totalPaginas: number
  itensPorPagina: number
  rotuloAcessivel?: string
  onMudarPagina: (pagina: number) => void
  onMudarItensPorPagina: (itensPorPagina: number) => void
}

export function PaginacaoListagem({
  paginaAtual,
  totalPaginas,
  itensPorPagina,
  rotuloAcessivel = 'Paginação da listagem',
  onMudarPagina,
  onMudarItensPorPagina,
}: Readonly<PaginacaoListagemProps>) {
  const paginasVisiveis = montarPaginasVisiveis(paginaAtual, totalPaginas)

  return (
    <ContainerPaginacaoListagem aria-label={rotuloAcessivel}>
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
          {paginasVisiveis.map((item) => {
            if (item.tipo === 'ellipsis') {
              return (
                <IndicadorReticenciasPagina
                  key={item.chave}
                  aria-hidden="true"
                >
                  ...
                </IndicadorReticenciasPagina>
              )
            }

            const ativa = item.numero === paginaAtual

            return (
              <BotaoPaginaNumerica
                key={item.chave}
                type="button"
                $ativa={ativa}
                aria-label={`Página ${item.numero}`}
                aria-current={ativa ? 'page' : undefined}
                onClick={() => onMudarPagina(item.numero)}
              >
                {item.numero}
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
