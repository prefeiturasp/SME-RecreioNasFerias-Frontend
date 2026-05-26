import { SideMenu } from '../../components/SideMenu'
import { MainStyled, Section } from './style'

export default function Main() {
  return (
    <MainStyled>
      <SideMenu />
      <Section>conteudo principal</Section>
    </MainStyled>
  )
}
