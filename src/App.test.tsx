import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('renderiza a página inicial', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: /bem-vindo/i }),
    ).toBeInTheDocument()
  })

  it('navega para a página de inscrição', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('link', { name: /inscrição/i }))

    expect(
      screen.getByRole('heading', { name: /^inscrição$/i }),
    ).toBeInTheDocument()
  })
})
