import type { ComponentPropsWithoutRef } from 'react'

import { cn } from '@/lib/utils'

export function EstadoVazio({
  className,
  children,
  ...props
}: Readonly<ComponentPropsWithoutRef<'p'>>) {
  return (
    <p
      className={cn(
        'text-center font-[family-name:var(--font-family)] text-[length:var(--font-size-label)] font-normal text-[var(--color-text)]',
        className,
      )}
      {...props}
    >
      {children}
    </p>
  )
}
