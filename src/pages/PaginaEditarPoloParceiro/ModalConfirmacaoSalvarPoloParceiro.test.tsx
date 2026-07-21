import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { ModalConfirmacaoSalvarPoloParceiro } from './ModalConfirmacaoSalvarPoloParceiro'

describe('ModalConfirmacaoSalvarPoloParceiro', () => {
  it('não renderiza quando está fechado', () => {
    render(
      <ModalConfirmacaoSalvarPoloParceiro
        aberto={false}
        onConfirmar={vi.fn()}
        onCancelar={vi.fn()}
      />,
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('exibe mensagem de confirmação e ações quando aberto', () => {
    render(
      <ModalConfirmacaoSalvarPoloParceiro
        aberto
        onConfirmar={vi.fn()}
        onCancelar={vi.fn()}
      />,
    )

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(
      screen.getByText(
        /deseja salvar as alterações realizadas no polo parceiro/i,
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
      <ModalConfirmacaoSalvarPoloParceiro
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

  it('fecha ao pressionar Escape', async () => {
    const usuario = userEvent.setup()
    const onCancelar = vi.fn()

    render(
      <ModalConfirmacaoSalvarPoloParceiro
        aberto
        onConfirmar={vi.fn()}
        onCancelar={onCancelar}
      />,
    )

    await usuario.keyboard('{Escape}')

    expect(onCancelar).toHaveBeenCalledTimes(1)
  })
})
