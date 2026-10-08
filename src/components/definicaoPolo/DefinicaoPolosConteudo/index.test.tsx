import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import { act, type ComponentProps } from 'react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { queryClient } from '@/lib/queryClient'
import type {
  DefinicaoPolo,
  ResultadoAlterarTipoEmMassa,
} from '@/services/definicaoPolo/types'
import { useDefinicaoPoloStore } from '@/stores/filtroDefinicaoPolosStore'
import { DefinicaoPolosConteudo } from './index'

const { modalCallbacks } = vi.hoisted(() => ({
  modalCallbacks: {
    edicao: {
      onFechar: null as (() => void) | null,
      onAlterar: null as ((valor: string) => void) | null,
      estaSalvando: false,
    },
    tipo: {
      onFechar: null as (() => void) | null,
      onAlterar: null as ((valor: string) => void) | null,
      estaSalvando: false,
    },
  },
}))

vi.mock('@/components/definicaoPolo/ModalAlterarSelecao', async (importOriginal) => {
  const actual =
    await importOriginal<
      typeof import('@/components/definicaoPolo/ModalAlterarSelecao')
    >()

  return {
    ...actual,
    ModalAlterarSelecao: (
      props: ComponentProps<typeof actual.ModalAlterarSelecao>,
    ) => {
      const callbacks =
        props.titulo === 'Alterar Edição do Polo'
          ? modalCallbacks.edicao
          : modalCallbacks.tipo
      callbacks.onFechar = props.onFechar
      callbacks.onAlterar = props.onAlterar
      callbacks.estaSalvando = props.estaSalvando ?? false

      return <actual.ModalAlterarSelecao {...props} />
    },
  }
})

vi.mock('@/components/definicaoPolo/DefinicaoPolosListagem', () => ({
  DefinicaoPolosListagem: ({
    onVisualizarPolo,
    onAlterarEdicaoPolo,
    onAlterarTipoPolo,
  }: {
    filtros?: { gestao?: string }
    onVisualizarPolo: (definicaoUuid: string | null, poloUuid: string) => void
    onAlterarEdicaoPolo: (idsPolos: string[]) => void
    onAlterarTipoPolo: (
      polos: { polo_uuid: string; edicao_uuid: string | null }[],
    ) => void
  }) => (
    <div>
      <div>Listagem de definição de polos</div>
      <span data-testid="filtros-aplicados-gestao">
        {useDefinicaoPoloStore((estado) => estado.filtrosAplicados.gestao)}
      </span>
      <button type="button" onClick={() => onVisualizarPolo('def-1', 'polo-1')}>
        Simular visualizar
      </button>
      <button type="button" onClick={() => onVisualizarPolo(null, 'polo-2')}>
        Simular visualizar polo sem definição
      </button>
      <button type="button" onClick={() => onAlterarEdicaoPolo(['polo-1'])}>
        Simular alterar edição
      </button>
      <button type="button" onClick={() => onAlterarEdicaoPolo([])}>
        Simular alterar edição sem polos
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
          onAlterarTipoPolo([
            { polo_uuid: 'polo-1', edicao_uuid: 'ed-1' },
            { polo_uuid: 'polo-2', edicao_uuid: null },
          ])
        }
      >
        Simular alterar tipo com seleção mista
      </button>
    </div>
  ),
}))

const {
  vincularEmMassaMock,
  alterarTipoEmMassaMock,
  listarEdicoesProgramaMock,
  listarDefinicoesPoloMock,
  listarDresMock,
  listarTiposEscolaMock,
} = vi.hoisted(() => ({
  vincularEmMassaMock: vi.fn(),
  alterarTipoEmMassaMock: vi.fn(),
  listarEdicoesProgramaMock: vi.fn(),
  listarDefinicoesPoloMock: vi.fn(),
  listarDresMock: vi.fn(),
  listarTiposEscolaMock: vi.fn(),
}))

vi.mock('@/services/definicaoPolo/vincularEmMassa', () => ({
  vincularEmMassa: vincularEmMassaMock,
}))

vi.mock('@/services/definicaoPolo/alterarTipoEmMassa', () => ({
  alterarTipoEmMassa: alterarTipoEmMassaMock,
}))

vi.mock(
  '@/services/definicaoPolo/listarDefinicoesPolo',
  async (importOriginal) => {
    const actual =
      await importOriginal<
        typeof import('@/services/definicaoPolo/listarDefinicoesPolo')
      >()

    return {
      ...actual,
      listarDefinicoesPolo: listarDefinicoesPoloMock,
    }
  },
)

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

const invalidarQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries')

const { navegarMock } = vi.hoisted(() => ({
  navegarMock: vi.fn(),
}))

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()

  return {
    ...actual,
    useNavigate: () => navegarMock,
  }
})

function renderConteudo() {
  const queryClientLocal = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return render(
    <QueryClientProvider client={queryClientLocal}>
      <MemoryRouter>
        <DefinicaoPolosConteudo />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

async function esperarConteudoPronto() {
  expect(
    await screen.findByText(/listagem de definição de polos/i),
  ).toBeInTheDocument()
}

describe('DefinicaoPolosConteudo', () => {
  beforeEach(() => {
    useDefinicaoPoloStore.getState().limparFiltros()
    navegarMock.mockReset()
    vincularEmMassaMock.mockReset()
    alterarTipoEmMassaMock.mockReset()
    modalCallbacks.edicao.onFechar = null
    modalCallbacks.edicao.onAlterar = null
    modalCallbacks.edicao.estaSalvando = false
    modalCallbacks.tipo.onFechar = null
    modalCallbacks.tipo.onAlterar = null
    modalCallbacks.tipo.estaSalvando = false
    listarEdicoesProgramaMock.mockReset()
    listarDefinicoesPoloMock.mockReset()
    listarDresMock.mockReset()
    listarTiposEscolaMock.mockReset()
    invalidarQueriesSpy.mockClear()

    listarDefinicoesPoloMock.mockResolvedValue({
      count: 0,
      next: null,
      previous: null,
      results: [],
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

  it('renderiza filtros e listagem', async () => {
    renderConteudo()

    await esperarConteudoPronto()
    expect(screen.getByText('Filtrar Polos')).toBeInTheDocument()
    expect(
      screen
        .getByText(/listagem de definição de polos/i)
        .closest('div.flex.flex-col'),
    ).toHaveClass('gap-4', 'bg-white', 'p-4')
  })

  it('navega para o detalhamento ao visualizar definição', async () => {
    const usuario = userEvent.setup()

    renderConteudo()
    await esperarConteudoPronto()

    await usuario.click(
      screen.getByRole('button', { name: /^simular visualizar$/i }),
    )

    expect(navegarMock).toHaveBeenCalledWith('/definicoes-polo/def-1')
  })

  it('navega para o detalhamento do polo sem definição', async () => {
    const usuario = userEvent.setup()

    renderConteudo()
    await esperarConteudoPronto()

    await usuario.click(
      screen.getByRole('button', {
        name: /simular visualizar polo sem definição/i,
      }),
    )

    expect(navegarMock).toHaveBeenCalledWith('/definicoes-polo/polo/polo-2')
  })

  it('aplica filtro de gestão Parceira ao filtrar', async () => {
    const usuario = userEvent.setup()

    renderConteudo()
    await esperarConteudoPronto()

    await usuario.click(await screen.findByLabelText(/^gestão$/i))
    await usuario.click(
      await screen.findByRole('option', { name: /^parceira$/i }),
    )
    await usuario.click(screen.getByRole('button', { name: /^filtrar$/i }))

    expect(screen.getByTestId('filtros-aplicados-gestao')).toHaveTextContent(
      'parceira',
    )
  })

  it('limpa filtros ao clicar em limpar filtros', async () => {
    const usuario = userEvent.setup()

    renderConteudo()
    await esperarConteudoPronto()

    await usuario.click(await screen.findByLabelText(/^gestão$/i))
    await usuario.click(
      await screen.findByRole('option', { name: /^parceira$/i }),
    )
    await usuario.click(screen.getByRole('button', { name: /limpar filtros/i }))

    expect(screen.getByLabelText(/^gestão$/i)).toHaveTextContent(
      /selecione a gestão/i,
    )
    expect(screen.getByTestId('filtros-aplicados-gestao')).toHaveTextContent('')
  })

  it('abre modal de alterar edição e confirma com sucesso', async () => {
    const usuario = userEvent.setup()

    renderConteudo()
    await esperarConteudoPronto()

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
    expect(invalidarQueriesSpy).toHaveBeenCalledWith({
      queryKey: ['definicoesPolo'],
    })
  })

  it('fecha modal de edição sem confirmar', async () => {
    const usuario = userEvent.setup()

    renderConteudo()
    await esperarConteudoPronto()

    await usuario.click(
      screen.getByRole('button', { name: /^simular alterar edição$/i }),
    )
    expect(
      await screen.findByRole('dialog', { name: /alterar edição do polo/i }),
    ).toBeInTheDocument()

    await usuario.click(screen.getByRole('button', { name: /^fechar$/i }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('ignora confirmação de edição vazia ou sem polos', async () => {
    const usuario = userEvent.setup()

    renderConteudo()
    await esperarConteudoPronto()
    await usuario.click(
      screen.getByRole('button', {
        name: /simular alterar edição sem polos/i,
      }),
    )

    await act(async () => {
      modalCallbacks.edicao.onAlterar?.(' ')
      modalCallbacks.edicao.onAlterar?.('ed-1')
    })

    expect(vincularEmMassaMock).not.toHaveBeenCalled()
  })

  it('exibe erro da API ao falhar alterar edição', async () => {
    const usuario = userEvent.setup()
    vincularEmMassaMock.mockRejectedValue({
      response: { data: { detalhe: 'Edição inválida para o polo.' } },
    })

    renderConteudo()
    await esperarConteudoPronto()

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
    await esperarConteudoPronto()

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
      await screen.findByText(/tipos de polo alterados com sucesso/i),
    ).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveClass(
      'border-verde-medio',
      'bg-verde-claro',
      'text-verde-escuro',
    )
    expect(invalidarQueriesSpy).toHaveBeenCalledWith({
      queryKey: ['definicoesPolo'],
    })
  })

  it('fecha modal de tipo sem confirmar', async () => {
    const usuario = userEvent.setup()

    renderConteudo()
    await esperarConteudoPronto()

    await usuario.click(
      screen.getByRole('button', { name: /^simular alterar tipo$/i }),
    )
    expect(
      await screen.findByRole('dialog', { name: /^alterar tipo de polo$/i }),
    ).toBeInTheDocument()

    await usuario.click(screen.getByRole('button', { name: /^fechar$/i }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('ignora confirmação de tipo vazia e seleção vazia', async () => {
    renderConteudo()
    await esperarConteudoPronto()

    await act(async () => {
      modalCallbacks.tipo.onAlterar?.(' ')
      modalCallbacks.tipo.onAlterar?.('oficial')
    })

    expect(alterarTipoEmMassaMock).not.toHaveBeenCalled()
  })

  it('ignora o fechamento dos modais enquanto as alterações estão pendentes', async () => {
    let concluirVinculo!: (resultado: DefinicaoPolo[]) => void
    let concluirAlteracaoTipo!: (
      resultado: ResultadoAlterarTipoEmMassa,
    ) => void
    vincularEmMassaMock.mockReturnValue(
      new Promise((resolve) => {
        concluirVinculo = resolve
      }),
    )
    alterarTipoEmMassaMock.mockReturnValue(
      new Promise((resolve) => {
        concluirAlteracaoTipo = resolve
      }),
    )
    const usuario = userEvent.setup()

    renderConteudo()
    await esperarConteudoPronto()

    await usuario.click(
      screen.getByRole('button', { name: /^simular alterar edição$/i }),
    )
    await usuario.selectOptions(
      screen.getByLabelText(/selecione o nome da edição/i),
      'Janeiro 2025',
    )
    await usuario.click(screen.getByRole('button', { name: /^alterar$/i }))

    await waitFor(() => expect(modalCallbacks.edicao.estaSalvando).toBe(true))
    await act(async () => modalCallbacks.edicao.onFechar?.())
    expect(
      screen.getByRole('dialog', { name: /alterar edição do polo/i }),
    ).toBeInTheDocument()

    await act(async () => concluirVinculo([]))

    await usuario.click(
      screen.getByRole('button', { name: /^simular alterar tipo$/i }),
    )
    await usuario.selectOptions(
      screen.getByLabelText(/selecione o tipo de polo/i),
      'Polo oficial',
    )
    await usuario.click(screen.getByRole('button', { name: /^alterar$/i }))

    await waitFor(() => expect(modalCallbacks.tipo.estaSalvando).toBe(true))
    await act(async () => modalCallbacks.tipo.onFechar?.())
    expect(
      screen.getByRole('dialog', { name: /^alterar tipo de polo$/i }),
    ).toBeInTheDocument()

    await act(async () =>
      concluirAlteracaoTipo({
        mensagem: 'Alterado',
        alterados: [],
        ignorados: [],
      }),
    )
  })

  it('envia polos sem edição e exibe a mensagem retornada pela API', async () => {
    const usuario = userEvent.setup()
    alterarTipoEmMassaMock.mockResolvedValue({
      mensagem:
        'Houve polos que não tiveram o tipo alterado, pois não existe vínculo com edição.',
      alterados: [
        {
          polo_uuid: 'polo-1',
          edicao_uuid: 'ed-1',
          tipo: 'oficial',
        },
      ],
      ignorados: [
        {
          polo_uuid: 'polo-2',
          motivo: 'Polo sem vínculo com edição.',
        },
      ],
    })

    renderConteudo()
    await esperarConteudoPronto()

    await usuario.click(
      screen.getByRole('button', {
        name: /simular alterar tipo com seleção mista/i,
      }),
    )

    expect(
      await screen.findByRole('dialog', {
        name: /^alterar tipo de polo$/i,
      }),
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
        {
          polo_uuid: 'polo-2',
          edicao: null,
          tipo: 'oficial',
        },
      ])
    })

    expect(
      await screen.findByText(
        /houve polos que não tiveram o tipo alterado, pois não existe vínculo com edição/i,
      ),
    ).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveClass(
      'border-yellow-400',
      'bg-yellow-50',
      'text-yellow-800',
    )
  })

  it('fecha a mensagem de resultado ao clicar no botão de fechar', async () => {
    const usuario = userEvent.setup()

    renderConteudo()
    await esperarConteudoPronto()

    await usuario.click(
      screen.getByRole('button', { name: /^simular alterar tipo$/i }),
    )
    await usuario.selectOptions(
      screen.getByLabelText(/selecione o tipo de polo/i),
      'Polo oficial',
    )
    await usuario.click(screen.getByRole('button', { name: /^alterar$/i }))

    expect(await screen.findByRole('status')).toBeInTheDocument()
    await usuario.click(
      screen.getByRole('button', { name: /fechar mensagem de resultado/i }),
    )
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('remove automaticamente a mensagem de sucesso após três segundos', async () => {
    const usuario = userEvent.setup()

    renderConteudo()
    await esperarConteudoPronto()

    await usuario.click(
      screen.getByRole('button', { name: /^simular alterar edição$/i }),
    )
    await usuario.selectOptions(
      screen.getByLabelText(/selecione o nome da edição/i),
      'Janeiro 2025',
    )
    await usuario.click(screen.getByRole('button', { name: /^alterar$/i }))

    expect(await screen.findByRole('status')).toBeInTheDocument()
    await new Promise((resolve) => setTimeout(resolve, 3100))
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})
