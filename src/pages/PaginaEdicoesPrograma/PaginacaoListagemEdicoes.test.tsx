import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { PaginacaoListagemEdicoes } from './PaginacaoListagemEdicoes'

describe('PaginacaoListagemEdicoes', () => {
  it('renderiza controles de paginação conforme layout', () => {
    render(
      <PaginacaoListagemEdicoes
        paginaAtual={1}
        totalPaginas={20}
        itensPorPagina={10}
        onMudarPagina={vi.fn()}
        onMudarItensPorPagina={vi.fn()}
      />,
    )

    expect(
      screen.getByRole('navigation', { name: /paginação da listagem/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /página anterior/i }),
    ).toBeDisabled()
    expect(screen.getByRole('button', { name: /^página 1$/i })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(
      screen.getByRole('button', { name: /^página 5$/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /^página 20$/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /próxima página/i }),
    ).toBeEnabled()
    expect(
      screen.getByRole('combobox', { name: /itens por página/i }),
    ).toHaveValue('10')
  })

  it('notifica mudança de página e quantidade por página', async () => {
    const usuario = userEvent.setup()
    const onMudarPagina = vi.fn()
    const onMudarItensPorPagina = vi.fn()

    render(
      <PaginacaoListagemEdicoes
        paginaAtual={1}
        totalPaginas={20}
        itensPorPagina={10}
        onMudarPagina={onMudarPagina}
        onMudarItensPorPagina={onMudarItensPorPagina}
      />,
    )

    await usuario.click(screen.getByRole('button', { name: /^página 3$/i }))
    await usuario.click(screen.getByRole('button', { name: /próxima página/i }))
    await usuario.selectOptions(
      screen.getByRole('combobox', { name: /itens por página/i }),
      '20',
    )

    expect(onMudarPagina).toHaveBeenNthCalledWith(1, 3)
    expect(onMudarPagina).toHaveBeenNthCalledWith(2, 2)
    expect(onMudarItensPorPagina).toHaveBeenCalledWith(20)
  })
})
