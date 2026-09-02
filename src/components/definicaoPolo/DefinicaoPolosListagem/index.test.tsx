import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { DefinicaoPoloApi } from '@/services/definicaoPolo/types'
import { DefinicaoPolosListagem } from './index'

const { listarDefinicoesPoloMock } = vi.hoisted(() => ({
  listarDefinicoesPoloMock: vi.fn(),
}))

vi.mock('@/services/definicaoPolo/listarDefinicoesPolo', async (importOriginal) => {
  const actual =
    await importOriginal<
      typeof import('@/services/definicaoPolo/listarDefinicoesPolo')
    >()

  return {
    ...actual,
    listarDefinicoesPolo: listarDefinicoesPoloMock,
  }
})

const poloDiretaApi: DefinicaoPoloApi = {
  id: '1',
  dre: 'BUTANTA',
  tipoUe: 'CEI',
  nomePolo: 'CEI DIRET ALOYSIO',
  nomeEdicao: 'Janeiro 2025',
  gestao: 'Direta',
}

const poloParceiraApi: DefinicaoPoloApi = {
  id: '2',
  dre: 'PENHA',
  tipoUe: 'EMEF',
  nomePolo: 'EMEF AMORIM LIMA',
  tipo: 'Polo oficial',
  gestao: 'Parceira',
}

function renderDefinicaoPolosListagem(
  props: Partial<{
    onVisualizarPolo: (idPolo: string) => void
    onAlterarEdicaoPolo: (idsPolos: string[]) => void
    onAlterarTipoPolo: (idsPolos: string[]) => void
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
      <DefinicaoPolosListagem
        onVisualizarPolo={props.onVisualizarPolo ?? vi.fn()}
        onAlterarEdicaoPolo={props.onAlterarEdicaoPolo ?? vi.fn()}
        onAlterarTipoPolo={props.onAlterarTipoPolo ?? vi.fn()}
      />
    </QueryClientProvider>,
  )
}

describe('DefinicaoPolosListagem', () => {
  beforeEach(() => {
    listarDefinicoesPoloMock.mockResolvedValue([poloDiretaApi, poloParceiraApi])
  })

  it('exibe mensagem de listagem vazia', async () => {
    listarDefinicoesPoloMock.mockResolvedValue([])

    renderDefinicaoPolosListagem()

    expect(
      await screen.findByText(/resultados da pesquisa/i),
    ).toBeInTheDocument()
    expect(screen.getByText(/sem dados/i)).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  it('renderiza tabela com colunas incluindo Gestão', async () => {
    renderDefinicaoPolosListagem()

    expect(await screen.findByRole('table')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /ordenar por dre/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /ordenar por gestão/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/cei diret aloysio/i)).toBeInTheDocument()
    expect(screen.getByText(/^direta$/i)).toBeInTheDocument()
    expect(screen.getByText(/^parceira$/i)).toBeInTheDocument()
  })

  it('exibe barra de ações com contagem ao selecionar um polo', async () => {
    const usuario = userEvent.setup()

    renderDefinicaoPolosListagem()

    await screen.findByRole('table')

    await usuario.click(
      screen.getByRole('checkbox', {
        name: /selecionar polo cei diret aloysio/i,
      }),
    )

    expect(screen.getByText('1 UE selecionada')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /^alterar edição$/i }),
    ).toBeInTheDocument()
  })

  it('seleciona todos os polos da página', async () => {
    const usuario = userEvent.setup()

    renderDefinicaoPolosListagem()

    await screen.findByRole('table')

    await usuario.click(
      screen.getByRole('checkbox', {
        name: /selecionar todos os polos da página/i,
      }),
    )

    expect(screen.getByText('2 UEs selecionadas')).toBeInTheDocument()
  })

  it('desmarca todos os polos ao desmarcar o checkbox do cabeçalho', async () => {
    const usuario = userEvent.setup()

    renderDefinicaoPolosListagem()

    await screen.findByRole('table')

    const selecionarTodos = screen.getByRole('checkbox', {
      name: /selecionar todos os polos da página/i,
    })

    await usuario.click(selecionarTodos)
    expect(screen.getByText('2 UEs selecionadas')).toBeInTheDocument()

    await usuario.click(selecionarTodos)
    expect(screen.queryByText(/ue selecionada/i)).not.toBeInTheDocument()
  })

  it('chama alterar edição, alterar tipo e cancelar a partir da barra', async () => {
    const usuario = userEvent.setup()
    const onAlterarEdicaoPolo = vi.fn()
    const onAlterarTipoPolo = vi.fn()

    renderDefinicaoPolosListagem({
      onAlterarEdicaoPolo,
      onAlterarTipoPolo,
    })

    await screen.findByRole('table')

    await usuario.click(
      screen.getByRole('checkbox', {
        name: /selecionar polo cei diret aloysio/i,
      }),
    )

    await usuario.click(
      screen.getByRole('button', { name: /^alterar edição$/i }),
    )
    expect(onAlterarEdicaoPolo).toHaveBeenCalledWith(['1'])

    await usuario.click(
      screen.getByRole('button', { name: /^alterar tipo de polo$/i }),
    )
    expect(onAlterarTipoPolo).toHaveBeenCalledWith(['1'])

    await usuario.click(screen.getByRole('button', { name: /^cancelar$/i }))
    expect(screen.queryByText(/ue selecionada/i)).not.toBeInTheDocument()
  })

  it('chama visualizar e alterar edição pelos botões da linha', async () => {
    const usuario = userEvent.setup()
    const onVisualizarPolo = vi.fn()
    const onAlterarEdicaoPolo = vi.fn()

    renderDefinicaoPolosListagem({
      onVisualizarPolo,
      onAlterarEdicaoPolo,
    })

    await screen.findByRole('table')

    await usuario.click(
      screen.getByRole('button', {
        name: /visualizar polo cei diret aloysio/i,
      }),
    )
    expect(onVisualizarPolo).toHaveBeenCalledWith('1')

    await usuario.click(
      screen.getByRole('button', {
        name: /alterar edição do polo cei diret aloysio/i,
      }),
    )
    expect(onAlterarEdicaoPolo).toHaveBeenCalledWith(['1'])
  })

  it('ordena por Gestão em ordem descendente ao clicar duas vezes', async () => {
    const usuario = userEvent.setup()

    renderDefinicaoPolosListagem()

    await screen.findByRole('table')

    const botaoGestao = screen.getByRole('button', {
      name: /ordenar por gestão/i,
    })

    await usuario.click(botaoGestao)
    await usuario.click(botaoGestao)

    const linhas = screen.getAllByRole('row').slice(1)
    const primeiroGestao = within(linhas[0]).getByText(/parceira|direta/i)
    const segundoGestao = within(linhas[1]).getByText(/parceira|direta/i)

    expect(primeiroGestao).toHaveTextContent(/parceira/i)
    expect(segundoGestao).toHaveTextContent(/direta/i)
  })

  it('exibe valores padrão para tipo e nome da edição ausentes', async () => {
    listarDefinicoesPoloMock.mockResolvedValue([
      {
        id: '3',
        dre: 'BUTANTA',
        tipoUe: 'CEI',
        nomePolo: 'CEI SEM TIPO',
        gestao: 'Direta',
      },
    ])

    renderDefinicaoPolosListagem()

    expect(await screen.findByRole('table')).toBeInTheDocument()
    expect(screen.getByText('Pendente')).toBeInTheDocument()
    expect(screen.getByText('-')).toBeInTheDocument()
  })

  it('exibe detalhe da API quando a listagem falha', async () => {
    listarDefinicoesPoloMock.mockRejectedValue({
      response: { data: { detalhe: 'Falha na listagem' } },
    })

    renderDefinicaoPolosListagem()

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Falha na listagem',
    )
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  it('exibe indicador de carregamento enquanto busca os polos', async () => {
    listarDefinicoesPoloMock.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve([poloDiretaApi]), 100)
        }),
    )

    renderDefinicaoPolosListagem()

    expect(
      screen.getByText(/carregando definição de polos/i),
    ).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument()
    })
  })
})
