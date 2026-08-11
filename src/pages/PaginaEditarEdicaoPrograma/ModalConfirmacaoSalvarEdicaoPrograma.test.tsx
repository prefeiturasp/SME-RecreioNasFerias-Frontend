import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ModalConfirmacaoSalvarEdicaoPrograma } from './ModalConfirmacaoSalvarEdicaoPrograma'

describe('ModalConfirmacaoSalvarEdicaoPrograma', () => {
  it('não expõe o diálogo quando está fechado', () => {
    render(
      <ModalConfirmacaoSalvarEdicaoPrograma
        aberto={false}
        onConfirmar={vi.fn()}
        onCancelar={vi.fn()}
      />,
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('exibe mensagem de confirmação e ações quando aberto', () => {
    render(
      <ModalConfirmacaoSalvarEdicaoPrograma
        aberto
        onConfirmar={vi.fn()}
        onCancelar={vi.fn()}
      />,
    )

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(
      screen.getByText(
        /deseja salvar as alterações realizadas na edição do programa/i,
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /^cancelar$/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /^salvar$/i }),
    ).toBeInTheDocument()
  })

  it('notifica confirmação e cancelamento', async () => {
    const usuario = userEvent.setup()
    const onConfirmar = vi.fn()
    const onCancelar = vi.fn()

    render(
      <ModalConfirmacaoSalvarEdicaoPrograma
        aberto
        onConfirmar={onConfirmar}
        onCancelar={onCancelar}
      />,
    )

    await usuario.click(screen.getByRole('button', { name: /^cancelar$/i }))
    expect(onCancelar).toHaveBeenCalledTimes(1)

    await usuario.click(screen.getByRole('button', { name: /^salvar$/i }))
    expect(onConfirmar).toHaveBeenCalledTimes(1)
  })

  it('fecha ao clicar no backdrop do diálogo', async () => {
    const usuario = userEvent.setup()
    const onCancelar = vi.fn()

    render(
      <ModalConfirmacaoSalvarEdicaoPrograma
        aberto
        onConfirmar={vi.fn()}
        onCancelar={onCancelar}
      />,
    )

    await usuario.click(screen.getByRole('button', { name: /fechar diálogo/i }))
    expect(onCancelar).toHaveBeenCalledTimes(1)
  })
})
