import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
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
    expect(
      screen.getByRole('columnheader', { name: /nome da edição/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('columnheader', { name: /período da edição/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('columnheader', { name: /período das inscrições/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('columnheader', { name: /quantidade de inscritos/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('columnheader', {
        name: /quantidade de atendimento efetivo/i,
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('columnheader', { name: /ações/i }),
    ).toBeInTheDocument()
    expect(screen.getByText('Janeiro 2026')).toBeInTheDocument()
    expect(screen.getByText('Fevereiro 2026')).toBeInTheDocument()
    expect(screen.getByText('Março 2026')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /editar edição janeiro 2026/i }),
    ).toHaveAttribute('href', '/editar-edicao-programa/1')
    expect(screen.queryByText(/sem dados/i)).not.toBeInTheDocument()
  })

  it('pagina no cliente sem nova requisição', async () => {
    const usuario = userEvent.setup()
    const edicoes = Array.from({ length: 11 }, (_, indice) =>
      criarEdicao({
        id: String(indice + 1),
        nome: `Edição ${String(indice + 1).padStart(2, '0')}`,
      }),
    )
    listarEdicoesProgramaMock.mockResolvedValue(edicoes)

    renderEdicaoListagem()

    expect(await screen.findByText('Edição 01')).toBeInTheDocument()
    expect(screen.queryByText('Edição 11')).not.toBeInTheDocument()

    await usuario.click(screen.getByRole('button', { name: /^página 2$/i }))

    expect(await screen.findByText('Edição 11')).toBeInTheDocument()
    expect(screen.queryByText('Edição 01')).not.toBeInTheDocument()
    expect(listarEdicoesProgramaMock).toHaveBeenCalledTimes(1)
  })

  it('volta para a primeira página ao ordenar', async () => {
    const usuario = userEvent.setup()
    const edicoes = Array.from({ length: 11 }, (_, indice) =>
      criarEdicao({
        id: String(indice + 1),
        nome: `Edição ${String(indice + 1).padStart(2, '0')}`,
      }),
    )
    listarEdicoesProgramaMock.mockResolvedValue(edicoes)

    renderEdicaoListagem()

    expect(await screen.findByText('Edição 01')).toBeInTheDocument()
    expect(screen.queryByText('Edição 11')).not.toBeInTheDocument()

    await usuario.click(screen.getByRole('button', { name: /^página 2$/i }))

    expect(await screen.findByText('Edição 11')).toBeInTheDocument()
    expect(screen.queryByText('Edição 01')).not.toBeInTheDocument()

    await usuario.click(
      screen.getByRole('button', { name: /ordenar por nome da edição/i }),
    )

    expect(await screen.findByText('Edição 11')).toBeInTheDocument()
    expect(screen.getByText('Edição 10')).toBeInTheDocument()
    expect(screen.queryByText('Edição 01')).not.toBeInTheDocument()
  })

  it('altera itens por página no cliente sem nova requisição', async () => {
    const usuario = userEvent.setup()
    const edicoes = Array.from({ length: 11 }, (_, indice) =>
      criarEdicao({
        id: String(indice + 1),
        nome: `Edição ${String(indice + 1).padStart(2, '0')}`,
      }),
    )
    listarEdicoesProgramaMock.mockResolvedValue(edicoes)

    renderEdicaoListagem()

    expect(await screen.findByText('Edição 01')).toBeInTheDocument()
    expect(screen.queryByText('Edição 11')).not.toBeInTheDocument()

    await usuario.click(
      screen.getByRole('combobox', { name: /itens por página/i }),
    )
    await usuario.click(await screen.findByRole('option', { name: '20' }))

    expect(await screen.findByText('Edição 11')).toBeInTheDocument()
    expect(screen.getByText('Edição 01')).toBeInTheDocument()
    expect(listarEdicoesProgramaMock).toHaveBeenCalledTimes(1)
  })

  it('exibe detalhe da API quando a listagem falha', async () => {
    listarEdicoesProgramaMock.mockRejectedValue({
      response: { data: { detalhe: 'Falha ao carregar edições.' } },
    })

    renderEdicaoListagem()

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Falha ao carregar edições.',
    )
    expect(screen.queryByText(/sem dados/i)).not.toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  it('não exibe alerta nem listagem vazia quando o backend não envia detalhe', async () => {
    listarEdicoesProgramaMock.mockRejectedValue({
      response: { data: {} },
    })

    renderEdicaoListagem()

    await waitFor(() => {
      expect(
        screen.queryByText(/carregando edições do programa/i),
      ).not.toBeInTheDocument()
    })
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.queryByText(/sem dados/i)).not.toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  it('exibe sem dados quando a API retorna lista vazia', async () => {
    listarEdicoesProgramaMock.mockResolvedValue([])

    renderEdicaoListagem()

    expect(await screen.findByText(/sem dados/i)).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })
})
