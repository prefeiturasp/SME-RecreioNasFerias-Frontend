import type { ComponentPropsWithoutRef } from 'react'

import { cn } from '@/lib/utils'

export function CampoEntrada({
  className,
  ...props
}: ComponentPropsWithoutRef<'input'>) {
  return (
    <input
      className={cn(
        'h-[var(--size-input-height)] w-full rounded-[var(--size-radius-sm)] border border-[var(--color-input-border-muted)] px-2',
        'font-[family-name:var(--font-family)] text-[length:var(--font-size-label)] font-normal text-[var(--color-text)]',
        'transition-[var(--transition-input)]',
        'placeholder:font-[family-name:var(--font-family)] placeholder:text-[length:var(--font-size-label)] placeholder:font-normal placeholder:text-[var(--color-placeholder)] placeholder:opacity-100',
        'focus:border-[var(--color-brand-dark)] focus:outline-2 focus:outline-[var(--color-brand-dark)] focus:outline-offset-0',
        'focus-visible:border-[var(--color-brand-dark)] focus-visible:outline-2 focus-visible:outline-[var(--color-brand-dark)] focus-visible:outline-offset-0',
        'read-only:cursor-not-allowed read-only:bg-[var(--color-input-disabled-bg)] read-only:text-[var(--color-placeholder)]',
        'disabled:cursor-not-allowed disabled:bg-[var(--color-input-disabled-bg)] disabled:text-[var(--color-placeholder)]',
        className,
      )}
      {...props}
    />
  )
}
