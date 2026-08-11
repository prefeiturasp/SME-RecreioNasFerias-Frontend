import { useNavigate } from 'react-router-dom'
import { IconeSair } from '@/components/icons'
import { cn } from '@/lib/utils'
import { limparSessaoAutenticacao } from '@/services/autenticacao'

export function BotaoSair() {
  const navigate = useNavigate()

  function aoSair() {
    limparSessaoAutenticacao()
    navigate('/')
  }

  return (
    <button type="button" aria-label="Sair" onClick={aoSair} className="cursor-pointer">
      <div
        className={cn(
          'flex size-[var(--size-logout-icon-wrapper)] items-center justify-center',
          'rounded-full bg-primary text-background',
        )}
      >
        <IconeSair />
      </div>
      <span className="text-[length:var(--font-size-logout-label)] font-normal text-[var(--color-logout-label)]">
        Sair
      </span>
    </button>
  )
}
