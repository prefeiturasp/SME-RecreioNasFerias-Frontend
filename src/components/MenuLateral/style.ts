import { Link } from 'react-router-dom'
import styled from 'styled-components'

export const ContainerMenuLateral = styled.aside<{ $estaAberto: boolean }>`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: ${({ $estaAberto }) => ($estaAberto ? '18%' : '3.5rem')};
  min-width: ${({ $estaAberto }) => ($estaAberto ? '12rem' : '3.5rem')};
  height: 100vh;
  background-color: #1d0a55;
  transition:
    width 0.2s ease,
    min-width 0.2s ease;
`

export const BotaoAbrirMenu = styled.button`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 3.5rem;
  height: 3.5rem;
  color: #ffffff;
`

export const ConteudoMenu = styled.nav`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  color: #ffffff;
  overflow: hidden;
`

export const AreaRolagemMenu = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
`

export const CabecalhoMenu = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  width: 100%;
  height: 118px;
  background-color: #312885;
  padding: 16px 8px;
  border-radius: 0 0 4px 4px;

  > h3 {
    flex: 1;
    color: #ffffff;
    font-family: var(--font-family-baloo);
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
  }
`

export const BotaoFecharMenu = styled.button`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  color: #ffffff;
`

export const ListaMenu = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px 4px 0;
  margin: 0;
`

export const CartaoItemMenu = styled(Link)`
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  height: 96px;
  padding: 4px;
  border-radius: 4px;
  background-color: #3d358f;
  color: #ffffff;
  text-decoration: none;

  &:focus-visible {
    outline: 2px solid #ffffff;
    outline-offset: 2px;
  }
`

export const IndicadorCartaoMenu = styled.span`
  position: absolute;
  top: 4px;
  right: 4px;
  color: #b5c99a;

  > svg {
    width: 12px;
    height: auto;
  }
`

export const IconeCartaoMenu = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 25px;
  height: 25px;
  flex-shrink: 0;

  > img {
    width: 25px;
    height: 25px;
    object-fit: contain;
  }
`

export const RotuloCartaoMenu = styled.span`
  font-family: 'Roboto', sans-serif;
  font-weight: 700;
  font-size: 14px;
  line-height: 1;
  color: #ffffff;
`

export const RodapeLogoMenu = styled.div`
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  padding: 16px 8px 20px;
`

export const LogoMenu = styled.img`
  width: 157px;
  height: 55px;
  object-fit: contain;
`
