import { useNavigate } from 'react-router-dom'
import logoRecreioImg from '../../assets/logo-recreio.png'
import { clearAuthSession, getAuthSession } from '../../services/auth'
import { IconeSair } from '../icons'
import {
  BlocoUsuarioLogado,
  BotaoSair,
  CartaoUsuario,
  HeaderContainer,
  IconeSairWrapper,
  LogoRecreio,
} from './style'

export function Header() {
  const navigate = useNavigate()
  const session = getAuthSession()

  function handleLogout() {
    clearAuthSession()
    navigate('/')
  }

  return (
    <HeaderContainer>
      <LogoRecreio src={logoRecreioImg} alt="logo recreio nas férias" />

      <BlocoUsuarioLogado>
        <CartaoUsuario>
          <p>RF: {session?.rf ?? ''}</p>
          <p>{session?.nome ?? ''}</p>
          <p>{session?.descricaoCargo ?? ''}</p>
        </CartaoUsuario>

        <BotaoSair type="button" aria-label="Sair" onClick={handleLogout}>
          <IconeSairWrapper>
            <IconeSair />
          </IconeSairWrapper>
          <span>Sair</span>
        </BotaoSair>
      </BlocoUsuarioLogado>
    </HeaderContainer>
  )
}
