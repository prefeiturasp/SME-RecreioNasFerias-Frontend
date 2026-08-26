import styled, { css } from 'styled-components'

const focoVisivel = css`
  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
`

const transicaoBotao = css`
  cursor: pointer;
  transition: var(--transition-button);
  ${focoVisivel}
`

const estilosBotaoContorno = css`
  ${transicaoBotao}
  border: 1px solid var(--color-brand-dark);
  background-color: var(--color-background);
  color: var(--color-brand-dark);

  &:hover {
    background-color: var(--color-button-outline-hover-bg);
    border-color: var(--color-primary);
    box-shadow: var(--shadow-button-outline-hover);
  }

  &:active {
    background-color: var(--color-button-outline-active-bg);
    transform: scale(0.97);
  }
`

const estilosBotaoPreenchido = css`
  ${transicaoBotao}
  border: 1px solid var(--color-brand-dark);
  background-color: var(--color-brand-dark);
  color: var(--color-background);

  &:hover:not(:disabled) {
    background-color: var(--color-brand-dark-hover);
    box-shadow: var(--shadow-button-primary-hover);
  }

  &:active:not(:disabled) {
    background-color: var(--color-brand-dark-active);
    transform: scale(0.98);
    box-shadow: none;
  }

  &:disabled {
    background-color: var(--color-button-primary-disabled-bg);
    border-color: var(--color-button-primary-disabled-border);
    color: var(--color-background);
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
    pointer-events: none;
    opacity: 1;
  }
`

export const ContainerPaginaEdicoesPrograma = styled.main`
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
`

export const SecaoPrincipal = styled.section`
  flex: 1;
  min-width: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-main-background);
`

export const AreaConteudo = styled.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: var(--size-content-padding);

  @media (max-width: 48rem) {
    padding: var(--size-content-padding-mobile);
  }
`

export const CabecalhoAreaInternaConteudo = styled.div`
  margin-top: var(--size-content-padding);
  margin-bottom: 1rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  > h3 {
    font-family: var(--font-family);
    font-weight: var(--font-weight-bold);
    font-size: var(--font-size-section-title);
    line-height: 1.2;
  }

  > div {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    align-items: center;
    gap: 0.625rem;
  }

  @media (max-width: 48rem) {
    flex-direction: column;
    align-items: stretch;

    > div {
      flex-direction: column;
      align-items: stretch;

      > button {
        width: 100%;
      }
    }
  }
`

export const RotuloBotaoVoltar = styled.span`
  font-size: var(--font-size-button);
  font-weight: var(--font-weight-bold);
  color: var(--color-brand-dark);
  margin-left: 0.625rem;
`

export const BotaoVoltar = styled.button`
  ${estilosBotaoContorno}
  display: inline-flex;
  height: var(--size-button-height);
  border-radius: var(--size-radius-sm);
  justify-content: center;
  align-items: center;
  padding: 0 1rem;
`

export const BotaoCadastrarNovaEdicao = styled.button`
  ${estilosBotaoPreenchido}
  height: var(--size-button-height);
  padding: 0.5rem 1rem;
  border-radius: 0.1875rem;
  font-family: var(--font-family);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-button);
  white-space: nowrap;

  @media (max-width: 48rem) {
    white-space: normal;
    text-align: center;
  }
`

const estilosCartaoConteudoInterno = css`
  background-color: var(--color-background);
  padding: var(--size-content-padding);
  border-radius: var(--size-radius-sm);
  box-shadow: var(--shadow-card);

  @media (max-width: 48rem) {
    padding: var(--size-content-padding-mobile);
  }
`

export const CartaoConteudoInterno = styled.div`
  ${estilosCartaoConteudoInterno}
`

export const ListagemEdicoesPrograma = styled(CartaoConteudoInterno)``

export const FormularioCadastroNovaEdicao = styled.form`
  ${estilosCartaoConteudoInterno}
`

export const MensagemErroFormulario = styled.div`
  margin-bottom: 1rem;
  border: 1px solid #e8b4b8;
  border-radius: 4px;
  background-color: #f8d7da;
  padding: 0.75rem 1rem;
  font-family: var(--font-family);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-label);
  color: #721c24;
  line-height: 1.4;
  text-align: center;
`

export const BotaoCancelarFormulario = styled.button`
  ${estilosBotaoContorno}
  height: var(--size-button-height);
  border-radius: var(--size-radius-sm);
  padding: 0.625rem 1rem;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-family: var(--font-family);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-button-sm);
`

export const BotaoSalvarFormulario = styled.button`
  ${estilosBotaoPreenchido}
  height: var(--size-button-height);
  border-radius: var(--size-radius-sm);
  padding: 0.625rem 1rem;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-family: var(--font-family);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-button-sm);
`

export const LinhaDeControlesFormularioCadastroNovaEdicao = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 48rem) {
    flex-direction: column-reverse;
    align-items: stretch;

    > button {
      width: 100%;
    }
  }
`
