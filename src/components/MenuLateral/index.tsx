import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { iconeCadastro } from '../../assets'
import { useEstadoMenuLateral } from '../../contexts/useEstadoMenuLateral'
import logoSmeBranco from '../../assets/logo-sme-branco.png'
import { ChevronDownIcon, CloseIcon, MenuIcon } from '../icons'
import {
  AreaRolagemMenu,
  BotaoAbrirMenu,
  BotaoCabecalhoGrupoMenu,
  BotaoFecharMenu,
  CabecalhoGrupoMenu,
  CabecalhoMenu,
  CartaoGrupoMenu,
  ContainerMenuLateral,
  ConteudoMenu,
  IconeCartaoMenu,
  IconeChevronGrupoMenu,
  ListaMenu,
  ListaSubitensMenu,
  LogoMenu,
  RodapeLogoMenu,
  RotuloGrupoMenu,
  SubitemMenu,
} from './style'

const tituloMenu = (
  <h3>
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

  const alternarCadastros = () => {
    setCadastrosExpandido((expandido) => !expandido)
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
                <CartaoGrupoMenu>
                  <CabecalhoGrupoMenu>
                    <BotaoCabecalhoGrupoMenu
                      type="button"
                      aria-expanded={cadastrosExpandido}
                      aria-controls="submenu-cadastros"
                      onClick={alternarCadastros}
                    >
                      <IconeCartaoMenu
                        $icone={iconeCadastro}
                        aria-hidden="true"
                      />
                      <RotuloGrupoMenu>Cadastros</RotuloGrupoMenu>
                      <IconeChevronGrupoMenu $expandido={cadastrosExpandido}>
                        <ChevronDownIcon />
                      </IconeChevronGrupoMenu>
                    </BotaoCabecalhoGrupoMenu>
                  </CabecalhoGrupoMenu>
                  {cadastrosExpandido && (
                    <ListaSubitensMenu id="submenu-cadastros">
                      {SUBITENS_CADASTROS.map((subitem) => (
                        <li key={subitem.caminho}>
                          <SubitemMenu
                            to={subitem.caminho}
                            $ativo={location.pathname.startsWith(
                              subitem.caminho,
                            )}
                          >
                            {subitem.rotulo}
                          </SubitemMenu>
                        </li>
                      ))}
                    </ListaSubitensMenu>
                  )}
                </CartaoGrupoMenu>
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
