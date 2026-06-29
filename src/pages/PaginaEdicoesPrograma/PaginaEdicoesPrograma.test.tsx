import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { EdicaoPrograma } from '../../services/edicaoPrograma/types'

import PaginaEdicoesPrograma from './index'

vi.mock('../../components/MenuLateral', () => ({
  MenuLateral: () => <aside aria-label="menu lateral">Menu lateral</aside>,
}))

vi.mock('../../components/Cabecalho', () => ({
  Cabecalho: () => <header>Header principal</header>,
}))

vi.mock('../../components/MapaVisual', () => ({
  MapaVisual: () => <nav aria-label="Mapa do site">Mapa visual</nav>,
}))

const { listarEdicoesProgramaMock } = vi.hoisted(() => ({
  listarEdicoesProgramaMock: vi.fn(),
}))

vi.mock('../../services/edicaoPrograma/api', () => ({
  listarEdicoesPrograma: listarEdicoesProgramaMock,
}))

function criarListagemMock(
  edicoes: EdicaoPrograma[],
  sobrescritas: Partial<{
    pagina: number
    tamanhoPagina: number
    total: number
    totalPaginas: number
  }> = {},
) {
  return {
    edicoes,
    pagina: 1,
    tamanhoPagina: 10,
    total: edicoes.length,
    totalPaginas: 1,
    ...sobrescritas,
  }
}

const edicoesExemplo: EdicaoPrograma[] = [
  {
    id: '1',

    nome: 'Janeiro 2026',

    dataInicioEdicao: '2026-01-01',

    dataFimEdicao: '2026-01-31',

    dataInicioInscricoes: '2025-12-01',

    dataFimInscricoes: '2025-12-31',

      quantidadeInscritos: 50,

      quantidadeAtendimentoEfetivo: 40,

      quantidadePasseios: 0,

      quantidadeApresentacoes: 0,
    },

    {
      id: '2',

      nome: 'Fevereiro 2026',

      dataInicioEdicao: '2026-01-26',

      dataFimEdicao: '2026-02-26',

      dataInicioInscricoes: '2025-12-26',

      dataFimInscricoes: '2026-01-26',

      quantidadeInscritos: 100,

      quantidadeAtendimentoEfetivo: 100,

      quantidadePasseios: 0,

      quantidadeApresentacoes: 0,
    },

    {
      id: '3',

      nome: 'Março 2026',

      dataInicioEdicao: '2026-03-01',

      dataFimEdicao: '2026-03-31',

      dataInicioInscricoes: '2026-02-01',

      dataFimInscricoes: '2026-02-28',

      quantidadeInscritos: 200,

      quantidadeAtendimentoEfetivo: 180,

      quantidadePasseios: 0,

      quantidadeApresentacoes: 0,
    },
]

describe('PaginaEdicoesPrograma', () => {
  beforeEach(() => {
    listarEdicoesProgramaMock.mockReset()

    listarEdicoesProgramaMock.mockResolvedValue(
      criarListagemMock(edicoesExemplo),
    )
  })

  it('exibe indicador de carregamento antes da listagem retornar', () => {
    listarEdicoesProgramaMock.mockImplementation(
      () =>
        new Promise(() => {
          /* pendente */
        }),
    )

    render(
      <MemoryRouter>
        <PaginaEdicoesPrograma />
      </MemoryRouter>,
    )

    expect(
      screen.getByText(/carregando edições do programa/i),
    ).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  it('renderiza MenuLateral, Cabecalho e mapa visual', async () => {
    render(
      <MemoryRouter>
        <PaginaEdicoesPrograma />
      </MemoryRouter>,
    )

    expect(screen.getByLabelText(/menu lateral/i)).toBeInTheDocument()

    expect(screen.getByText(/header principal/i)).toBeInTheDocument()

    expect(
      screen.getByRole('navigation', { name: /mapa do site/i }),
    ).toBeInTheDocument()

    await waitFor(() => {
      expect(listarEdicoesProgramaMock).toHaveBeenCalledWith({
        pagina: 1,
        tamanhoPagina: 10,
      })
    })
  })

  it('carrega edições apenas uma vez ao retornar do cadastro', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: '/edicoes-programa',
            state: { edicaoCadastrada: true },
          },
        ]}
      >
        <PaginaEdicoesPrograma />
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(listarEdicoesProgramaMock).toHaveBeenCalledTimes(1)
    })
  })

  it('exibe mensagem de sucesso ao retornar do cadastro', () => {
    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: '/edicoes-programa',

            state: { edicaoCadastrada: true },
          },
        ]}
      >
        <PaginaEdicoesPrograma />
      </MemoryRouter>,
    )

    expect(
      screen.getByText(/edição do programa cadastrado com sucesso/i),
    ).toBeInTheDocument()
  })

  it('busca nova página ao interagir com a paginação', async () => {
    const usuario = userEvent.setup()

    listarEdicoesProgramaMock
      .mockResolvedValueOnce(
        criarListagemMock(edicoesExemplo, { totalPaginas: 3, total: 30 }),
      )
      .mockResolvedValueOnce(
        criarListagemMock(
          [{ ...edicoesExemplo[0], id: '10', nome: 'Outubro 2026' }],
          { pagina: 2, totalPaginas: 3, total: 30 },
        ),
      )

    render(
      <MemoryRouter>
        <PaginaEdicoesPrograma />
      </MemoryRouter>,
    )

    expect(await screen.findByText('Janeiro 2026')).toBeInTheDocument()

    await usuario.click(screen.getByRole('button', { name: /^página 2$/i }))

    await waitFor(() => {
      expect(listarEdicoesProgramaMock).toHaveBeenLastCalledWith({
        pagina: 2,
        tamanhoPagina: 10,
      })
    })

    expect(await screen.findByText('Outubro 2026')).toBeInTheDocument()
  })

  it('exibe tabela com edições retornadas pela API', async () => {
    render(
      <MemoryRouter>
        <PaginaEdicoesPrograma />
      </MemoryRouter>,
    )

    expect(await screen.findByRole('table')).toBeInTheDocument()

    expect(screen.getByText('Janeiro 2026')).toBeInTheDocument()

    expect(screen.getByText('Fevereiro 2026')).toBeInTheDocument()

    expect(screen.getByText('Março 2026')).toBeInTheDocument()

    expect(screen.queryByText(/sem dados/i)).not.toBeInTheDocument()
  })
})
