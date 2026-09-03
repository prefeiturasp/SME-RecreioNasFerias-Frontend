import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DefinicaoPolosConteudo } from './index'

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
  sincronizarUnidadesDiretasMock,
} = vi.hoisted(() => ({
  atualizarDefinicoesPoloEmLoteMock: vi.fn(),
  listarEdicoesProgramaMock: vi.fn(),
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

vi.mock('@/services/definicaoPolo/listarOpcoesFiltroDefinicaoPolos', () => ({
  listarOpcoesFiltroDefinicaoPolos: vi.fn().mockResolvedValue({
    dres: ['DIRETORIA REGIONAL DE EDUCACAO PENHA'],
    tiposUe: ['CEI DIRET', 'EMEF'],
    gestoes: ['Direta', 'Parceira'],
    nomesEdicao: ['-'],
    tiposPolo: ['Pendente', 'Polo oficial', 'Polo reserva'],
  }),
}))

function renderConteudo() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <DefinicaoPolosConteudo />
    </QueryClientProvider>,
  )
}

describe('DefinicaoPolosConteudo', () => {
  beforeEach(() => {
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

  it('renderiza filtros e listagem', () => {
    renderConteudo()

    expect(
      screen.getByRole('button', { name: /filtrar polos/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/listagem de definição de polos/i),
    ).toBeInTheDocument()
  })

  it('aplica filtro de gestão Parceira ao filtrar', async () => {
    const usuario = userEvent.setup()

    renderConteudo()

    await screen.findByLabelText(/^gestão$/i)
    await usuario.selectOptions(screen.getByLabelText(/^gestão$/i), 'Parceira')
    await usuario.click(screen.getByRole('button', { name: /^filtrar$/i }))

    expect(screen.getByTestId('filtros-aplicados-gestao')).toHaveTextContent(
      'Parceira',
    )
  })

  it('limpa filtros ao clicar em limpar filtros', async () => {
    const usuario = userEvent.setup()

    renderConteudo()

    await screen.findByLabelText(/^gestão$/i)
    await usuario.selectOptions(screen.getByLabelText(/^gestão$/i), 'Parceira')
    await usuario.click(screen.getByRole('button', { name: /limpar filtros/i }))

    expect(screen.getByLabelText(/^gestão$/i)).toHaveValue('')
    expect(screen.getByTestId('filtros-aplicados-gestao')).toHaveTextContent('')
  })

  it('abre modal de alterar edição e confirma com sucesso', async () => {
    const usuario = userEvent.setup()

    renderConteudo()

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

    renderConteudo()

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

    renderConteudo()

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
})
