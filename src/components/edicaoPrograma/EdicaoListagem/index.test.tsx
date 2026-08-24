import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ErroListagemEdicoesPrograma } from '@/services/edicaoPrograma/listarEdicoesPrograma'
import type { EdicaoPrograma } from '@/services/edicaoPrograma/types'
import { EdicaoListagem } from './index'

const { listarEdicoesProgramaMock } = vi.hoisted(() => ({
  listarEdicoesProgramaMock: vi.fn(),
}))

vi.mock(
  '@/services/edicaoPrograma/listarEdicoesPrograma',
  async (importOriginal) => {
    const actual =
      await importOriginal<
        typeof import('@/services/edicaoPrograma/listarEdicoesPrograma')
      >()

    return {
      ...actual,
      listarEdicoesPrograma: listarEdicoesProgramaMock,
    }
  },
)

function criarEdicao(
  sobrescritas: Partial<EdicaoPrograma> = {},
): EdicaoPrograma {
  return {
    id: '1',
    nome: 'Janeiro 2026',
    dataInicioEdicao: '2026-01-01',
    dataFimEdicao: '2026-01-31',
    dataInicioInscricoes: '2025-12-01',
    dataFimInscricoes: '2025-12-31',
    quantidadeInscritos: 0,
    quantidadeAtendimentoEfetivo: 0,
    quantidadePasseios: 0,
    quantidadeApresentacoes: 0,
    ...sobrescritas,
  }
}

const edicoesExemplo = [
  criarEdicao({ id: '1', nome: 'Janeiro 2026' }),
  criarEdicao({ id: '2', nome: 'Fevereiro 2026' }),
  criarEdicao({ id: '3', nome: 'Março 2026' }),
]

function renderEdicaoListagem() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <EdicaoListagem />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('EdicaoListagem', () => {
  beforeEach(() => {
    listarEdicoesProgramaMock.mockReset()
    listarEdicoesProgramaMock.mockResolvedValue(edicoesExemplo)
  })

  it('exibe indicador de carregamento antes da listagem retornar', () => {
    listarEdicoesProgramaMock.mockImplementation(
      () =>
        new Promise(() => {
          /* pendente */
        }),
    )

    renderEdicaoListagem()

    expect(
      screen.getByText(/carregando edições do programa/i),
    ).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  it('exibe tabela com edições retornadas pela API', async () => {
    renderEdicaoListagem()

    expect(await screen.findByRole('table')).toBeInTheDocument()
    expect(screen.getByText('Janeiro 2026')).toBeInTheDocument()
    expect(screen.getByText('Fevereiro 2026')).toBeInTheDocument()
    expect(screen.getByText('Março 2026')).toBeInTheDocument()
    expect(screen.queryByText(/sem dados/i)).not.toBeInTheDocument()
  })

  it('pagina no cliente sem nova requisição', async () => {
    const usuario = userEvent.setup()
    const edicoes = Array.from({ length: 11 }, (_, indice) =>
      criarEdicao({
        id: String(indice + 1),
        nome: `Edição ${indice + 1}`,
      }),
    )
    listarEdicoesProgramaMock.mockResolvedValue(edicoes)

    renderEdicaoListagem()

    expect(await screen.findByText('Edição 1')).toBeInTheDocument()
    expect(screen.queryByText('Edição 11')).not.toBeInTheDocument()

    await usuario.click(screen.getByRole('button', { name: /^página 2$/i }))

    expect(await screen.findByText('Edição 11')).toBeInTheDocument()
    expect(screen.queryByText('Edição 1')).not.toBeInTheDocument()
    expect(listarEdicoesProgramaMock).toHaveBeenCalledTimes(1)
  })

  it('altera itens por página no cliente sem nova requisição', async () => {
    const usuario = userEvent.setup()
    const edicoes = Array.from({ length: 11 }, (_, indice) =>
      criarEdicao({
        id: String(indice + 1),
        nome: `Edição ${indice + 1}`,
      }),
    )
    listarEdicoesProgramaMock.mockResolvedValue(edicoes)

    renderEdicaoListagem()

    expect(await screen.findByText('Edição 1')).toBeInTheDocument()
    expect(screen.queryByText('Edição 11')).not.toBeInTheDocument()

    await usuario.click(
      screen.getByRole('combobox', { name: /itens por página/i }),
    )
    await usuario.click(await screen.findByRole('option', { name: '20' }))

    expect(await screen.findByText('Edição 11')).toBeInTheDocument()
    expect(screen.getByText('Edição 1')).toBeInTheDocument()
    expect(listarEdicoesProgramaMock).toHaveBeenCalledTimes(1)
  })

  it('exibe detalhe da API quando a listagem falha', async () => {
    listarEdicoesProgramaMock.mockRejectedValue(
      new ErroListagemEdicoesPrograma('Falha ao carregar edições.'),
    )

    renderEdicaoListagem()

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Falha ao carregar edições.',
    )
    expect(screen.getByText(/sem dados/i)).toBeInTheDocument()
  })

  it('não exibe alerta quando o backend não envia detalhe', async () => {
    listarEdicoesProgramaMock.mockRejectedValue(
      new ErroListagemEdicoesPrograma(''),
    )

    renderEdicaoListagem()

    expect(await screen.findByText(/sem dados/i)).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
