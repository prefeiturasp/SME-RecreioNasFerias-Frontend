import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
`

export const Title = styled.span`
  font-weight: var(--font-weight-semibold);
`

export const Links = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;

  a {
    color: inherit;
    text-decoration: none;
  }

  a.active {
    font-weight: var(--font-weight-bold);
  }
`
