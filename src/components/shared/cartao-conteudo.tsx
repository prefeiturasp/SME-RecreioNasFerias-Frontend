import type { ComponentProps, ComponentPropsWithoutRef, ElementType } from 'react'

import { cn } from '@/lib/utils'

const classesCartaoConteudo =
  'rounded-[var(--size-radius-sm)] bg-[var(--color-background)] p-[var(--size-content-padding)] shadow-[var(--shadow-card)] max-md:p-[var(--size-content-padding-mobile)]'

type CartaoConteudoProps<T extends ElementType = 'div'> = {
  as?: T
  className?: string
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'className'>

export function CartaoConteudo<T extends ElementType = 'div'>({
  as,
  className,
  ...props
}: CartaoConteudoProps<T>) {
  const Componente = as ?? 'div'

  return (
    <Componente className={cn(classesCartaoConteudo, className)} {...props} />
  )
}

export function CartaoFormulario({
  className,
  ref,
  ...props
}: ComponentProps<'form'>) {
  return (
    <form
      ref={ref}
      className={cn(classesCartaoConteudo, className)}
      {...props}
    />
  )
}
