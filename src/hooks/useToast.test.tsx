import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { ToastProvider } from '@/contexts/ToastContext'
import { useToast } from './useToast'

function ConsumidorToast() {
  const { dismissToast, showToast, toasts } = useToast()

  return (
    <>
      <button
        onClick={() =>
          showToast({ id: 'mensagem', description: 'Mensagem exibida' })
        }
      >
        Exibir
      </button>
      <button
        onClick={() =>
          showToast({ id: 'mensagem', description: 'Mensagem atualizada' })
        }
      >
        Atualizar
      </button>
      <button onClick={() => dismissToast('mensagem')}>Fechar</button>

      {toasts.map((toast) => (
        <output key={toast.id}>{toast.description}</output>
      ))}
    </>
  )
}

describe('useToast', () => {
  it('exibe, atualiza e fecha uma mensagem', async () => {
    const usuario = userEvent.setup()
    render(
      <ToastProvider>
        <ConsumidorToast />
      </ToastProvider>,
    )

    await usuario.click(screen.getByRole('button', { name: 'Exibir' }))
    expect(screen.getByText('Mensagem exibida')).toBeInTheDocument()

    await usuario.click(screen.getByRole('button', { name: 'Atualizar' }))
    expect(screen.queryByText('Mensagem exibida')).not.toBeInTheDocument()
    expect(screen.getByText('Mensagem atualizada')).toBeInTheDocument()

    await usuario.click(screen.getByRole('button', { name: 'Fechar' }))
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('exige o uso dentro do provider', () => {
    expect(() => render(<ConsumidorToast />)).toThrow(
      'useToast deve ser usado dentro de ToastProvider.',
    )
  })
})
