import styled from 'styled-components'

export const Aside = styled.aside<{ $isOpen: boolean }>`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: ${({ $isOpen }) => ($isOpen ? '20%' : '3.5rem')};
  min-width: ${({ $isOpen }) => ($isOpen ? '12rem' : '3.5rem')};
  height: 100vh;
  background-color: #1d0a55;
  transition:
    width 0.2s ease,
    min-width 0.2s ease;
`

export const MenuToggleButton = styled.button`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 3.5rem;
  height: 3.5rem;
  color: #ffffff;
`

export const MenuContent = styled.nav`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  color: #ffffff;
  overflow: hidden;
`

export const MenuScrollArea = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
`

export const MenuHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  width: 100%;
  height: 88px;
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

export const MenuCloseButton = styled.button`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  color: #ffffff;
`

export const MenuList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px 4px 0;
  margin: 0;
`

export const MenuItem = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 40px;
  padding: 0 12px;
  border-radius: 4px;
  background-color: #3d358f;
  color: #ffffff;
`

export const MenuItemLabel = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-family);
  font-weight: var(--font-weight-bold);
  font-size: 14px;
  line-height: 18px;
  color: #ffffff;
`

export const MenuLogoFooter = styled.div`
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  padding: 16px 8px 20px;
`

export const MenuLogo = styled.img`
  width: 157px;
  height: 55px;
  object-fit: contain;
`
