import styled from 'styled-components'

export const BarraAcoesSelecao = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  min-height: 3rem;
  padding: 0.5rem 1rem;
  background-color: var(--color-brand-dark);
  border: 1px solid var(--color-brand-dark);
`

export const ContagemSelecao = styled.p`
  font-family: var(--font-family);
  font-size: var(--font-size-label);
  font-weight: var(--font-weight-bold);
  color: var(--color-background);
`

export const GrupoAcoesSelecao = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0;
`

export const SeparadorAcaoSelecao = styled.span`
  width: 1px;
  height: 1.25rem;
  margin: 0 0.75rem;
  background-color: rgba(255, 255, 255, 0.45);
`

export const BotaoAcaoSelecao = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-family);
  font-size: var(--font-size-label);
  font-weight: var(--font-weight-bold);
  color: var(--color-background);
  white-space: nowrap;
  border-radius: var(--size-radius-sm);
  padding: 0.25rem 0;
  transition: opacity 0.2s ease;

  > img {
    width: 1rem;
    height: 1rem;
    object-fit: contain;
    filter: brightness(0) invert(1);
  }

  > svg {
    width: 1rem;
    height: 1rem;
    color: var(--color-background);
  }

  &:hover {
    opacity: 0.85;
  }

  &:focus-visible {
    outline: 2px solid var(--color-background);
    outline-offset: 2px;
  }
`
