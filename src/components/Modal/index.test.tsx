import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from '@/components/ui/button'
import { Modal } from './index'

describe('Modal', () => {
  it('não exibe o diálogo quando está fechado', () => {
    render(
      <Modal aberto={false} titulo="Título" onOpenChange={vi.fn()}>
        Conteúdo
      </Modal>,
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('exibe título, conteúdo e ações', async () => {
    const usuario = userEvent.setup({ delay: null })
    const onConfirmar = vi.fn()

    render(
      <Modal
        aberto
        titulo="Salvar alterações"
        onOpenChange={vi.fn()}
        acoes={
          <Button type="button" onClick={onConfirmar}>
            Salvar
          </Button>
        }
      >
        Deseja salvar as alterações?
      </Modal>,
    )

    const modal = await screen.findByRole('dialog')
    expect(modal).toHaveTextContent('Salvar alterações')
    expect(modal).toHaveTextContent('Deseja salvar as alterações?')

    await usuario.click(screen.getByRole('button', { name: /^salvar$/i }))

    expect(onConfirmar).toHaveBeenCalledTimes(1)
  })

  it('chama onOpenChange(false) ao cancelar', async () => {
    const usuario = userEvent.setup({ delay: null })
    const onOpenChange = vi.fn()

    render(
      <Modal
        aberto
        titulo="Confirmar ação"
        onOpenChange={onOpenChange}
        acoes={
          <Button type="button" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
        }
      >
        Deseja continuar?
      </Modal>,
    )

    await usuario.click(screen.getByRole('button', { name: /^cancelar$/i }))

    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})
