import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import Main from './index'

vi.mock('../../components/SideMenu', () => ({
  SideMenu: () => <aside aria-label="menu lateral">Menu lateral</aside>,
}))

vi.mock('../../components/Header', () => ({
  Header: () => <header>Header principal</header>,
}))

vi.mock('../../assets', () => ({
  iconeCard1: 'icone-card-1-stub.png',
  iconeCard2: 'icone-card-2-stub.png',
  iconeCard3: 'icone-card-3-stub.png',
}))

describe('Main', () => {
  it('renderiza SideMenu, Header e título da área de conteúdo', () => {
    render(<Main />)

    expect(screen.getByLabelText(/menu lateral/i)).toBeInTheDocument()
    expect(screen.getByText(/header principal/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /início/i })).toBeInTheDocument()
  })

  it('renderiza os cards de módulos com os rótulos esperados', () => {
    render(<Main />)

    expect(screen.getByRole('button', { name: /cronogramas/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /inscrições/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /configurações/i })).toBeInTheDocument()
  })
})
