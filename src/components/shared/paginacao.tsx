import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@/components/icons'
import { OPCOES_ITENS_POR_PAGINA } from '@/components/ListagemTabela/constantesPaginacao'
import { montarPaginasVisiveis } from '@/components/ListagemTabela/montarPaginasVisiveis'
import { cn } from '@/lib/utils'

type PaginacaoListagemProps = {
  paginaAtual: number
  totalPaginas: number
  itensPorPagina: number
  rotuloAcessivel?: string
  onMudarPagina: (pagina: number) => void
  onMudarItensPorPagina: (itensPorPagina: number) => void
}

const classesBotaoPaginaBase = [
  'inline-flex min-w-8 items-center justify-center rounded-[var(--size-radius-sm)] px-1.5',
  'h-8 font-[family-name:var(--font-family)] text-[length:var(--font-size-label)] font-normal',
  'transition-[background-color,border-color,color] duration-200',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]',
].join(' ')

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
    <nav
      aria-label={rotuloAcessivel}
      className="mt-6 flex flex-wrap items-center justify-center gap-4"
    >
      <div className="inline-flex flex-wrap items-center justify-center gap-1.5">
        <button
          type="button"
          aria-label="Página anterior"
          disabled={paginaAtual <= 1}
          onClick={() => onMudarPagina(paginaAtual - 1)}
          className={cn(
            classesBotaoPaginaBase,
            'size-8 border border-[#e1e1e1] bg-[var(--color-background)] p-0 text-[var(--color-brand-dark)]',
            'hover:not-disabled:border-[var(--color-brand-dark)] hover:not-disabled:bg-[var(--color-button-outline-hover-bg)]',
            'disabled:cursor-not-allowed disabled:text-[var(--color-placeholder)] disabled:opacity-60',
          )}
        >
          <ChevronLeftIcon />
        </button>

        <div className="inline-flex flex-wrap items-center gap-1.5">
          {paginasVisiveis.map((item) => {
            if (item.tipo === 'ellipsis') {
              return (
                <span
                  key={item.chave}
                  aria-hidden="true"
                  className="inline-flex h-8 min-w-8 items-center justify-center font-[family-name:var(--font-family)] text-[length:var(--font-size-label)] text-[var(--color-text)]"
                >
                  ...
                </span>
              )
            }

            const ativa = item.numero === paginaAtual

            return (
              <button
                key={item.chave}
                type="button"
                aria-label={`Página ${item.numero}`}
                aria-current={ativa ? 'page' : undefined}
                onClick={() => onMudarPagina(item.numero)}
                className={cn(
                  classesBotaoPaginaBase,
                  'border',
                  ativa
                    ? 'border-[var(--color-brand-dark)] bg-[var(--color-brand-dark)] font-bold text-[var(--color-background)] hover:bg-[var(--color-brand-dark-hover)]'
                    : 'border-[#e1e1e1] bg-[var(--color-background)] text-[var(--color-text)] hover:border-[var(--color-brand-dark)] hover:bg-[var(--color-button-outline-hover-bg)]',
                )}
              >
                {item.numero}
              </button>
            )
          })}
        </div>

        <button
          type="button"
          aria-label="Próxima página"
          disabled={paginaAtual >= totalPaginas}
          onClick={() => onMudarPagina(paginaAtual + 1)}
          className={cn(
            classesBotaoPaginaBase,
            'size-8 border border-[#e1e1e1] bg-[var(--color-background)] p-0 text-[var(--color-brand-dark)]',
            'hover:not-disabled:border-[var(--color-brand-dark)] hover:not-disabled:bg-[var(--color-button-outline-hover-bg)]',
            'disabled:cursor-not-allowed disabled:text-[var(--color-placeholder)] disabled:opacity-60',
          )}
        >
          <ChevronRightIcon />
        </button>

        <label className="relative inline-flex items-center">
          <span className="absolute m-[-1px] h-px w-px overflow-hidden border-0 p-0 whitespace-nowrap [clip:rect(0,0,0,0)]">
            Itens por página
          </span>
          <select
            value={itensPorPagina}
            aria-label="Itens por página"
            onChange={(evento) =>
              onMudarItensPorPagina(Number(evento.target.value))
            }
            className={cn(
              'h-8 min-w-[4.5rem] cursor-pointer appearance-none rounded-[var(--size-radius-sm)] border border-[#e1e1e1] bg-[var(--color-background)]',
              'pr-7 pl-3 font-[family-name:var(--font-family)] text-[length:var(--font-size-label)] font-normal text-[var(--color-text)]',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]',
            )}
          >
            {OPCOES_ITENS_POR_PAGINA.map((opcao) => (
              <option key={opcao} value={opcao}>
                {opcao}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-2 text-[var(--color-text)]">
            <ChevronDownIcon />
          </span>
        </label>
      </div>
    </nav>
  )
}
