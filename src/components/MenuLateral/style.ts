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

export const CartaoGrupoMenu = styled.div`
  box-sizing: border-box;
  width: 100%;
  border-radius: 4px;
  background-color: #ffffff;
  overflow: hidden;
`

export const CabecalhoGrupoMenu = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`

export const BotaoCabecalhoGrupoMenu = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  width: 100%;
  min-height: 25px;
  padding: 12px 8px;
  color: #1d0a55;
  text-align: left;

  &:focus-visible {
    outline: 2px solid #ffffff;
    outline-offset: -2px;
  }
`

export const IconeCartaoMenu = styled.span<{ $icone: string }>`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 25px;
  height: 25px;
  background-color: #1d0a55;
  mask: url(${({ $icone }) => $icone}) center / contain no-repeat;
  -webkit-mask: url(${({ $icone }) => $icone}) center / contain no-repeat;
`

export const RotuloGrupoMenu = styled.span`
  display: flex;
  align-items: center;
  flex: 1;
  min-height: 25px;
  font-family: var(--font-family);
  font-weight: 700;
  font-size: 14px;
  line-height: 1;
  color: #1d0a55;
`

export const IconeChevronGrupoMenu = styled.span<{ $expandido: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  color: #1d0a55;
  transform: rotate(${({ $expandido }) => ($expandido ? '180deg' : '0deg')});
  transition: transform 0.2s ease;

  > svg {
    width: 24px;
    height: 24px;
  }
`

export const ListaSubitensMenu = styled.ul`
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid #e5e5e5;
`

export const SubitemMenu = styled(Link)<{ $ativo?: boolean }>`
  display: block;
  padding: 12px 8px 12px 41px;
  border-top: 1px solid #e5e5e5;
  font-family: 'Roboto', sans-serif;
  font-weight: 700;
  font-size: 14px;
  line-height: 1.2;
  color: ${({ $ativo }) => ($ativo ? '#1d0a55' : '#6b6b6b')};
  text-decoration: none;
  background-color: ${({ $ativo }) => ($ativo ? '#f5f5f5' : 'transparent')};

  &:first-child {
    border-top: none;
  }

  &:hover {
    background-color: #f5f5f5;
    color: #1d0a55;
  }

  &:focus-visible {
    outline: 2px solid #1d0a55;
    outline-offset: -2px;
  }
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
