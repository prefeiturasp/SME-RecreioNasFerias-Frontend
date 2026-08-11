import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type CabecalhoSecaoProps = {
  titulo: ReactNode
  acoes?: ReactNode
  className?: string
}

export function CabecalhoSecao({
  titulo,
  acoes,
  className,
}: Readonly<CabecalhoSecaoProps>) {
  return (
    <div
      className={cn(
        'mt-[var(--size-content-padding)] mb-4 flex flex-wrap items-center justify-between gap-4',
        '[&>h3]:font-[family-name:var(--font-family)] [&>h3]:text-[length:var(--font-size-section-title)] [&>h3]:leading-[1.2] [&>h3]:font-bold',
        '[&>div]:flex [&>div]:flex-wrap [&>div]:items-center [&>div]:justify-end [&>div]:gap-2.5',
        'max-md:flex-col max-md:items-stretch',
        'max-md:[&>div]:flex-col max-md:[&>div]:items-stretch max-md:[&>div>button]:w-full',
        className,
      )}
    >
      <h3>{titulo}</h3>
      {acoes != null ? <div>{acoes}</div> : null}
    </div>
  )
}
