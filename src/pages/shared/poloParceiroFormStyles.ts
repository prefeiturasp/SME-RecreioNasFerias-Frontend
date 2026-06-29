import styled, { css } from 'styled-components'

const estilosLabelCampo = css`
  font-family: var(--font-family);
  font-size: var(--font-size-label);
  font-weight: var(--font-weight-bold);
  margin-bottom: 0.25rem;
  color: var(--color-text);
`

const estilosInputCampo = css`
  height: var(--size-input-height);
  width: 100%;
  border: 1px solid var(--color-input-border-muted);
  border-radius: var(--size-radius-sm);
  padding: 0 0.5rem;
  font-family: var(--font-family);
  font-weight: var(--font-weight-regular);
  font-size: var(--font-size-label);
  color: var(--color-text);
  transition: var(--transition-input);

  &::placeholder {
    font-family: var(--font-family);
    font-weight: var(--font-weight-regular);
    font-size: var(--font-size-label);
    color: var(--color-placeholder);
    opacity: 1;
  }

  &:focus,
  &:focus-visible {
    outline: 2px solid var(--color-brand-dark);
    outline-offset: 0;
    border-color: var(--color-brand-dark);
  }
`

const estilosCampoFormulario = css`
  display: flex;
  flex-direction: column;
  min-width: 0;

  > label {
    ${estilosLabelCampo}
  }
`

export const SecaoFormularioPoloParceiro = styled.section`
  &:not(:last-of-type) {
    margin-bottom: 1.5rem;
  }
`

export const TituloSecaoFormularioPoloParceiro = styled.h4`
  margin-bottom: 1rem;
  font-family: var(--font-family);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-label);
  color: var(--color-brand-dark);
`

const estilosLinhaFormulario = css`
  display: grid;
  column-gap: var(--size-form-column-gap);
  row-gap: var(--size-form-row-gap);
  margin-bottom: var(--size-form-row-gap);

  @media (max-width: 64rem) {
    grid-template-columns: 1fr;
  }
`

export const LinhaFormularioDuasColunasPoloParceiro = styled.div`
  ${estilosLinhaFormulario}
  grid-template-columns: repeat(2, minmax(0, 1fr));
`

export const LinhaFormularioTresColunasPoloParceiro = styled.div`
  ${estilosLinhaFormulario}
  grid-template-columns: repeat(3, minmax(0, 1fr));
`

export const LinhaFormularioColunaUnicaPoloParceiro = styled.div`
  ${estilosLinhaFormulario}
  grid-template-columns: minmax(0, 1fr);
`

export const CampoTextoFormularioPoloParceiro = styled.div`
  ${estilosCampoFormulario}

  > input {
    ${estilosInputCampo}

    &:disabled,
    &:read-only {
      background-color: var(--color-input-disabled-bg);
      color: var(--color-placeholder);
      cursor: not-allowed;
    }
  }
`

export const CampoNumericoFormularioPoloParceiro = styled.div`
  ${estilosCampoFormulario}

  > input {
    ${estilosInputCampo}
  }
`

export const CampoSeletorFormularioPoloParceiro = styled.div`
  ${estilosCampoFormulario}

  > div {
    position: relative;

    > select {
      ${estilosInputCampo}
      appearance: none;
      padding-right: 2rem;
      background-color: var(--color-background);
    }

    > svg {
      position: absolute;
      right: 0.5rem;
      top: 50%;
      transform: translateY(-50%);
      pointer-events: none;
      color: var(--color-text);
    }
  }
`

export const CampoTextareaFormularioPoloParceiro = styled.div`
  ${estilosCampoFormulario}

  > textarea {
    min-height: 5rem;
    width: 100%;
    border: 1px solid var(--color-input-border-muted);
    border-radius: var(--size-radius-sm);
    padding: 0.5rem;
    font-family: var(--font-family);
    font-weight: var(--font-weight-regular);
    font-size: var(--font-size-label);
    color: var(--color-text);
    resize: vertical;
    transition: var(--transition-input);

    &::placeholder {
      font-family: var(--font-family);
      font-weight: var(--font-weight-regular);
      font-size: var(--font-size-label);
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
`
