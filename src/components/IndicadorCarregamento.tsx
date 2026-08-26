import type { ComponentProps } from 'react'

import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'

export function IndicadorCarregamento({
  mensagem = 'Carregando...',
  className,
  ...props
}: Readonly<
  {
    mensagem?: string
  } & ComponentProps<'output'>
>) {
  return (
    <output
      aria-live="polite"
      className={cn(
        'flex min-h-20 w-full items-center justify-center gap-3 px-4 py-6 text-sm font-medium text-foreground',
        className,
      )}
      {...props}
    >
      <Spinner
        className="size-5 text-brand-dark"
        role="presentation"
        aria-hidden="true"
      />
      <span>{mensagem}</span>
    </output>
  )
}
