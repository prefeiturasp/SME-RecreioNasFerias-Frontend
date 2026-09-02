import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import PaginaDefinicoesPolo from './index'

vi.mock('@/components/MenuLateral', () => ({
  MenuLateral: () => <aside aria-label="menu lateral">Menu lateral</aside>,
}))

vi.mock('@/components/Cabecalho', () => ({
  Cabecalho: () => <header>Header principal</header>,
}))

vi.mock('@/components/MapaVisual', () => ({
  MapaVisual: () => <nav aria-label="Mapa do site">Mapa visual</nav>,
}))

vi.mock('@/components/definicaoPolo/DefinicaoPolosListagem', () => ({
  DefinicaoPolosListagem: ({
    filtros,
    onAlterarEdicaoPolo,
    onAlterarTipoPolo,
  }: {
    filtros?: { gestao?: string }
    onAlterarEdicaoPolo: (idsPolos: string[]) => void
    onAlterarTipoPolo: (idsPolos: string[]) => void
  }) => (
    <div>
      <div>Listagem de definição de polos</div>
      <span data-testid="filtros-aplicados-gestao">
        {filtros?.gestao ?? ''}
      </span>
      <button
        type="button"
        onClick={() => onAlterarEdicaoPolo(['polo-1'])}
      >
        Simular alterar edição
      </button>
      <button type="button" onClick={() => onAlterarTipoPolo(['polo-1'])}>
        Simular alterar tipo
      </button>
    </div>
  ),
}))

const {
  atualizarDefinicoesPoloEmLoteMock,
  listarEdicoesProgramaMock,
  navegarMock,
  sincronizarUnidadesDiretasMock,
} = vi.hoisted(() => ({
  atualizarDefinicoesPoloEmLoteMock: vi.fn(),
  listarEdicoesProgramaMock: vi.fn(),
  navegarMock: vi.fn(),
  sincronizarUnidadesDiretasMock: vi.fn(),
}))

vi.mock('@/services/definicaoPolo/atualizarDefinicoesPoloEmLote', () => ({
  atualizarDefinicoesPoloEmLote: atualizarDefinicoesPoloEmLoteMock,
}))

vi.mock('@/services/definicaoPolo/sincronizarUnidadesDiretas', () => ({
  sincronizarUnidadesDiretas: sincronizarUnidadesDiretasMock,
}))

vi.mock('@/services/edicaoPrograma/listarEdicoesPrograma', () => ({
  listarEdicoesPrograma: listarEdicoesProgramaMock,
}))

vi.mock('@/hooks/useGetOpcoesFiltroDefinicaoPolos', () => ({
  useGetOpcoesFiltroDefinicaoPolos: () => ({
    data: {
      dres: ['DIRETORIA REGIONAL DE EDUCACAO PENHA'],
      tiposUe: ['CEI DIRET', 'EMEF'],
      gestoes: ['Direta', 'Parceira'],
      nomesEdicao: ['-'],
      tiposPolo: ['Pendente', 'Polo oficial', 'Polo reserva'],
    },
    isPending: false,
    isError: false,
    error: null,
  }),
}))

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()

  return {
    ...actual,
    useNavigate: () => navegarMock,
  }
})

function renderPagina() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <PaginaDefinicoesPolo />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('PaginaDefinicoesPolo', () => {
  beforeEach(() => {
    navegarMock.mockReset()
    atualizarDefinicoesPoloEmLoteMock.mockReset()
    listarEdicoesProgramaMock.mockReset()
    sincronizarUnidadesDiretasMock.mockReset()

    sincronizarUnidadesDiretasMock.mockResolvedValue({
      totalConsultados: 0,
      totalNovos: 0,
      totalJaExistentes: 0,
      executada: false,
      motivoIgnorada: 'ja_executada_hoje',
      ultimaExecucaoEm: '2026-07-13T12:00:00+00:00',
    })
    atualizarDefinicoesPoloEmLoteMock.mockResolvedValue({
      totalAtualizados: 1,
    })
    listarEdicoesProgramaMock.mockResolvedValue([
      {
        uuid: 'ed-1',
        nome: 'Janeiro 2025',
        data_inicio: '2025-01-01',
        data_fim: '2025-01-31',
        inscricoes_inicio: '2024-12-01',
        inscricoes_fim: '2024-12-20',
        quantidade_inscritos: 0,
        quantidade_atendimento_efetivo: 0,
        quantidade_passeios: 0,
        quantidade_apresentacoes: 0,
      },
    ])
  })

  it('renderiza chrome da página e listagem mockada', () => {
    renderPagina()

    expect(screen.getByLabelText(/menu lateral/i)).toBeInTheDocument()
    expect(screen.getByText(/header principal/i)).toBeInTheDocument()
    expect(
      screen.getByRole('navigation', { name: /mapa do site/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /definição de polos/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/listagem de definição de polos/i),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /voltar ao início/i }),
    ).toBeInTheDocument()
  })

  it('aplica filtro de gestão Parceira ao filtrar', async () => {
    const usuario = userEvent.setup()

    renderPagina()

    await usuario.selectOptions(screen.getByLabelText(/^gestão$/i), 'Parceira')
    await usuario.click(screen.getByRole('button', { name: /^filtrar$/i }))

    expect(screen.getByTestId('filtros-aplicados-gestao')).toHaveTextContent(
      'Parceira',
    )
  })

  it('limpa filtros ao clicar em limpar filtros', async () => {
    const usuario = userEvent.setup()

    renderPagina()

    await usuario.selectOptions(screen.getByLabelText(/^gestão$/i), 'Parceira')
    await usuario.click(screen.getByRole('button', { name: /limpar filtros/i }))

    expect(screen.getByLabelText(/^gestão$/i)).toHaveValue('')
    expect(screen.getByTestId('filtros-aplicados-gestao')).toHaveTextContent('')
  })

  it('abre modal de alterar edição e confirma com sucesso', async () => {
    const usuario = userEvent.setup()

    renderPagina()

    await usuario.click(
      screen.getByRole('button', { name: /simular alterar edição/i }),
    )

    expect(
      await screen.findByRole('dialog', { name: /alterar edição do polo/i }),
    ).toBeInTheDocument()

    await usuario.selectOptions(
      screen.getByLabelText(/selecione o nome da edição/i),
      'Janeiro 2025',
    )
    await usuario.click(screen.getByRole('button', { name: /^alterar$/i }))

    await waitFor(() => {
      expect(atualizarDefinicoesPoloEmLoteMock.mock.calls[0]?.[0]).toEqual({
        ids: ['polo-1'],
        nomeEdicao: 'Janeiro 2025',
      })
    })

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('exibe erro da API ao falhar alterar edição', async () => {
    const usuario = userEvent.setup()
    atualizarDefinicoesPoloEmLoteMock.mockRejectedValue({
      response: { data: { detalhe: 'Edição inválida para o polo.' } },
    })

    renderPagina()

    await usuario.click(
      screen.getByRole('button', { name: /simular alterar edição/i }),
    )
    await usuario.selectOptions(
      screen.getByLabelText(/selecione o nome da edição/i),
      'Janeiro 2025',
    )
    await usuario.click(screen.getByRole('button', { name: /^alterar$/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /edição inválida para o polo/i,
    )
  })

  it('abre modal de alterar tipo e confirma com sucesso', async () => {
    const usuario = userEvent.setup()

    renderPagina()

    await usuario.click(
      screen.getByRole('button', { name: /simular alterar tipo/i }),
    )

    expect(
      await screen.findByRole('dialog', { name: /alterar tipo de polo/i }),
    ).toBeInTheDocument()

    await usuario.selectOptions(
      screen.getByLabelText(/selecione o tipo de polo/i),
      'Polo oficial',
    )
    await usuario.click(screen.getByRole('button', { name: /^alterar$/i }))

    await waitFor(() => {
      expect(atualizarDefinicoesPoloEmLoteMock.mock.calls[0]?.[0]).toEqual({
        ids: ['polo-1'],
        tipo: 'Polo oficial',
      })
    })
  })

  it('navega para o início ao clicar em voltar', async () => {
    const usuario = userEvent.setup()

    renderPagina()

    await usuario.click(
      screen.getByRole('button', { name: /voltar ao início/i }),
    )

    expect(navegarMock).toHaveBeenCalledWith('/inicio')
  })
})
