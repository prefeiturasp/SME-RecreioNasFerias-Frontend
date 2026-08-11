import type { ComponentPropsWithoutRef } from 'react'

import { cn } from '@/lib/utils'

export function ContainerPagina({
  className,
  ...props
}: Readonly<ComponentPropsWithoutRef<'main'>>) {
  return (
    <main
      className={cn('flex h-full w-full overflow-hidden', className)}
      {...props}
    />
  )
}

export function SecaoPrincipal({
  className,
  ...props
}: Readonly<ComponentPropsWithoutRef<'section'>>) {
  return (
    <section
      className={cn(
        'flex h-screen min-w-0 flex-1 flex-col bg-[var(--color-main-background)]',
        className,
      )}
      {...props}
    />
  )
}

export function AreaConteudo({
  className,
  ...props
}: Readonly<ComponentPropsWithoutRef<'div'>>) {
  return (
    <div
      className={cn(
        'min-h-0 flex-1 overflow-auto p-[var(--size-content-padding)] max-md:p-[var(--size-content-padding-mobile)]',
        className,
      )}
      {...props}
    />
  )
}
