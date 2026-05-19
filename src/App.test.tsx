import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import App from './App'

vi.mock('./assets/hero.png', () => ({ default: 'hero-stub.png' }))

describe('App', () => {
  it('renderiza o título principal', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: /get started/i })).toBeInTheDocument()
  })

  it('incrementa o contador ao clicar no botão', async () => {
    const user = userEvent.setup()
    render(<App />)

    const button = screen.getByRole('button', { name: /count is 0/i })
    await user.click(button)

    expect(screen.getByRole('button', { name: /count is 1/i })).toBeInTheDocument()
  })
})
