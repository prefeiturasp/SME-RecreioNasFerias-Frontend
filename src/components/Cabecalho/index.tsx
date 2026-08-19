import { useNavigate } from 'react-router-dom'
import logoRecreioImg from '../../assets/logo-recreio.png'
import {
  encerrarSessaoAutenticacao,
  obterSessaoAutenticacao,
} from '../../services/autenticacao'
import { IconeSair } from '../icons'
import {
  BlocoUsuarioLogado,
  BotaoSair,
  CartaoUsuario,
  HeaderContainer,
  IconeSairWrapper,
  LogoRecreio,
  LogoRecreioLink,
} from './style'

export function Cabecalho() {
  const navigate = useNavigate()
  const session = obterSessaoAutenticacao()

  async function handleLogout() {
    await encerrarSessaoAutenticacao()
    navigate('/')
  }

  return (
    <HeaderContainer>
      <LogoRecreioLink to="/inicio" aria-label="Voltar ao início">
        <LogoRecreio src={logoRecreioImg} alt="" aria-hidden="true" />
      </LogoRecreioLink>

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
