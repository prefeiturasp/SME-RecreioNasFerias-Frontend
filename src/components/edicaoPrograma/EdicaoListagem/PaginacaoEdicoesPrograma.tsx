import { ChevronLeftIcon, ChevronRightIcon } from '@/components/icons'
import { OPCOES_ITENS_POR_PAGINA } from '@/components/ListagemTabela/constantesPaginacao'
import { montarPaginasVisiveis } from '@/components/ListagemTabela/montarPaginasVisiveis'
import { Button } from '@/components/ui/button'
import {
  Pagination,
  PaginationContent,
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
    <Pagination
      aria-label="Paginação da listagem de edições"
      className="mt-6 mx-0 w-full justify-center"
    >
      <PaginationContent className="flex-wrap justify-center gap-1.5">
        <PaginationItem>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Página anterior"
            disabled={paginaAtual <= 1}
            className="size-8 rounded-sm border-[#e1e1e1] bg-background p-0 text-brand-dark shadow-none hover:border-brand-dark hover:bg-(--color-button-outline-hover-bg) hover:text-brand-dark focus-visible:border-[#e1e1e1] focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:translate-y-0 disabled:pointer-events-auto disabled:cursor-not-allowed disabled:text-placeholder disabled:opacity-60"
            onClick={() => onMudarPagina(paginaAtual - 1)}
          >
            <ChevronLeftIcon />
          </Button>
        </PaginationItem>

        {paginasVisiveis.map((item) => {
          if (item.tipo === 'ellipsis') {
            return (
              <PaginationItem key={item.chave}>
                <span
                  aria-hidden="true"
                  className="inline-flex h-8 min-w-8 items-center justify-center text-sm text-foreground"
                >
                  ...
                </span>
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
                  'h-8 min-w-8 w-auto rounded-sm px-1.5 text-sm shadow-none focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:translate-y-0',
                  ativa
                    ? 'border-brand-dark bg-brand-dark font-bold text-background hover:border-brand-dark hover:bg-brand-dark-hover hover:text-background focus-visible:border-brand-dark'
                    : 'border-[#e1e1e1] bg-background font-normal text-foreground hover:border-brand-dark hover:bg-(--color-button-outline-hover-bg) hover:text-foreground focus-visible:border-[#e1e1e1]',
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
            className="size-8 rounded-sm border-[#e1e1e1] bg-background p-0 text-brand-dark shadow-none hover:border-brand-dark hover:bg-(--color-button-outline-hover-bg) hover:text-brand-dark focus-visible:border-[#e1e1e1] focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:translate-y-0 disabled:pointer-events-auto disabled:cursor-not-allowed disabled:text-placeholder disabled:opacity-60"
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
              className="h-8 min-w-[4.5rem] rounded-sm border-[#e1e1e1] bg-background py-0 pr-7 pl-3 text-sm font-normal text-foreground shadow-none focus-visible:border-[#e1e1e1] focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:bg-background [&_svg]:size-4 [&_svg]:text-foreground"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-sm text-sm">
              {OPCOES_ITENS_POR_PAGINA.map((opcao) => (
                <SelectItem
                  key={opcao}
                  value={String(opcao)}
                  className="rounded-sm text-sm"
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
