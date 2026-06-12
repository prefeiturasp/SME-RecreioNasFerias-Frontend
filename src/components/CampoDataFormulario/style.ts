import styled, { css } from 'styled-components'

const estilosInputData = css`
  position: relative;
  height: var(--size-input-height);
  width: 100%;
  border: 1px solid var(--color-input-border-muted);
  border-radius: var(--size-radius-sm);
  padding: 0 2.25rem 0 0.5rem;
  background-color: var(--color-background);
  font-family: var(--font-family);
  font-weight: var(--font-weight-regular);
  font-size: var(--font-size-label);
  color: var(--color-text);
  transition: var(--transition-input);

  &::-webkit-calendar-picker-indicator {
    position: absolute;
    right: 0;
    width: 2.25rem;
    height: 100%;
    margin: 0;
    padding: 0;
    opacity: 0;
    cursor: pointer;
  }

  &:invalid::-webkit-datetime-edit {
    visibility: hidden;
  }

  &:focus::-webkit-datetime-edit,
  &:valid::-webkit-datetime-edit {
    visibility: visible;
  }

  &:focus,
  &:focus-visible {
    outline: 2px solid var(--color-brand-dark);
    outline-offset: 0;
    border-color: var(--color-brand-dark);
  }
`

export const CampoData = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  min-width: 0;

  > input {
    ${estilosInputData}
  }

  &:focus-within > span:first-of-type {
    opacity: 0;
  }

  &:has(> input:valid) > span:first-of-type {
    display: none;
  }
`

export const PlaceholderData = styled.span`
  position: absolute;
  left: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  font-family: var(--font-family);
  font-weight: var(--font-weight-regular);
  font-size: var(--font-size-label);
  color: var(--color-placeholder);
`

export const IconeCalendarioData = styled.span`
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  color: var(--color-brand-dark);
  pointer-events: none;

  > svg {
    display: block;
    width: 1.25rem;
    height: 1.25rem;
  }
`

export const GrupoCamposData = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.5rem;
`

export const CampoDataComRotulo = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;

  > label {
    font-family: var(--font-family);
    font-size: var(--font-size-label);
    font-weight: var(--font-weight-bold);
    margin-bottom: 0.25rem;
    color: var(--color-text);
  }
`
