import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { PaginacaoEdicoesPrograma } from './PaginacaoEdicoesPrograma'

describe('PaginacaoEdicoesPrograma', () => {
  it('usa o Pagination do shadcn e notifica mudança de página', async () => {
    const usuario = userEvent.setup()
    const onMudarPagina = vi.fn()

    render(
      <PaginacaoEdicoesPrograma
        paginaAtual={1}
        totalPaginas={20}
        itensPorPagina={10}
        onMudarPagina={onMudarPagina}
        onMudarItensPorPagina={vi.fn()}
      />,
    )

    expect(
      screen.getByRole('navigation', {
        name: /paginação da listagem de edições/i,
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /página anterior/i }),
    ).toBeDisabled()
    expect(
      screen.getByRole('button', { name: /^página 20$/i }),
    ).toBeInTheDocument()

    await usuario.click(screen.getByRole('button', { name: /^página 3$/i }))

    expect(onMudarPagina).toHaveBeenCalledWith(3)
  })

  it('notifica mudança de itens por página pelo Select do shadcn', async () => {
    const usuario = userEvent.setup()
    const onMudarItensPorPagina = vi.fn()

    render(
      <PaginacaoEdicoesPrograma
        paginaAtual={1}
        totalPaginas={2}
        itensPorPagina={10}
        onMudarPagina={vi.fn()}
        onMudarItensPorPagina={onMudarItensPorPagina}
      />,
    )

    await usuario.click(
      screen.getByRole('combobox', { name: /itens por página/i }),
    )
    await usuario.click(await screen.findByRole('option', { name: '20' }))

    expect(onMudarItensPorPagina).toHaveBeenCalledWith(20)
  })

  it('desabilita próxima página na última página', () => {
    render(
      <PaginacaoEdicoesPrograma
        paginaAtual={3}
        totalPaginas={3}
        itensPorPagina={10}
        onMudarPagina={vi.fn()}
        onMudarItensPorPagina={vi.fn()}
      />,
    )

    expect(
      screen.getByRole('button', { name: /próxima página/i }),
    ).toBeDisabled()
  })
})
