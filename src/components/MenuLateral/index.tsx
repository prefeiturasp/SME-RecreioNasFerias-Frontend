import { useEffect, useRef, useState } from 'react'

import { iconeCadastro } from '@/assets'
import logoSmeBranco from '@/assets/logo-sme-branco.png'
import { ChevronDownIcon, CloseIcon, MenuIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { useEstadoMenuLateral } from '@/contexts/useEstadoMenuLateral'
import { cn } from '@/lib/utils'
import { Link, useLocation } from 'react-router-dom'

const tituloMenu = (
  <h3 className="flex-1 font-heading text-sm leading-snug font-normal text-primary-foreground">
    Sistema de Gestão <br /> do Recreio nas Férias
  </h3>
)

const ROTAS_CADASTROS = [
  '/edicoes-programa',
  '/definicoes-polo',
  '/polos-parceiros',
] as const

const SUBITENS_CADASTROS = [
  {
    rotulo: 'Cadastro de Edições',
    caminho: '/edicoes-programa',
  },
  {
    rotulo: 'Definições de Polo',
    caminho: '/definicoes-polo',
  },
  {
    rotulo: 'Cadastro de Polos Parceiros',
    caminho: '/polos-parceiros',
  },
] as const

const MENU_TRANSITION_MS = 200

function IconeCartaoMenu({ icone }: Readonly<{ icone: string }>) {
  return (
    <span
      className="flex size-6 shrink-0 items-center justify-center bg-brand-dark"
      style={{
        mask: `url(${icone}) center / contain no-repeat`,
        WebkitMask: `url(${icone}) center / contain no-repeat`,
      }}
      aria-hidden="true"
    />
  )
}

export function MenuLateral() {
  const location = useLocation()
  const {
    menuAberto,
    abrirMenu: abrirMenuGlobal,
    fecharMenu: fecharMenuGlobal,
  } = useEstadoMenuLateral()
  const [conteudoMenuVisivel, setConteudoMenuVisivel] = useState(menuAberto)
  const [cadastrosExpandido, setCadastrosExpandido] = useState(true)
  const referenciaAside = useRef<HTMLElement>(null)
  const referenciaMenuAberto = useRef(menuAberto)

  useEffect(() => {
    referenciaMenuAberto.current = menuAberto
  }, [menuAberto])

  useEffect(() => {
    if (ROTAS_CADASTROS.some((rota) => location.pathname.startsWith(rota))) {
      setCadastrosExpandido(true)
    }
  }, [location.pathname])

  const abrirMenu = () => {
    setConteudoMenuVisivel(false)
    abrirMenuGlobal()
  }

  const fecharMenu = () => {
    setConteudoMenuVisivel(false)
    fecharMenuGlobal()
  }

  useEffect(() => {
    if (!menuAberto) return

    const aside = referenciaAside.current
    let exibiuConteudo = false

    const exibirConteudo = () => {
      if (exibiuConteudo || !referenciaMenuAberto.current) return
      exibiuConteudo = true
      setConteudoMenuVisivel(true)
    }

    const handleTransitionEnd = (event: TransitionEvent) => {
      if (event.target !== aside || event.propertyName !== 'width') return
      exibirConteudo()
    }

    aside?.addEventListener('transitionend', handleTransitionEnd)
    const fallbackTimer = globalThis.setTimeout(
      exibirConteudo,
      MENU_TRANSITION_MS + 50,
    )

    return () => {
      aside?.removeEventListener('transitionend', handleTransitionEnd)
      globalThis.clearTimeout(fallbackTimer)
    }
  }, [menuAberto])

  return (
    <aside
      ref={referenciaAside}
      className={cn(
        'flex h-screen shrink-0 flex-col bg-brand-dark transition-[width,min-width] duration-200 ease-in-out',
        menuAberto ? 'w-[18%] min-w-48' : 'w-14 min-w-14',
      )}
    >
      {conteudoMenuVisivel && (
        <nav className="flex min-h-0 flex-1 flex-col overflow-hidden text-primary-foreground">
          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="flex h-29.5 w-full items-center justify-between gap-2 rounded-b-sm bg-primary px-2 py-4">
              {tituloMenu}
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                className="size-6 shrink-0 text-primary-foreground hover:bg-background/10 hover:text-primary-foreground"
                aria-label="Fechar menu"
                onClick={fecharMenu}
              >
                <CloseIcon />
              </Button>
            </div>

            <ul className="m-0 flex list-none flex-col gap-2 px-1 pt-2.5">
              <li>
                <Collapsible
                  open={cadastrosExpandido}
                  onOpenChange={setCadastrosExpandido}
                  className="w-full overflow-hidden rounded-sm bg-background"
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      className="flex h-auto w-full min-h-6 items-center justify-start gap-1.5 rounded-none px-2 py-3 text-left text-brand-dark hover:bg-transparent focus-visible:outline focus-visible:-outline-offset-2 focus-visible:outline-background"
                      aria-controls="submenu-cadastros"
                    >
                      <IconeCartaoMenu icone={iconeCadastro} />
                      <span className="flex min-h-6 flex-1 items-center text-sm leading-none font-bold text-brand-dark">
                        Cadastros
                      </span>
                      <span
                        className={cn(
                          'flex size-6 shrink-0 items-center justify-center text-brand-dark transition-transform duration-200 [&_svg]:size-6',
                          cadastrosExpandido && 'rotate-180',
                        )}
                      >
                        <ChevronDownIcon />
                      </span>
                    </Button>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <ul
                      id="submenu-cadastros"
                      className="m-0 flex list-none flex-col border-t border-border p-0"
                    >
                      {SUBITENS_CADASTROS.map((subitem) => {
                        const ativo = location.pathname.startsWith(
                          subitem.caminho,
                        )

                        return (
                          <li key={subitem.caminho}>
                            <Link
                              to={subitem.caminho}
                              className={cn(
                                'block border-t border-border py-3 pr-2 pl-10 text-sm leading-tight font-bold no-underline first:border-t-0 hover:bg-surface-muted hover:text-brand-dark focus-visible:outline focus-visible:-outline-offset-2 focus-visible:outline-brand-dark',
                                ativo
                                  ? 'bg-surface-muted text-brand-dark'
                                  : 'bg-transparent text-muted-foreground',
                              )}
                            >
                              {subitem.rotulo}
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  </CollapsibleContent>
                </Collapsible>
              </li>
            </ul>
          </div>

          <div className="flex shrink-0 items-center justify-center px-2 pt-4 pb-5">
            <img
              src={logoSmeBranco}
              alt="Prefeitura de São Paulo"
              width={157}
              height={55}
              className="object-contain"
            />
          </div>
        </nav>
      )}

      {!menuAberto && (
        <Button
          type="button"
          variant="ghost"
          className="size-14 shrink-0 text-primary-foreground hover:bg-background/10 hover:text-primary-foreground"
          aria-label="Abrir menu"
          aria-expanded={false}
          onClick={abrirMenu}
        >
          <MenuIcon />
        </Button>
      )}
    </aside>
  )
}
