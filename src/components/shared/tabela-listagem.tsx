import type { ComponentPropsWithoutRef } from 'react'

import { cn } from '@/lib/utils'

export function TituloListagem({
  className,
  ...props
}: ComponentPropsWithoutRef<'p'>) {
  return (
    <p
      className={cn(
        'mb-4 font-[family-name:var(--font-family)] text-[length:var(--font-size-label)] font-semibold text-[var(--color-brand-dark)]',
        className,
      )}
      {...props}
    />
  )
}

export function ContainerTabelaListagem({
  className,
  ...props
}: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('w-full overflow-x-auto', className)} {...props} />
}

export function TabelaListagem({
  className,
  ...props
}: ComponentPropsWithoutRef<'table'>) {
  return (
    <table
      className={cn(
        'w-full min-w-[56rem] border-collapse bg-[var(--color-background)]',
        className,
      )}
      {...props}
    />
  )
}

export function CabecalhoTabelaListagem({
  className,
  ...props
}: ComponentPropsWithoutRef<'thead'>) {
  return (
    <thead
      className={cn(
        'bg-[#f1f3f5] [&_th]:border [&_th]:border-[#e1e1e1] [&_th]:px-4 [&_th]:py-3',
        '[&_th]:text-left [&_th]:font-[family-name:var(--font-family)] [&_th]:text-[length:var(--font-size-label)] [&_th]:font-bold [&_th]:whitespace-nowrap [&_th]:text-[var(--color-text)]',
        className,
      )}
      {...props}
    />
  )
}

export function CorpoTabelaListagem({
  className,
  ...props
}: ComponentPropsWithoutRef<'tbody'>) {
  return (
    <tbody
      className={cn(
        '[&_td]:border [&_td]:border-[#e1e1e1] [&_td]:px-4 [&_td]:py-3',
        '[&_td]:align-middle [&_td]:font-[family-name:var(--font-family)] [&_td]:text-[length:var(--font-size-label)] [&_td]:font-normal [&_td]:text-[var(--color-text)]',
        className,
      )}
      {...props}
    />
  )
}

export function BotaoOrdenarColuna({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<'button'>) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center gap-1.5 font-[inherit] text-[inherit]',
        '[&>svg]:size-[0.625rem] [&>svg]:h-3 [&>svg]:w-2.5 [&>svg]:shrink-0 [&>svg]:text-[#929394] hover:[&>svg]:text-[var(--color-text)]',
        'focus-visible:rounded-[2px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function CelulaAcoesListagem({
  className,
  ...props
}: ComponentPropsWithoutRef<'td'>) {
  return (
    <td
      className={cn('text-center whitespace-nowrap', className)}
      {...props}
    />
  )
}

export function GrupoAcoesListagem({
  className,
  ...props
}: ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={cn('inline-flex items-center justify-center gap-2', className)}
      {...props}
    />
  )
}

export function BotaoAcaoListagem({
  className,
  type = 'button',
  ...props
}: ComponentPropsWithoutRef<'button'>) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex size-7 items-center justify-center rounded-[var(--size-radius-sm)] text-[var(--color-brand-dark)] transition-[background-color] duration-200',
        'hover:bg-[rgba(29,10,85,0.08)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]',
        '[&>img]:size-5 [&>img]:object-contain',
        className,
      )}
      {...props}
    />
  )
}
