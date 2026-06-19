import { Link } from 'react-router-dom'
import styled from 'styled-components'

export const NavMapa = styled.nav`
  display: flex;
  align-items: center;
`

export const ListaMapa = styled.ol`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;
`

export const ItemMapa = styled.li`
  display: flex;
  align-items: center;
`

export const IconeMapa = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  margin-right: 4px;
  line-height: 0;

  > svg {
    display: block;
    width: 12px;
    height: 12px;
  }
`

export const SeparadorMapa = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  margin-right: 6px;
  border: 1px solid var(--color-border);
  border-radius: 50%;
  color: var(--color-text);
  flex-shrink: 0;
  line-height: 0;

  > svg {
    display: block;
    width: 8px;
    height: 8px;
  }
`

export const LinkItemMapa = styled(Link)`
  display: inline-flex;
  align-items: center;
  font-family: 'Roboto', sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 1;
  color: var(--color-text);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
    border-radius: 2px;
  }
`

export const TextoItemMapa = styled.span<{ $ativo?: boolean }>`
  display: inline-flex;
  align-items: center;
  font-family: 'Roboto', sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 1;
  color: ${({ $ativo }) =>
    $ativo ? 'var(--color-primary)' : 'var(--color-text)'};
`
