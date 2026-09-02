import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { FILTROS_LISTAGEM_DEFINICAO_POLOS_INICIAIS } from '@/services/definicaoPolo/types'
import { FiltrosDefinicaoPolosForm } from './index'

const { listarOpcoesFiltroDefinicaoPolosMock } = vi.hoisted(() => ({
  listarOpcoesFiltroDefinicaoPolosMock: vi.fn(),
}))

vi.mock('@/services/definicaoPolo/listarOpcoesFiltroDefinicaoPolos', () => ({
  listarOpcoesFiltroDefinicaoPolos: listarOpcoesFiltroDefinicaoPolosMock,
}))

const opcoesPadrao = {
  dres: ['DIRETORIA REGIONAL DE EDUCACAO BUTANTA'],
  tiposUe: ['CEI DIRET', 'EMEF'],
  gestoes: ['Parceira', 'Direta'],
  nomesEdicao: ['Janeiro 2025', '-'],
  tiposPolo: ['Pendente', 'Polo oficial'],
}

function renderFiltrosDefinicaoPolosForm(
  props: Partial<{
    onFiltrar: (filtros: typeof FILTROS_LISTAGEM_DEFINICAO_POLOS_INICIAIS) => void
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
    listarOpcoesFiltroDefinicaoPolosMock.mockResolvedValue(opcoesPadrao)
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

  it('exibe mensagem de carregamento enquanto busca opções', () => {
    listarOpcoesFiltroDefinicaoPolosMock.mockImplementation(
      () =>
        new Promise(() => {
          /* pendente */
        }),
    )

    renderFiltrosDefinicaoPolosForm()

    expect(
      screen.getByText(/carregando opções dos filtros/i),
    ).toBeInTheDocument()
    expect(screen.queryByLabelText(/gestão/i)).not.toBeInTheDocument()
  })

  it('chama onFiltrar com gestão Parceira ao submeter', async () => {
    const usuario = userEvent.setup()
    const onFiltrar = vi.fn()

    renderFiltrosDefinicaoPolosForm({ onFiltrar })

    await screen.findByLabelText(/^gestão$/i)
    await usuario.selectOptions(screen.getByLabelText(/^gestão$/i), 'Parceira')
    await usuario.click(screen.getByRole('button', { name: /^filtrar$/i }))

    expect(onFiltrar).toHaveBeenCalledWith({
      ...FILTROS_LISTAGEM_DEFINICAO_POLOS_INICIAIS,
      gestao: 'Parceira',
    })
  })

  it('chama onFiltrar com todos os campos preenchidos', async () => {
    const usuario = userEvent.setup()
    const onFiltrar = vi.fn()

    renderFiltrosDefinicaoPolosForm({ onFiltrar })

    await screen.findByLabelText(/filtrar por dre/i)

    await usuario.selectOptions(
      screen.getByLabelText(/filtrar por dre/i),
      'DIRETORIA REGIONAL DE EDUCACAO BUTANTA',
    )
    await usuario.selectOptions(
      screen.getByLabelText(/filtrar por tipo de ue/i),
      'EMEF',
    )
    await usuario.type(
      screen.getByLabelText(/filtrar por nome da ue ou código eol/i),
      '019241',
    )
    await usuario.selectOptions(
      screen.getByLabelText(/filtrar por nome da edição/i),
      'Janeiro 2025',
    )
    await usuario.selectOptions(
      screen.getByLabelText(/^tipo de polo$/i),
      'Pendente',
    )
    await usuario.selectOptions(screen.getByLabelText(/^gestão$/i), 'Parceira')
    await usuario.click(screen.getByRole('button', { name: /^filtrar$/i }))

    expect(onFiltrar).toHaveBeenCalledWith({
      dre: 'DIRETORIA REGIONAL DE EDUCACAO BUTANTA',
      tipoUe: 'EMEF',
      nomeUeOuCodigoEol: '019241',
      nomeEdicao: 'Janeiro 2025',
      tipoPolo: 'Pendente',
      gestao: 'Parceira',
    })
  })

  it('chama onFiltrar e onLimpar pelos botões', async () => {
    const usuario = userEvent.setup()
    const onFiltrar = vi.fn()
    const onLimpar = vi.fn()

    renderFiltrosDefinicaoPolosForm({ onFiltrar, onLimpar })

    await screen.findByLabelText(/^gestão$/i)
    await usuario.selectOptions(screen.getByLabelText(/^gestão$/i), 'Parceira')
    await usuario.click(screen.getByRole('button', { name: /^filtrar$/i }))
    await usuario.click(screen.getByRole('button', { name: /limpar filtros/i }))

    expect(onFiltrar).toHaveBeenCalledTimes(1)
    expect(onLimpar).toHaveBeenCalledTimes(1)
    expect(screen.getByLabelText(/^gestão$/i)).toHaveValue('')
  })

  it('exibe opções de DRE, Tipo de UE, Gestão, Nome da Edição e Tipo de Polo', async () => {
    renderFiltrosDefinicaoPolosForm()

    expect(
      await screen.findByRole('option', {
        name: /diretoria regional de educacao butanta/i,
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('option', { name: /cei diret/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('option', { name: /^parceira$/i }),
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
})
