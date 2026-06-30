import styled from 'styled-components'

export const CartaoFiltrosPolos = styled.section`
  margin-bottom: 1rem;
  border: 1px solid #e1e1e1;
  border-radius: var(--size-radius-sm);
  background-color: var(--color-background);
  overflow: hidden;
`

export const CabecalhoFiltrosPolos = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e1e1e1;
`

export const BotaoCabecalhoFiltrosPolos = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  width: 100%;
  color: var(--color-brand-dark);
  text-align: left;

  > svg,
  > span > svg {
    flex-shrink: 0;
    color: var(--color-brand-dark);
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
    border-radius: 2px;
  }
`

export const TituloFiltrosPolos = styled.span`
  flex: 1;
  font-family: var(--font-family);
  font-size: var(--font-size-label);
  font-weight: var(--font-weight-semibold);
  color: var(--color-brand-dark);
`

export const IconeChevronFiltrosPolos = styled.span<{ $expandido: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  color: var(--color-brand-dark);
  transform: rotate(${({ $expandido }) => ($expandido ? '180deg' : '0deg')});
  transition: transform 0.2s ease;

  > svg {
    width: 1.5rem;
    height: 1.5rem;
  }
`

export const CorpoFiltrosPolos = styled.div`
  padding: 1rem;
`

export const LinhaCamposFiltrosPolos = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 64rem) {
    grid-template-columns: 1fr;
  }
`

export const CampoFiltroPolos = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;

  > label {
    margin-bottom: 0.25rem;
    font-family: var(--font-family);
    font-size: var(--font-size-label);
    font-weight: var(--font-weight-bold);
    color: var(--color-text);
  }
`

export const SeletorCampoFiltroPolos = styled.div`
  position: relative;

  > select,
  > input {
    width: 100%;
    height: var(--size-input-height);
    border: 1px solid var(--color-input-border-muted);
    border-radius: var(--size-radius-sm);
    padding: 0 2rem 0 0.5rem;
    font-family: var(--font-family);
    font-weight: var(--font-weight-regular);
    font-size: var(--font-size-label);
    color: var(--color-text);
    background-color: var(--color-background);

    &::placeholder {
      color: var(--color-placeholder);
      opacity: 1;
    }

    &:focus,
    &:focus-visible {
      outline: 2px solid var(--color-brand-dark);
      outline-offset: 0;
      border-color: var(--color-brand-dark);
    }
  }

  > select {
    appearance: none;
  }

  > svg {
    position: absolute;
    right: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: var(--color-text);
  }
`

export const LinhaBotoesFiltrosPolos = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.5rem;
`
