import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { BarraAcoesSelecaoDefinicaoPolos } from './BarraAcoesSelecaoDefinicaoPolos'

describe('BarraAcoesSelecaoDefinicaoPolos', () => {
  it('exibe contagem no singular para 1 UE selecionada', () => {
    render(
      <BarraAcoesSelecaoDefinicaoPolos
        quantidadeSelecionada={1}
        onAlterarEdicao={vi.fn()}
        onAlterarTipoPolo={vi.fn()}
        onCancelar={vi.fn()}
      />,
    )

    expect(screen.getByText('1 UE selecionada')).toBeInTheDocument()
  })

  it('exibe contagem no plural para várias UEs selecionadas', () => {
    render(
      <BarraAcoesSelecaoDefinicaoPolos
        quantidadeSelecionada={3}
        onAlterarEdicao={vi.fn()}
        onAlterarTipoPolo={vi.fn()}
        onCancelar={vi.fn()}
      />,
    )

    expect(screen.getByText('3 UEs selecionadas')).toBeInTheDocument()
  })

  it('anuncia a barra com aria-live polite', () => {
    const { container } = render(
      <BarraAcoesSelecaoDefinicaoPolos
        quantidadeSelecionada={2}
        onAlterarEdicao={vi.fn()}
        onAlterarTipoPolo={vi.fn()}
        onCancelar={vi.fn()}
      />,
    )

    expect(container.querySelector('[aria-live="polite"]')).toBeInTheDocument()
  })

  it('chama handlers ao clicar em Alterar Edição, Alterar Tipo de Polo e Cancelar', async () => {
    const usuario = userEvent.setup()
    const onAlterarEdicao = vi.fn()
    const onAlterarTipoPolo = vi.fn()
    const onCancelar = vi.fn()

    render(
      <BarraAcoesSelecaoDefinicaoPolos
        quantidadeSelecionada={2}
        onAlterarEdicao={onAlterarEdicao}
        onAlterarTipoPolo={onAlterarTipoPolo}
        onCancelar={onCancelar}
      />,
    )

    await usuario.click(screen.getByRole('button', { name: /alterar edição/i }))
    await usuario.click(
      screen.getByRole('button', { name: /alterar tipo de polo/i }),
    )
    await usuario.click(screen.getByRole('button', { name: /cancelar/i }))

    expect(onAlterarEdicao).toHaveBeenCalledTimes(1)
    expect(onAlterarTipoPolo).toHaveBeenCalledTimes(1)
    expect(onCancelar).toHaveBeenCalledTimes(1)
  })
})
