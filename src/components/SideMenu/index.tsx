import { useEffect, useRef, useState, type ReactElement } from 'react'
import logoSmeBranco from '../../assets/logo-sme-branco.png'
import {
  ChevronDownIcon,
  CloseIcon,
  ConfiguracoesIcon,
  CronogramasIcon,
  InscricoesIcon,
  MenuIcon,
} from './icons'
import {
  Aside,
  MenuCloseButton,
  MenuContent,
  MenuHeader,
  MenuItem,
  MenuItemLabel,
  MenuList,
  MenuLogo,
  MenuLogoFooter,
  MenuScrollArea,
  MenuToggleButton,
} from './style'

type SideMenuItem = {
  id: string
  label: string
  icon: () => ReactElement
}

const menuTitle = (
  <h3>
    Sistema de Gestão <br /> do Recreio nas Férias
  </h3>
)

const menuItems: SideMenuItem[] = [
  { id: 'cronogramas', label: 'Cronogramas', icon: CronogramasIcon },
  { id: 'inscricoes', label: 'Inscrições', icon: InscricoesIcon },
  { id: 'configuracoes', label: 'Configurações', icon: ConfiguracoesIcon },
]

const MENU_TRANSITION_MS = 200

export function SideMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(true)
  const [isMenuContentVisible, setIsMenuContentVisible] = useState(true)
  const asideRef = useRef<HTMLElement>(null)
  const isMenuOpenRef = useRef(isMenuOpen)

  isMenuOpenRef.current = isMenuOpen

  const openMenu = () => {
    setIsMenuContentVisible(false)
    setIsMenuOpen(true)
  }

  const closeMenu = () => {
    setIsMenuContentVisible(false)
    setIsMenuOpen(false)
  }

  useEffect(() => {
    if (!isMenuOpen) return

    const aside = asideRef.current
    let hasShownContent = false

    const showContent = () => {
      if (hasShownContent || !isMenuOpenRef.current) return
      hasShownContent = true
      setIsMenuContentVisible(true)
    }

    const handleTransitionEnd = (event: TransitionEvent) => {
      if (event.target !== aside || event.propertyName !== 'width') return
      showContent()
    }

    aside?.addEventListener('transitionend', handleTransitionEnd)
    const fallbackTimer = window.setTimeout(
      showContent,
      MENU_TRANSITION_MS + 50,
    )

    return () => {
      aside?.removeEventListener('transitionend', handleTransitionEnd)
      window.clearTimeout(fallbackTimer)
    }
  }, [isMenuOpen])

  return (
    <Aside ref={asideRef} $isOpen={isMenuOpen}>
      {isMenuContentVisible && (
        <MenuContent>
          <MenuScrollArea>
            <MenuHeader>
              {menuTitle}
              <MenuCloseButton
                type="button"
                aria-label="Fechar menu"
                onClick={closeMenu}
              >
                <CloseIcon />
              </MenuCloseButton>
            </MenuHeader>
            <MenuList>
              {menuItems.map(({ id, label, icon: Icon }) => (
                <li key={id}>
                  <MenuItem type="button" aria-expanded="false">
                    <MenuItemLabel>
                      <Icon />
                      {label}
                    </MenuItemLabel>
                    <ChevronDownIcon />
                  </MenuItem>
                </li>
              ))}
            </MenuList>
          </MenuScrollArea>
          <MenuLogoFooter>
            <MenuLogo
              src={logoSmeBranco}
              alt="Prefeitura de São Paulo"
              width={157}
              height={55}
            />
          </MenuLogoFooter>
        </MenuContent>
      )}

      {!isMenuOpen && (
        <MenuToggleButton
          type="button"
          aria-label="Abrir menu"
          aria-expanded={false}
          onClick={openMenu}
        >
          <MenuIcon />
        </MenuToggleButton>
      )}
    </Aside>
  )
}
