import styled from 'styled-components'

export const MainStyled = styled.main`
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
`

export const Section = styled.section`
  flex: 1;
  min-width: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-main-background);
`

export const ContentArea = styled.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 32px;
`

export const ContentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--color-primary);

  > svg {
    width: 1.4rem;
    height: 1.4rem;
  }
`

export const ContentHeaderTitle = styled.h2`
  margin: 0;
  font-family: var(--font-family);
  font-size: 1rem;
  font-weight: var(--font-weight-regular);
  line-height: 1;
`

export const GradeModulos = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 262px);
  justify-content: start;
  gap: 1.5rem;
  margin-top: 24px;
`

