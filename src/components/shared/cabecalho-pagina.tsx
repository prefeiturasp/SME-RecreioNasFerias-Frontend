import { Link } from 'react-router-dom'
import logoRecreioImg from '@/assets/logo-recreio.png'
import { BotaoSair } from '@/components/shared/botao-sair'
import { CartaoSessaoUsuario } from '@/components/shared/cartao-sessao-usuario'
import { cn } from '@/lib/utils'

export function CabecalhoPagina() {
  return (
    <header
      className={cn(
        'flex w-full shrink-0 items-center justify-between bg-background',
        'h-[var(--size-main-header-height)]',
        'px-[var(--size-main-header-padding-x)] py-[var(--size-main-header-padding-y)]',
        'shadow-[var(--shadow-header-bottom)]',
      )}
    >
      <Link
        to="/inicio"
        aria-label="Voltar ao início"
        className="block leading-none focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <img
          src={logoRecreioImg}
          alt=""
          aria-hidden="true"
          className="h-[var(--size-main-logo-height)] w-[var(--size-main-logo-width)]"
        />
      </Link>

      <div className="flex items-center gap-[var(--size-user-logout-gap)]">
        <CartaoSessaoUsuario />
        <BotaoSair />
      </div>
    </header>
  )
}
