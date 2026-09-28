import type { ReactNode } from 'react'

import { ChevronDownIcon } from '@/components/icons'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

type SecaoFormularioProps = {
  titulo: string
  aberta?: boolean
  children: ReactNode
}

export function SecaoFormulario({
  titulo,
  aberta = false,
  children,
}: Readonly<SecaoFormularioProps>) {
  return (
    <div className="flex overflow-hidden rounded-sm border border-gray-300">
      <span aria-hidden="true" className="w-2.5 shrink-0 bg-brand-dark" />
      <Collapsible className="group min-w-0 flex-1" defaultOpen={aberta}>
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="flex w-full cursor-pointer items-center gap-2 px-5 py-3 text-left data-[state=open]:border-b data-[state=open]:border-gray-300"
          >
            <span className="grow font-semibold text-brand-dark">{titulo}</span>
            <span className="shrink-0 text-sm font-normal text-muted-foreground">
              <span className="text-destructive">*</span> Campos obrigatórios
            </span>
            <ChevronDownIcon className="size-6 shrink-0 text-brand-dark transition-transform group-data-[state=open]:rotate-180" />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="px-5 py-4">{children}</CollapsibleContent>
      </Collapsible>
    </div>
  )
}
