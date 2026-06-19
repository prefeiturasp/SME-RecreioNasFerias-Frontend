import { act, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('main', () => {
  beforeEach(() => {
    vi.resetModules()
    document.body.innerHTML = ''
  })

  afterEach(() => {
    vi.resetModules()
    document.body.innerHTML = ''
  })

  it('lança erro quando #root não existe', async () => {
    await expect(import('./main')).rejects.toThrow(
      'Elemento #root não encontrado no documento.',
    )
  })

  it('renderiza a aplicação quando #root existe', async () => {
    const root = document.createElement('div')
    root.id = 'root'
    document.body.appendChild(root)

    await act(async () => {
      await import('./main')
    })

    await waitFor(() => {
      expect(screen.getByText(/bem-vindo\(a\) ao/i)).toBeInTheDocument()
    })
  })
})
