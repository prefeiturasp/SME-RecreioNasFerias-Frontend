import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { montarPaginasVisiveis } from '@/components/ListagemTabela/montarPaginasVisiveis'
import { Button } from '@/components/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from '@/components/ui/pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

export const OPCOES_ITENS_POR_PAGINA = [10, 20, 50] as const

const classeBotaoPagina =
  'rounded-sm border-border focus-visible:border-border focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:translate-y-0'

const classeBotaoNavegacao = cn(
  classeBotaoPagina,
  'text-brand-dark hover:border-brand-dark hover:bg-accent hover:text-brand-dark disabled:pointer-events-auto disabled:cursor-not-allowed disabled:text-placeholder disabled:opacity-60',
)

type PaginacaoEdicoesProgramaProps = {
  paginaAtual: number
  totalPaginas: number
  itensPorPagina: number
  onMudarPagina: (pagina: number) => void
  onMudarItensPorPagina: (itensPorPagina: number) => void
}

export function PaginacaoEdicoesPrograma({
  paginaAtual,
  totalPaginas,
  itensPorPagina,
  onMudarPagina,
  onMudarItensPorPagina,
}: Readonly<PaginacaoEdicoesProgramaProps>) {
  const paginasVisiveis = montarPaginasVisiveis(paginaAtual, totalPaginas)

  return (
    <Pagination aria-label="Paginação da listagem de edições" className="mt-6">
      <PaginationContent className="flex-wrap justify-center gap-1.5">
        <PaginationItem>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Página anterior"
            disabled={paginaAtual <= 1}
            className={classeBotaoNavegacao}
            onClick={() => onMudarPagina(paginaAtual - 1)}
          >
            <ChevronLeftIcon />
          </Button>
        </PaginationItem>

        {paginasVisiveis.map((item) => {
          if (item.tipo === 'ellipsis') {
            return (
              <PaginationItem key={item.chave}>
                <PaginationEllipsis className="text-foreground" />
              </PaginationItem>
            )
          }

          const ativa = item.numero === paginaAtual

          return (
            <PaginationItem key={item.chave}>
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label={`Página ${item.numero}`}
                aria-current={ativa ? 'page' : undefined}
                className={cn(
                  classeBotaoPagina,
                  'min-w-8 w-auto px-1.5',
                  ativa
                    ? 'border-brand-dark bg-brand-dark font-bold text-background hover:border-brand-dark hover:bg-brand-dark-hover hover:text-background'
                    : 'hover:border-brand-dark hover:bg-accent',
                )}
                onClick={() => onMudarPagina(item.numero)}
              >
                {item.numero}
              </Button>
            </PaginationItem>
          )
        })}

        <PaginationItem>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Próxima página"
            disabled={paginaAtual >= totalPaginas}
            className={classeBotaoNavegacao}
            onClick={() => onMudarPagina(paginaAtual + 1)}
          >
            <ChevronRightIcon />
          </Button>
        </PaginationItem>

        <PaginationItem>
          <Select
            value={String(itensPorPagina)}
            onValueChange={(valor) => onMudarItensPorPagina(Number(valor))}
          >
            <SelectTrigger
              aria-label="Itens por página"
              className="min-w-18 rounded-sm border-border bg-background py-0 pr-7 pl-3 focus-visible:border-border focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:bg-background [&_svg]:text-foreground"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-sm">
              {OPCOES_ITENS_POR_PAGINA.map((opcao) => (
                <SelectItem
                  key={opcao}
                  value={String(opcao)}
                  className="rounded-sm"
                >
                  {opcao}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
