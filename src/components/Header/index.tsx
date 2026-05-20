import { NavLink } from 'react-router-dom'
import { Links, Nav, Title } from './style'

export function Header() {
  return (
    <Nav>
      <Title>Recreio nas Férias</Title>
      <Links>
        <NavLink to="/" end>
          Início
        </NavLink>
        <NavLink to="/inscricao">Inscrição</NavLink>
      </Links>
    </Nav>
  )
}
