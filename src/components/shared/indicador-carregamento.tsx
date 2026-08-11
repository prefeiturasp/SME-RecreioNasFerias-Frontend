import { cn } from '@/lib/utils'

type IndicadorCarregamentoProps = {
  mensagem?: string
  className?: string
}

export function IndicadorCarregamento({
  mensagem = 'Carregando...',
  className,
}: Readonly<IndicadorCarregamentoProps>) {
  return (
    <output
      aria-live="polite"
      className={cn(
        'flex min-h-20 w-full items-center justify-center gap-3 px-4 py-6',
        'font-[family-name:var(--font-family)] text-[length:var(--font-size-label)] font-medium text-[var(--color-text)]',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="size-5 animate-spin rounded-full border-2 border-[var(--color-input-border-muted)] border-t-[var(--color-brand-dark)]"
      />
      <span>{mensagem}</span>
    </output>
  )
}
