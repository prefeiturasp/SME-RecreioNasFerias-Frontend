import styled from 'styled-components'

import {
  BotaoCancelarFormulario,
  BotaoSalvarFormulario,
} from '../shared/edicoesProgramaStyles'

export const SobreposicaoModalAlterarEdicao = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.45);
`

export const ConteudoModalAlterarEdicao = styled.div`
  width: min(100%, 34rem);
  border-radius: var(--size-radius-sm);
  background-color: var(--color-background);
  box-shadow: var(--shadow-card);
  overflow: hidden;
`

export const CabecalhoModalAlterarEdicao = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e1e1e1;
`

export const TituloModalAlterarEdicao = styled.h4`
  font-family: var(--font-family);
  font-size: var(--font-size-label);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
  line-height: 1.3;
`

export const BotaoFecharModalAlterarEdicao = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  color: var(--color-text);
  border-radius: var(--size-radius-sm);
  transition: background-color 0.2s ease;

  > svg {
    width: 1.25rem;
    height: 1.25rem;
  }

  &:hover {
    background-color: rgba(0, 0, 0, 0.06);
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
`

export const CorpoModalAlterarEdicao = styled.div`
  padding: 1.25rem 1.5rem 1.5rem;
`

export const DescricaoModalAlterarEdicao = styled.p`
  margin-bottom: 1rem;
  font-family: var(--font-family);
  font-size: var(--font-size-label);
  font-weight: var(--font-weight-regular);
  color: var(--color-text);
  line-height: 1.5;
`

export const CampoModalAlterarEdicao = styled.div`
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

export const SeletorModalAlterarEdicao = styled.div`
  position: relative;

  > select {
    width: 100%;
    height: var(--size-input-height);
    appearance: none;
    border: 1px solid var(--color-input-border-muted);
    border-radius: var(--size-radius-sm);
    padding: 0 2rem 0 0.5rem;
    font-family: var(--font-family);
    font-weight: var(--font-weight-regular);
    font-size: var(--font-size-label);
    color: var(--color-text);
    background-color: var(--color-background);

    &:focus,
    &:focus-visible {
      outline: 2px solid var(--color-brand-dark);
      outline-offset: 0;
      border-color: var(--color-brand-dark);
    }
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

export const RodapeModalAlterarEdicao = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e1e1e1;

  @media (max-width: 48rem) {
    flex-direction: column-reverse;
    align-items: stretch;

    > button {
      width: 100%;
    }
  }
`

export const BotaoFecharRodapeModalAlterarEdicao = styled(
  BotaoCancelarFormulario,
)``

export const BotaoAlterarModalAlterarEdicao = styled(BotaoSalvarFormulario)``
