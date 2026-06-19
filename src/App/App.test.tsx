import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import App from './index'

vi.mock('../assets/logo-recreio.png', () => ({
  default: 'logo-recreio-stub.png',
}))

vi.mock('../assets/logo-sme.png', () => ({
  default: 'logo-sme-stub.png',
}))

vi.mock('../assets/background-home.jpg', () => ({
  default: 'background-home-stub.jpg',
}))

describe('App', () => {
  it('renderiza a rota inicial com o formulário de login', () => {
    render(<App />)

    expect(screen.getByText(/bem-vindo\(a\) ao/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/usuário/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument()
  })
})
