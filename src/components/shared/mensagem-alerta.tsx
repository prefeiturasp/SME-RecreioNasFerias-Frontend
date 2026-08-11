import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

import { CloseIcon } from '@/components/icons'
import { cn } from '@/lib/utils'

const variantesMensagemAlerta = cva(
  [
    'font-[family-name:var(--font-family)] text-[length:var(--font-size-label)] font-bold leading-[1.4] text-center',
  ].join(' '),
  {
    variants: {
      variante: {
        erro: 'mb-4 rounded border border-[#e8b4b8] bg-[#f8d7da] px-4 py-3 text-[#721c24]',
        sucesso:
          'relative mt-3 flex min-h-[50px] items-center justify-center rounded border border-[#a4c7af] bg-[#d4edda] px-10 py-3 text-[#155724]',
      },
    },
    defaultVariants: {
      variante: 'erro',
    },
  },
)

type MensagemAlertaProps = ComponentPropsWithoutRef<'div'> &
  VariantProps<typeof variantesMensagemAlerta> & {
    onFechar?: () => void
    children: ReactNode
  }

function BotaoFecharSucesso({
  onFechar,
}: Readonly<{ onFechar: () => void }>) {
  return (
    <button
      type="button"
      aria-label="Fechar mensagem de sucesso"
      onClick={onFechar}
      className={cn(
        'absolute top-1/2 right-3 inline-flex size-6 -translate-y-1/2 items-center justify-center rounded-[var(--size-radius-sm)] text-[#155724] transition-[background-color] duration-200',
        'hover:bg-[rgba(21,87,36,0.1)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#155724]',
        '[&>svg]:size-4',
      )}
    >
      <CloseIcon />
    </button>
  )
}

export function MensagemAlerta({
  className,
  variante = 'erro',
  onFechar,
  children,
  ...props
}: Readonly<MensagemAlertaProps>) {
  if (variante === 'sucesso') {
    return (
      <div
        role="status"
        aria-live="polite"
        className={cn(variantesMensagemAlerta({ variante }), className)}
        {...props}
      >
        <p>{children}</p>
        {onFechar == null ? null : <BotaoFecharSucesso onFechar={onFechar} />}
      </div>
    )
  }

  return (
    <div
      className={cn(variantesMensagemAlerta({ variante }), className)}
      {...props}
    >
      {children}
    </div>
  )
}
