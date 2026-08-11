import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

import { cn } from '@/lib/utils'

const variantesBotao = cva(
  [
    'inline-flex cursor-pointer items-center justify-center whitespace-nowrap',
    'font-[family-name:var(--font-family)] font-bold transition-[var(--transition-button)]',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]',
  ].join(' '),
  {
    variants: {
      variante: {
        contorno: [
          'border border-[var(--color-brand-dark)] bg-[var(--color-background)] text-[var(--color-brand-dark)]',
          'hover:border-[var(--color-primary)] hover:bg-[var(--color-button-outline-hover-bg)] hover:shadow-[var(--shadow-button-outline-hover)]',
          'active:scale-[0.97] active:bg-[var(--color-button-outline-active-bg)]',
        ].join(' '),
        primario: [
          'border border-[var(--color-brand-dark)] bg-[var(--color-brand-dark)] text-[var(--color-background)]',
          'hover:not-disabled:bg-[var(--color-brand-dark-hover)] hover:not-disabled:shadow-[var(--shadow-button-primary-hover)]',
          'active:not-disabled:scale-[0.98] active:not-disabled:bg-[var(--color-brand-dark-active)] active:not-disabled:shadow-none',
          'disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-[var(--color-button-primary-disabled-border)] disabled:bg-[var(--color-button-primary-disabled-bg)] disabled:text-[var(--color-background)] disabled:opacity-100 disabled:shadow-none',
        ].join(' '),
      },
      tamanho: {
        padrao:
          'h-[var(--size-button-height)] rounded-[var(--size-radius-sm)] px-4 text-[length:var(--font-size-button)]',
        formulario:
          'h-[var(--size-button-height)] rounded-[var(--size-radius-sm)] px-4 py-2.5 text-[length:var(--font-size-button-sm)]',
        cadastro:
          'h-[var(--size-button-height)] rounded-[3px] px-4 py-2 text-[length:var(--font-size-button)] max-md:whitespace-normal max-md:text-center',
      },
    },
    defaultVariants: {
      variante: 'contorno',
      tamanho: 'padrao',
    },
  },
)

type BotaoProps = ComponentPropsWithoutRef<'button'> &
  VariantProps<typeof variantesBotao>

export function Botao({
  className,
  variante,
  tamanho,
  type = 'button',
  ...props
}: Readonly<BotaoProps>) {
  return (
    <button
      type={type}
      className={cn(variantesBotao({ variante, tamanho }), className)}
      {...props}
    />
  )
}

export function RotuloBotaoVoltar({
  className,
  children,
  ...props
}: Readonly<ComponentPropsWithoutRef<'span'>>) {
  return (
    <span
      className={cn(
        'ml-2.5 text-[length:var(--font-size-button)] font-bold text-[var(--color-brand-dark)]',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}

type BotaoVoltarProps = ComponentPropsWithoutRef<'button'> & {
  icone?: ReactNode
  children?: ReactNode
}

export function BotaoVoltar({
  className,
  icone,
  children,
  type = 'button',
  ...props
}: Readonly<BotaoVoltarProps>) {
  return (
    <button
      type={type}
      className={cn(
        variantesBotao({ variante: 'contorno', tamanho: 'padrao' }),
        'inline-flex',
        className,
      )}
      {...props}
    >
      {icone}
      {children == null ? null : (
        <RotuloBotaoVoltar>{children}</RotuloBotaoVoltar>
      )}
    </button>
  )
}
