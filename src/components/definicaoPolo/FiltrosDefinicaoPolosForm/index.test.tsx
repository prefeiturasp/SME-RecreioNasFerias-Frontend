import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { FILTROS_LISTAGEM_DEFINICAO_POLOS_INICIAIS } from '@/services/definicaoPolo/types'
import { FiltrosDefinicaoPolosForm } from './index'

const {
  listarDresMock,
  listarTiposEscolaMock,
  listarEdicoesProgramaMock,
} = vi.hoisted(() => ({
  listarDresMock: vi.fn(),
  listarTiposEscolaMock: vi.fn(),
  listarEdicoesProgramaMock: vi.fn(),
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

vi.mock('@/services/edicaoPrograma/listarEdicoesPrograma', () => ({
  listarEdicoesPrograma: listarEdicoesProgramaMock,
}))

const edicoesPadrao = [
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
]

const dresPadrao = [
  {
    codigo_dre: '108100',
    nome_dre: 'DIRETORIA REGIONAL DE EDUCACAO BUTANTA',
    sigla_dre: 'BT',
  },
]

const tiposEscolaPadrao = [
  { codigo: 1, descricao_sigla: 'CEI DIRET' },
  { codigo: 2, descricao_sigla: 'EMEF' },
]

function renderFiltrosDefinicaoPolosForm(
  props: Partial<{
    onFiltrar: (
      filtros: typeof FILTROS_LISTAGEM_DEFINICAO_POLOS_INICIAIS,
    ) => void
    onLimpar: () => void
  }> = {},
) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <FiltrosDefinicaoPolosForm
        onFiltrar={props.onFiltrar ?? vi.fn()}
        onLimpar={props.onLimpar ?? vi.fn()}
      />
    </QueryClientProvider>,
  )
}

describe('FiltrosDefinicaoPolosForm', () => {
  beforeEach(() => {
    listarDresMock.mockResolvedValue(dresPadrao)
    listarTiposEscolaMock.mockResolvedValue(tiposEscolaPadrao)
    listarEdicoesProgramaMock.mockResolvedValue(edicoesPadrao)
  })

  it('expande e recolhe os filtros via aria-expanded', async () => {
    const usuario = userEvent.setup()

    renderFiltrosDefinicaoPolosForm()

    const botaoCabecalho = screen.getByRole('button', {
      name: /filtrar polos/i,
    })

    expect(botaoCabecalho).toHaveAttribute('aria-expanded', 'true')
    expect(await screen.findByLabelText(/filtrar por dre/i)).toBeInTheDocument()

    await usuario.click(botaoCabecalho)

    expect(botaoCabecalho).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByLabelText(/filtrar por dre/i)).not.toBeInTheDocument()

    await usuario.click(botaoCabecalho)

    expect(botaoCabecalho).toHaveAttribute('aria-expanded', 'true')
    expect(await screen.findByLabelText(/filtrar por dre/i)).toBeInTheDocument()
  })

  it('chama onFiltrar com gestão Parceira ao submeter', async () => {
    const usuario = userEvent.setup()
    const onFiltrar = vi.fn()

    renderFiltrosDefinicaoPolosForm({ onFiltrar })

    await screen.findByLabelText(/^gestão$/i)
    await usuario.selectOptions(screen.getByLabelText(/^gestão$/i), 'parceira')
    await usuario.click(screen.getByRole('button', { name: /^filtrar$/i }))

    expect(onFiltrar).toHaveBeenCalledWith({
      ...FILTROS_LISTAGEM_DEFINICAO_POLOS_INICIAIS,
      gestao: 'parceira',
    })
  })

  it('chama onFiltrar com todos os campos preenchidos', async () => {
    const usuario = userEvent.setup()
    const onFiltrar = vi.fn()

    renderFiltrosDefinicaoPolosForm({ onFiltrar })

    await usuario.click(await screen.findByLabelText(/filtrar por dre/i))
    await usuario.click(
      await screen.findByRole('option', {
        name: /diretoria regional de educacao butanta/i,
      }),
    )
    await usuario.click(screen.getByLabelText(/filtrar por tipo de ue/i))
    await usuario.click(await screen.findByRole('option', { name: 'EMEF' }))
    await usuario.type(
      screen.getByLabelText(/filtrar por nome da ue ou código eol/i),
      '019241',
    )
    await usuario.selectOptions(
      await screen.findByLabelText(/filtrar por nome da edição/i),
      'Janeiro 2025',
    )
    await usuario.selectOptions(
      screen.getByLabelText(/^tipo de polo$/i),
      'pendente',
    )
    await usuario.selectOptions(screen.getByLabelText(/^gestão$/i), 'parceira')
    await usuario.click(screen.getByRole('button', { name: /^filtrar$/i }))

    expect(onFiltrar).toHaveBeenCalledWith({
      dre: 'DIRETORIA REGIONAL DE EDUCACAO BUTANTA',
      tipoUe: 'EMEF',
      nomeUeOuCodigoEol: '019241',
      nomeEdicao: 'Janeiro 2025',
      tipoPolo: 'pendente',
      gestao: 'parceira',
    })
  })

  it('chama onFiltrar e onLimpar pelos botões', async () => {
    const usuario = userEvent.setup()
    const onFiltrar = vi.fn()
    const onLimpar = vi.fn()

    renderFiltrosDefinicaoPolosForm({ onFiltrar, onLimpar })

    await screen.findByLabelText(/^gestão$/i)
    await usuario.selectOptions(screen.getByLabelText(/^gestão$/i), 'parceira')
    await usuario.click(screen.getByRole('button', { name: /^filtrar$/i }))
    await usuario.click(screen.getByRole('button', { name: /limpar filtros/i }))

    expect(onFiltrar).toHaveBeenCalledTimes(1)
    expect(onLimpar).toHaveBeenCalledTimes(1)
    expect(screen.getByLabelText(/^gestão$/i)).toHaveValue('')
  })

  it('exibe opções de DRE, Tipo de UE, Gestão, Nome da Edição e Tipo de Polo', async () => {
    const usuario = userEvent.setup()

    renderFiltrosDefinicaoPolosForm()

    await usuario.click(await screen.findByLabelText(/filtrar por dre/i))
    expect(
      await screen.findByRole('option', {
        name: /diretoria regional de educacao butanta/i,
      }),
    ).toBeInTheDocument()
    await usuario.click(
      screen.getByRole('option', {
        name: /diretoria regional de educacao butanta/i,
      }),
    )

    await usuario.click(screen.getByLabelText(/filtrar por tipo de ue/i))
    expect(
      await screen.findByRole('option', { name: /cei diret/i }),
    ).toBeInTheDocument()
    await usuario.click(screen.getByRole('option', { name: /cei diret/i }))

    expect(
      await screen.findByRole('option', { name: /^parceira$/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('option', { name: /^direta$/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('option', { name: /janeiro 2025/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('option', { name: /polo oficial/i }),
    ).toBeInTheDocument()
  })

  it('exibe a opção de carregamento das DREs', async () => {
    listarDresMock.mockImplementation(
      () =>
        new Promise(() => {
          /* pendente */
        }),
    )
    const usuario = userEvent.setup()

    renderFiltrosDefinicaoPolosForm()

    await usuario.click(screen.getByLabelText(/filtrar por dre/i))
    expect(
      await screen.findByRole('option', { name: 'Carregando...' }),
    ).toBeInTheDocument()
  })

  it('exibe a opção de erro das DREs', async () => {
    listarDresMock.mockRejectedValue(new Error('Falha nas DREs'))
    const usuario = userEvent.setup()

    renderFiltrosDefinicaoPolosForm()

    await usuario.click(await screen.findByLabelText(/filtrar por dre/i))
    expect(
      await screen.findByRole('option', { name: 'Erro ao carregar DREs' }),
    ).toBeInTheDocument()
  })
})
