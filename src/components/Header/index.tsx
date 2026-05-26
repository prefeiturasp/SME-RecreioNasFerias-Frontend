import { NavLink } from 'react-router-dom'
import { Links, Nav, Title } from './style'

export function Header() {
  return (
    <Nav>
      <Title>Recreio nas Férias</Title>
      <Links>
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
          Início
        </NavLink>
        <NavLink
          to="/inscricao"
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          Inscrição
        </NavLink>
      </Links>
    </Nav>
  )
}
