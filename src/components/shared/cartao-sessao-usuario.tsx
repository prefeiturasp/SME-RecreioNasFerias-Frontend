import { cn } from '@/lib/utils'
import { obterSessaoAutenticacao } from '@/services/autenticacao'

export function CartaoSessaoUsuario() {
  const sessao = obterSessaoAutenticacao()

  return (
    <div
      className={cn(
        'min-w-[var(--size-user-card-min-width)] rounded-sm',
        'border border-[var(--color-user-card-border)] bg-main-background',
        'p-[var(--size-user-card-padding)]',
        'font-sans text-[length:var(--font-size-user-info)] font-normal text-[var(--color-text)]',
      )}
    >
      <p>RF: {sessao?.rf ?? ''}</p>
      <p>{sessao?.nome ?? ''}</p>
      <p>{sessao?.descricaoCargo ?? ''}</p>
    </div>
  )
}
