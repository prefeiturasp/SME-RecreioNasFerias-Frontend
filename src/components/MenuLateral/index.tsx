import { useEffect, useRef, useState } from 'react'
import { iconeCadastro } from '../../assets'
import { useEstadoMenuLateral } from '../../contexts/useEstadoMenuLateral'
import logoSmeBranco from '../../assets/logo-sme-branco.png'
import { CloseIcon, MenuIcon } from '../icons'
import {
  AreaRolagemMenu,
  BotaoAbrirMenu,
  BotaoFecharMenu,
  CabecalhoMenu,
  CartaoItemMenu,
  ContainerMenuLateral,
  ConteudoMenu,
  IconeCartaoMenu,
  IndicadorCartaoMenu,
  ListaMenu,
  LogoMenu,
  RodapeLogoMenu,
  RotuloCartaoMenu,
} from './style'

const tituloMenu = (
  <h3>
    Sistema de Gestão <br /> do Recreio nas Férias
  </h3>
)

const ROTA_CADASTROS = '/edicoes-programa'

const MENU_TRANSITION_MS = 200

export function MenuLateral() {
  const {
    menuAberto,
    abrirMenu: abrirMenuGlobal,
    fecharMenu: fecharMenuGlobal,
  } = useEstadoMenuLateral()
  const [conteudoMenuVisivel, setConteudoMenuVisivel] = useState(menuAberto)
  const referenciaAside = useRef<HTMLElement>(null)
  const referenciaMenuAberto = useRef(menuAberto)

  useEffect(() => {
    referenciaMenuAberto.current = menuAberto
  }, [menuAberto])

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
    <ContainerMenuLateral ref={referenciaAside} $estaAberto={menuAberto}>
      {conteudoMenuVisivel && (
        <ConteudoMenu>
          <AreaRolagemMenu>
            <CabecalhoMenu>
              {tituloMenu}
              <BotaoFecharMenu
                type="button"
                aria-label="Fechar menu"
                onClick={fecharMenu}
              >
                <CloseIcon />
              </BotaoFecharMenu>
            </CabecalhoMenu>
            <ListaMenu>
              <li>
                <CartaoItemMenu to={ROTA_CADASTROS} aria-label="Cadastros">
                  <IndicadorCartaoMenu aria-hidden="true"></IndicadorCartaoMenu>
                  <IconeCartaoMenu>
                    <img src={iconeCadastro} alt="" aria-hidden="true" />
                  </IconeCartaoMenu>
                  <RotuloCartaoMenu>Cadastros</RotuloCartaoMenu>
                </CartaoItemMenu>
              </li>
            </ListaMenu>
          </AreaRolagemMenu>
          <RodapeLogoMenu>
            <LogoMenu
              src={logoSmeBranco}
              alt="Prefeitura de São Paulo"
              width={157}
              height={55}
            />
          </RodapeLogoMenu>
        </ConteudoMenu>
      )}

      {!menuAberto && (
        <BotaoAbrirMenu
          type="button"
          aria-label="Abrir menu"
          aria-expanded={false}
          onClick={abrirMenu}
        >
          <MenuIcon />
        </BotaoAbrirMenu>
      )}
    </ContainerMenuLateral>
  )
}
