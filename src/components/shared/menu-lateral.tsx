import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import logoSmeBranco from '@/assets/logo-sme-branco.png'
import { CloseIcon, MenuIcon } from '@/components/icons'
import { GrupoNavegacao } from '@/components/shared/grupo-navegacao'
import { useEstadoMenuLateral } from '@/contexts/useEstadoMenuLateral'
import { GRUPOS_NAVEGACAO, rotaPertenceAoGrupo } from '@/lib/navigation'
import { cn } from '@/lib/utils'

const tituloMenu = (
  <h3 className="flex-1 font-heading text-[14px] leading-[18px] font-normal text-[#ffffff]">
    Sistema de Gestão <br /> do Recreio nas Férias
  </h3>
)

const MENU_TRANSITION_MS = 200

export function MenuLateral() {
  const location = useLocation()
  const {
    menuAberto,
    abrirMenu: abrirMenuGlobal,
    fecharMenu: fecharMenuGlobal,
  } = useEstadoMenuLateral()
  const [conteudoMenuVisivel, setConteudoMenuVisivel] = useState(menuAberto)
  const [gruposExpandidos, setGruposExpandidos] = useState<
    Record<string, boolean>
  >(() =>
    Object.fromEntries(GRUPOS_NAVEGACAO.map((grupo) => [grupo.id, true])),
  )
  const referenciaAside = useRef<HTMLElement>(null)
  const referenciaMenuAberto = useRef(menuAberto)

  useEffect(() => {
    referenciaMenuAberto.current = menuAberto
  }, [menuAberto])

  useEffect(() => {
    setGruposExpandidos((atuais) => {
      const proximos = { ...atuais }
      let alterou = false

      for (const grupo of GRUPOS_NAVEGACAO) {
        if (
          rotaPertenceAoGrupo(location.pathname, grupo) &&
          !proximos[grupo.id]
        ) {
          proximos[grupo.id] = true
          alterou = true
        }
      }

      return alterou ? proximos : atuais
    })
  }, [location.pathname])

  const abrirMenu = () => {
    setConteudoMenuVisivel(false)
    abrirMenuGlobal()
  }

  const fecharMenu = () => {
    setConteudoMenuVisivel(false)
    fecharMenuGlobal()
  }

  const alternarGrupo = (idGrupo: string) => {
    setGruposExpandidos((atuais) => ({
      ...atuais,
      [idGrupo]: !atuais[idGrupo],
    }))
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

    const aoTerminarTransicao = (evento: TransitionEvent) => {
      if (evento.target !== aside || evento.propertyName !== 'width') return
      exibirConteudo()
    }

    aside?.addEventListener('transitionend', aoTerminarTransicao)
    const temporizadorFallback = globalThis.setTimeout(
      exibirConteudo,
      MENU_TRANSITION_MS + 50,
    )

    return () => {
      aside?.removeEventListener('transitionend', aoTerminarTransicao)
      globalThis.clearTimeout(temporizadorFallback)
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
        <nav className="flex min-h-0 flex-1 flex-col overflow-hidden text-white">
          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="flex h-[118px] w-full items-center justify-between gap-2 rounded-b-sm bg-primary px-2 py-4">
              {tituloMenu}
              <button
                type="button"
                aria-label="Fechar menu"
                onClick={fecharMenu}
                className="flex size-6 shrink-0 items-center justify-center text-white"
              >
                <CloseIcon />
              </button>
            </div>

            <ul className="mt-0 flex flex-col gap-2 px-1 pt-2.5 pb-0">
              {GRUPOS_NAVEGACAO.map((grupo) => (
                <li key={grupo.id}>
                  <GrupoNavegacao
                    id={grupo.id}
                    rotulo={grupo.rotulo}
                    icone={grupo.icone}
                    subitens={grupo.subitens}
                    expandido={gruposExpandidos[grupo.id] ?? true}
                    onAlternar={() => alternarGrupo(grupo.id)}
                    caminhoAtual={location.pathname}
                  />
                </li>
              ))}
            </ul>
          </div>

          <div className="flex shrink-0 items-center justify-center px-2 pt-4 pb-5">
            <img
              src={logoSmeBranco}
              alt="Prefeitura de São Paulo"
              width={157}
              height={55}
              className="h-[55px] w-[157px] object-contain"
            />
          </div>
        </nav>
      )}

      {!menuAberto && (
        <button
          type="button"
          aria-label="Abrir menu"
          aria-expanded={false}
          onClick={abrirMenu}
          className="flex size-14 shrink-0 items-center justify-center text-white"
        >
          <MenuIcon />
        </button>
      )}
    </aside>
  )
}
