import styled, { keyframes } from 'styled-components'

const girar = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`

export const ContainerIndicadorCarregamento = styled.output`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  min-height: 5rem;
  padding: 1.5rem 1rem;
  font-family: var(--font-family);
  font-size: var(--font-size-label);
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
`

export const SpinnerIndicadorCarregamento = styled.span`
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid var(--color-input-border-muted);
  border-top-color: var(--color-brand-dark);
  border-radius: 50%;
  animation: ${girar} 0.8s linear infinite;
`
