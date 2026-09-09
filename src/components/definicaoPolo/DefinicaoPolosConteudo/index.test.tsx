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
    onAlterarTipoPolo: (
      polos: { polo_uuid: string; edicao_uuid: string | null }[],
    ) => void
  }) => (
    <div>
      <div>Listagem de definição de polos</div>
      <span data-testid="filtros-aplicados-gestao">
        {filtros?.gestao ?? ''}
      </span>
      <button type="button" onClick={() => onAlterarEdicaoPolo(['polo-1'])}>
        Simular alterar edição
      </button>
      <button
        type="button"
        onClick={() =>
          onAlterarTipoPolo([{ polo_uuid: 'polo-1', edicao_uuid: 'ed-1' }])
        }
      >
        Simular alterar tipo
      </button>
      <button
        type="button"
        onClick={() =>
          onAlterarTipoPolo([{ polo_uuid: 'polo-1', edicao_uuid: null }])
        }
      >
        Simular alterar tipo sem edição
      </button>
    </div>
  ),
}))

const {
  vincularEmMassaMock,
  alterarTipoEmMassaMock,
  listarEdicoesProgramaMock,
  popularPolosMock,
  listarDresMock,
  listarTiposEscolaMock,
} = vi.hoisted(() => ({
  vincularEmMassaMock: vi.fn(),
  alterarTipoEmMassaMock: vi.fn(),
  listarEdicoesProgramaMock: vi.fn(),
  popularPolosMock: vi.fn(),
  listarDresMock: vi.fn(),
  listarTiposEscolaMock: vi.fn(),
}))

vi.mock('@/services/definicaoPolo/vincularEmMassa', () => ({
  vincularEmMassa: vincularEmMassaMock,
}))

vi.mock('@/services/definicaoPolo/alterarTipoEmMassa', () => ({
  alterarTipoEmMassa: alterarTipoEmMassaMock,
}))

vi.mock('@/services/definicaoPolo/popularPolos', () => ({
  popularPolos: popularPolosMock,
}))

vi.mock('@/services/edicaoPrograma/listarEdicoesPrograma', () => ({
  listarEdicoesPrograma: listarEdicoesProgramaMock,
}))

vi.mock('@/services/dre/listarDres', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('@/services/dre/listarDres')>()

  return {
    ...actual,
    listarDres: listarDresMock,
  }
})

vi.mock('@/services/tipoEscola/listarTiposEscola', async (importOriginal) => {
  const actual =
    await importOriginal<
      typeof import('@/services/tipoEscola/listarTiposEscola')
    >()

  return {
    ...actual,
    listarTiposEscola: listarTiposEscolaMock,
  }
})

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
    vincularEmMassaMock.mockReset()
    alterarTipoEmMassaMock.mockReset()
    listarEdicoesProgramaMock.mockReset()
    popularPolosMock.mockReset()
    listarDresMock.mockReset()
    listarTiposEscolaMock.mockReset()

    popularPolosMock.mockResolvedValue({
      total_consultados: 0,
      total_novos: 0,
      total_ja_existentes: 0,
      unidades_novas: [],
      executada: false,
      motivo_ignorada: 'ja_executada_hoje',
      ultima_execucao_em: '2026-07-13T12:00:00+00:00',
    })
    vincularEmMassaMock.mockResolvedValue([])
    alterarTipoEmMassaMock.mockResolvedValue({
      mensagem: 'Tipos de polo alterados com sucesso.',
      alterados: [],
      ignorados: [],
    })
    listarDresMock.mockResolvedValue([
      {
        codigo_dre: '108100',
        nome_dre: 'DIRETORIA REGIONAL DE EDUCACAO BUTANTA',
        sigla_dre: 'BT',
      },
    ])
    listarTiposEscolaMock.mockResolvedValue([
      { codigo: 1, descricao_sigla: 'CEI DIRET' },
      { codigo: 2, descricao_sigla: 'EMEF' },
    ])
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

    expect(screen.getByText('Filtrar Polos')).toBeInTheDocument()
    expect(
      screen.getByText(/listagem de definição de polos/i),
    ).toBeInTheDocument()
  })

  it('aplica filtro de gestão Parceira ao filtrar', async () => {
    const usuario = userEvent.setup()

    renderConteudo()

    await usuario.click(await screen.findByLabelText(/^gestão$/i))
    await usuario.click(await screen.findByRole('option', { name: /^parceira$/i }))
    await usuario.click(screen.getByRole('button', { name: /^filtrar$/i }))

    expect(screen.getByTestId('filtros-aplicados-gestao')).toHaveTextContent(
      'parceira',
    )
  })

  it('limpa filtros ao clicar em limpar filtros', async () => {
    const usuario = userEvent.setup()

    renderConteudo()

    await usuario.click(await screen.findByLabelText(/^gestão$/i))
    await usuario.click(await screen.findByRole('option', { name: /^parceira$/i }))
    await usuario.click(screen.getByRole('button', { name: /limpar filtros/i }))

    expect(screen.getByLabelText(/^gestão$/i)).toHaveTextContent(
      /selecione a gestão/i,
    )
    expect(screen.getByTestId('filtros-aplicados-gestao')).toHaveTextContent('')
  })

  it('abre modal de alterar edição e confirma com sucesso', async () => {
    const usuario = userEvent.setup()

    renderConteudo()

    await usuario.click(
      screen.getByRole('button', { name: /^simular alterar edição$/i }),
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
      expect(vincularEmMassaMock.mock.calls[0]?.[0]).toEqual({
        polos: ['polo-1'],
        edicao: 'ed-1',
      })
    })

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
    expect(
      await screen.findByText(/polo alterado com sucesso/i),
    ).toBeInTheDocument()
  })

  it('exibe erro da API ao falhar alterar edição', async () => {
    const usuario = userEvent.setup()
    vincularEmMassaMock.mockRejectedValue({
      response: { data: { detalhe: 'Edição inválida para o polo.' } },
    })

    renderConteudo()

    await usuario.click(
      screen.getByRole('button', { name: /^simular alterar edição$/i }),
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
      screen.getByRole('button', { name: /^simular alterar tipo$/i }),
    )

    expect(
      await screen.findByRole('dialog', { name: /^alterar tipo de polo$/i }),
    ).toBeInTheDocument()

    await usuario.selectOptions(
      screen.getByLabelText(/selecione o tipo de polo/i),
      'Polo oficial',
    )
    await usuario.click(screen.getByRole('button', { name: /^alterar$/i }))

    await waitFor(() => {
      expect(alterarTipoEmMassaMock.mock.calls[0]?.[0]).toEqual([
        {
          polo_uuid: 'polo-1',
          edicao: 'ed-1',
          tipo: 'oficial',
        },
      ])
    })

    expect(
      await screen.findByText(/polo alterado com sucesso/i),
    ).toBeInTheDocument()
  })

  it('bloqueia alterar tipo quando o polo não tem edição', async () => {
    const usuario = userEvent.setup()

    renderConteudo()

    await usuario.click(
      screen.getByRole('button', { name: /simular alterar tipo sem edição/i }),
    )

    expect(
      await screen.findByRole('dialog', {
        name: /não é possível alterar o tipo de polo/i,
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        /é necessário alterar a edição primeiro para, depois, vincular ou alterar o tipo de polo/i,
      ),
    ).toBeInTheDocument()
    expect(
      screen.queryByLabelText(/selecione o tipo de polo/i),
    ).not.toBeInTheDocument()
    expect(alterarTipoEmMassaMock).not.toHaveBeenCalled()

    await usuario.click(screen.getByRole('button', { name: /^fechar$/i }))

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })
})
