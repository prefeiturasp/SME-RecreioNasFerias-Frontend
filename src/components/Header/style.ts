import styled from 'styled-components'

export const Nav = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--color-border);
`

export const Title = styled.h1`
  font-size: 1.25rem;
  margin: 0;
  letter-spacing: normal;
`

export const Links = styled.nav`
  display: flex;
  gap: 1rem;

  a {
    color: var(--color-text);
    text-decoration: none;
    font-size: 0.95rem;

    &.active {
      color: var(--color-accent);
    }

    &:hover {
      color: var(--color-text-heading);
    }
  }
`
