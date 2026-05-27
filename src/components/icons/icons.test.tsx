import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  ChevronDownIcon,
  CloseIcon,
  ConfiguracoesIcon,
  CronogramasIcon,
  IconeInicio,
  IconeModuloConfiguracoes,
  IconeModuloCronogramas,
  IconeModuloInscricoes,
  IconeSair,
  InscricoesIcon,
  MenuIcon,
} from './index'

const icones = [
  { nome: 'MenuIcon', Componente: MenuIcon },
  { nome: 'CloseIcon', Componente: CloseIcon },
  { nome: 'CronogramasIcon', Componente: CronogramasIcon },
  { nome: 'InscricoesIcon', Componente: InscricoesIcon },
  { nome: 'ConfiguracoesIcon', Componente: ConfiguracoesIcon },
  { nome: 'ChevronDownIcon', Componente: ChevronDownIcon },
  { nome: 'IconeSair', Componente: IconeSair },
  { nome: 'IconeInicio', Componente: IconeInicio },
  { nome: 'IconeModuloCronogramas', Componente: IconeModuloCronogramas },
  { nome: 'IconeModuloInscricoes', Componente: IconeModuloInscricoes },
  { nome: 'IconeModuloConfiguracoes', Componente: IconeModuloConfiguracoes },
] as const

describe('icons', () => {
  it.each(icones)('renderiza $nome como svg decorativo', ({ Componente }) => {
    const { container } = render(<Componente />)

    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute('aria-hidden', 'true')
  })
})
