import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MensagemSucessoAoCriarNovaEdicaoPrograma } from './MensagemSucessoAoCriarNovaEdicaoPrograma'

describe('MensagemSucessoAoCriarNovaEdicaoPrograma', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('não renderiza quando invisível', () => {
    render(
      <MensagemSucessoAoCriarNovaEdicaoPrograma
        visivel={false}
        onFechar={vi.fn()}
      />,
    )

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('renderiza mensagem e botão de fechar quando visível', () => {
    render(
      <MensagemSucessoAoCriarNovaEdicaoPrograma visivel onFechar={vi.fn()} />,
    )

    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(
      screen.getByText(/edição do programa cadastrado com sucesso/i),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /fechar mensagem de sucesso/i }),
    ).toBeInTheDocument()
  })

  it('renderiza mensagem personalizada quando informada', () => {
    render(
      <MensagemSucessoAoCriarNovaEdicaoPrograma
        visivel
        mensagem="Edição do Programa atualizada com sucesso!"
        onFechar={vi.fn()}
      />,
    )

    expect(
      screen.getByText(/edição do programa atualizada com sucesso/i),
    ).toBeInTheDocument()
    expect(
      screen.queryByText(/edição do programa cadastrado com sucesso/i),
    ).not.toBeInTheDocument()
  })

  it('chama onFechar ao clicar no botão de fechar', async () => {
    vi.useRealTimers()
    const usuario = userEvent.setup()
    const onFechar = vi.fn()

    render(
      <MensagemSucessoAoCriarNovaEdicaoPrograma visivel onFechar={onFechar} />,
    )

    await usuario.click(
      screen.getByRole('button', { name: /fechar mensagem de sucesso/i }),
    )

    expect(onFechar).toHaveBeenCalledTimes(1)
  })

  it('chama onFechar automaticamente após 3 segundos', () => {
    const onFechar = vi.fn()

    render(
      <MensagemSucessoAoCriarNovaEdicaoPrograma visivel onFechar={onFechar} />,
    )

    act(() => {
      vi.advanceTimersByTime(2999)
    })
    expect(onFechar).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(onFechar).toHaveBeenCalledTimes(1)
  })
})
