import styled from 'styled-components'

export const ContainerPaginaInicial = styled.main`
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
  padding: 32px;
`
