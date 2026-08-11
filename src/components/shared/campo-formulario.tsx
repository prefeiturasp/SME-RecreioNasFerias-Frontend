import type { ComponentPropsWithoutRef } from 'react'

import { cn } from '@/lib/utils'

export function CampoFormulario({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={cn(
        'flex min-w-0 flex-col',
        '[&>label]:mb-1 [&>label]:font-[family-name:var(--font-family)] [&>label]:text-[length:var(--font-size-label)] [&>label]:font-bold [&>label]:text-[var(--color-text)]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function LinhaFormulario({
  className,
  ...props
}: ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={cn(
        'mb-[var(--size-form-row-gap)] grid grid-cols-3 gap-x-[var(--size-form-column-gap)] gap-y-[var(--size-form-row-gap)] max-lg:grid-cols-1',
        className,
      )}
      {...props}
    />
  )
}

export function AcoesFormulario({
  className,
  ...props
}: ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-end gap-2',
        'max-md:flex-col-reverse max-md:items-stretch max-md:[&>button]:w-full',
        className,
      )}
      {...props}
    />
  )
}
