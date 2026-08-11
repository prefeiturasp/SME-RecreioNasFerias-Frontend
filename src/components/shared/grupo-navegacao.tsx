import { Link } from 'react-router-dom'
import { ChevronDownIcon } from '@/components/icons'
import type { ItemNavegacao } from '@/lib/navigation'
import { cn } from '@/lib/utils'

type GrupoNavegacaoProps = {
  id: string
  rotulo: string
  icone: string
  subitens: readonly ItemNavegacao[]
  expandido: boolean
  onAlternar: () => void
  caminhoAtual: string
}

export function GrupoNavegacao({
  id,
  rotulo,
  icone,
  subitens,
  expandido,
  onAlternar,
  caminhoAtual,
}: Readonly<GrupoNavegacaoProps>) {
  const idSubmenu = `submenu-${id}`

  return (
    <div className="box-border w-full overflow-hidden rounded-sm bg-white">
      <div className="flex w-full items-center">
        <button
          type="button"
          aria-expanded={expandido}
          aria-controls={idSubmenu}
          onClick={onAlternar}
          className="flex w-full min-h-[25px] items-center gap-[5px] px-2 py-3 text-left text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white"
        >
          <span
            aria-hidden="true"
            className="flex size-[25px] shrink-0 items-center justify-center bg-brand-dark"
            style={{
              mask: `url(${icone}) center / contain no-repeat`,
              WebkitMask: `url(${icone}) center / contain no-repeat`,
            }}
          />
          <span className="flex min-h-[25px] flex-1 items-center font-sans text-[14px] leading-none font-bold text-brand-dark">
            {rotulo}
          </span>
          <span
            className={cn(
              'flex size-6 shrink-0 items-center justify-center text-brand-dark transition-transform duration-200 ease-in-out [&_svg]:size-6',
              expandido && 'rotate-180',
            )}
          >
            <ChevronDownIcon />
          </span>
        </button>
      </div>

      {expandido && (
        <ul
          id={idSubmenu}
          className="m-0 flex list-none flex-col border-t border-[#e5e5e5] p-0"
        >
          {subitens.map((subitem, indice) => {
            const ativo = caminhoAtual.startsWith(subitem.caminho)

            return (
              <li key={subitem.caminho}>
                <Link
                  to={subitem.caminho}
                  className={cn(
                    'block py-3 pr-2 pl-[41px] font-sans text-[14px] leading-[1.2] font-bold no-underline',
                    'hover:bg-surface-muted hover:text-brand-dark',
                    'focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-dark',
                    indice > 0 && 'border-t border-[#e5e5e5]',
                    ativo
                      ? 'bg-surface-muted text-brand-dark'
                      : 'bg-transparent text-[#6b6b6b]',
                  )}
                >
                  {subitem.rotulo}
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
