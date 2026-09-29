import type { ReactNode } from 'react'

import { ChevronDownIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'
import { Link } from 'react-router-dom'

type SubitemMenu = {
  rotulo: string
  caminho: string
}

type GrupoMenuProps = {
  rotulo: string
  idSubmenu: string
  expandido: boolean
  onExpandidoChange: (aberto: boolean) => void
  icone: ReactNode
  subitens: readonly SubitemMenu[]
  pathname: string
}

export function GrupoMenu({
  rotulo,
  idSubmenu,
  expandido,
  onExpandidoChange,
  icone,
  subitens,
  pathname,
}: Readonly<GrupoMenuProps>) {
  return (
    <Collapsible
      open={expandido}
      onOpenChange={onExpandidoChange}
      className="w-full overflow-hidden rounded-sm bg-background"
    >
      <CollapsibleTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="flex h-auto w-full min-h-6 items-center justify-start gap-1.5 rounded-none px-2 py-3 text-left text-brand-dark hover:bg-transparent focus-visible:outline focus-visible:-outline-offset-2 focus-visible:outline-background"
          aria-controls={idSubmenu}
        >
          {icone}
          <span className="flex min-h-6 flex-1 items-center text-sm leading-none font-bold text-brand-dark">
            {rotulo}
          </span>
          <span
            className={cn(
              'flex size-6 shrink-0 items-center justify-center text-brand-dark transition-transform duration-200 [&_svg]:size-6',
              expandido && 'rotate-180',
            )}
          >
            <ChevronDownIcon />
          </span>
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <ul
          id={idSubmenu}
          className="m-0 flex list-none flex-col border-t border-border p-0"
        >
          {subitens.map((subitem) => {
            const ativo = pathname.startsWith(subitem.caminho)

            return (
              <li key={subitem.caminho}>
                <Link
                  to={subitem.caminho}
                  className={cn(
                    'block border-t border-border py-3 pr-2 pl-10 text-sm leading-tight font-bold no-underline first:border-t-0 hover:bg-surface-muted hover:text-brand-dark focus-visible:outline focus-visible:-outline-offset-2 focus-visible:outline-brand-dark',
                    ativo
                      ? 'bg-surface-muted text-brand-dark'
                      : 'bg-transparent text-muted-foreground',
                  )}
                >
                  {subitem.rotulo}
                </Link>
              </li>
            )
          })}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  )
}
