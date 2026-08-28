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
import { OPCOES_ITENS_POR_PAGINA } from '@/constants/paginacao'
import { cn } from '@/lib/utils'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

type PaginacaoProps = {
  paginaAtual: number
  totalPaginas: number
  itensPorPagina: number
  rotuloAcessivel?: string
  onMudarPagina: (pagina: number) => void
  onMudarItensPorPagina: (itensPorPagina: number) => void
}

export function Paginacao({
  paginaAtual,
  totalPaginas,
  itensPorPagina,
  rotuloAcessivel = 'Paginação da listagem',
  onMudarPagina,
  onMudarItensPorPagina,
}: Readonly<PaginacaoProps>) {
  const paginasVisiveis = montarPaginasVisiveis(paginaAtual, totalPaginas)

  return (
    <Pagination aria-label={rotuloAcessivel} className="mt-6">
      <PaginationContent className="flex-wrap justify-center gap-1.5">
        <PaginationItem>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Página anterior"
            disabled={paginaAtual <= 1}
            className="text-brand-dark border-none p-1.5!"
            onClick={() => onMudarPagina(paginaAtual - 1)}
          >
            <ChevronLeftIcon />
          </Button>
        </PaginationItem>

        {paginasVisiveis.map((item) => {
          if (item.tipo === 'ellipsis') {
            return (
              <PaginationItem key={item.chave}>
                <PaginationEllipsis />
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
                  'min-w-8 w-auto p-1.5!',
                  ativa &&
                    'border-brand-dark bg-brand-dark font-bold text-background hover:border-brand-dark hover:bg-brand-dark-hover hover:text-background',
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
            className="text-brand-dark border-none p-1.5!"
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
            <SelectTrigger aria-label="Itens por página" className="min-w-18">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {OPCOES_ITENS_POR_PAGINA.map((opcao) => (
                <SelectItem key={opcao} value={String(opcao)}>
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
