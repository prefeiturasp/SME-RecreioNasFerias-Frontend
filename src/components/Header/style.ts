import styled from 'styled-components'

export const HeaderContainer = styled.header`
  flex-shrink: 0;
  width: 100%;
  height: var(--size-main-header-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--size-main-header-padding-y) var(--size-main-header-padding-x);
  background-color: var(--color-background);
  box-shadow: var(--shadow-header-bottom);
`

export const LogoRecreio = styled.img`
  width: var(--size-main-logo-width);
  height: var(--size-main-logo-height);
`

export const BlocoUsuarioLogado = styled.div`
  display: flex;
  align-items: center;
  gap: var(--size-user-logout-gap);
`

export const CartaoUsuario = styled.div`
  min-width: var(--size-user-card-min-width);
  padding: var(--size-user-card-padding);
  background-color: var(--color-main-background);
  border: 1px solid var(--color-user-card-border);
  border-radius: var(--size-radius-sm);

  > p {
    font-family: var(--font-family);
    font-size: var(--font-size-user-info);
    font-weight: var(--font-weight-regular);
    color: var(--color-text);
  }
`

export const BotaoSair = styled.button`
  cursor: pointer;

  > span {
    font-size: var(--font-size-logout-label);
    font-weight: var(--font-weight-regular);
    color: var(--color-logout-label);
  }
`

export const IconeSairWrapper = styled.div`
  width: var(--size-logout-icon-wrapper);
  height: var(--size-logout-icon-wrapper);
  background-color: var(--color-primary);
  color: var(--color-background);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`
