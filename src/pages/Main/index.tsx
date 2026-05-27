import type { ReactNode } from 'react'
import { iconeCard1, iconeCard2, iconeCard3 } from '../../assets'
import { Header } from '../../components/Header'
import { IconeInicio } from '../../components/icons'
import { ModuleCard } from '../../components/ModuleCard'
import { SideMenu } from '../../components/SideMenu'
import {
  ContentArea,
  ContentHeader,
  ContentHeaderTitle,
  GradeModulos,
  MainStyled,
  Section,
} from './style'

type ModuloTelaInicial = {
  id: string
  nome: string
  icone: ReactNode
}

const modulosTelaInicial: ModuloTelaInicial[] = [
  {
    id: 'cronogramas',
    nome: 'Cronogramas',
    icone: <img src={iconeCard1} alt="" aria-hidden="true" />,
  },
  {
    id: 'inscricoes',
    nome: 'Inscrições',
    icone: <img src={iconeCard2} alt="" aria-hidden="true" />,
  },
  {
    id: 'configuracoes-1',
    nome: 'Configurações',
    icone: <img src={iconeCard3} alt="" aria-hidden="true" />,
  },
]

export default function Main() {
  return (
    <MainStyled>
      <SideMenu />
      <Section>
        <Header />
        <ContentArea>
          <ContentHeader>
            <IconeInicio />
            <ContentHeaderTitle>Início</ContentHeaderTitle>
          </ContentHeader>

          <GradeModulos>
            {modulosTelaInicial.map((modulo) => (
              <ModuleCard key={modulo.id} nome={modulo.nome} icone={modulo.icone} />
            ))}
          </GradeModulos>
        </ContentArea>
      </Section>
    </MainStyled>
  )
}
