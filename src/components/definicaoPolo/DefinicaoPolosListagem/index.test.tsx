import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type {
  DefinicaoPoloApi,
  FiltrosListagemDefinicaoPolos,
  ListagemDefinicoesPoloPaginada,
  PoloParaAlterarTipo,
} from '@/services/definicaoPolo/types'
import { FILTROS_LISTAGEM_DEFINICAO_POLOS_INICIAIS } from '@/services/definicaoPolo/types'
import { DefinicaoPolosListagem } from './index'

const { listarDefinicoesPoloMock } = vi.hoisted(() => ({
  listarDefinicoesPoloMock: vi.fn(),
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

const poloDiretaApi: DefinicaoPoloApi = {
  polo_uuid: '1',
  codigo_eol: '400001',
  nome_polo: 'CEI DIRET ALOYSIO',
  dre_nome: 'BUTANTA',
  dre_codigo_eol: '108100',
  tipo_ue: 'CEI',
  gestao: 'direta',
  status: 'ativo',
  ativo: true,
  definicao_uuid: null,
  edicao_uuid: 'ed-1',
  nome_edicao: 'Janeiro 2025',
  tipo_polo_edicao: 'pendente',
  projecao_inscritos_edicao: null,
  total_inscritos_edicao: null,
}

const poloParceiraApi: DefinicaoPoloApi = {
  polo_uuid: '2',
  codigo_eol: '400002',
  nome_polo: 'EMEF AMORIM LIMA',
  dre_nome: 'PENHA',
  dre_codigo_eol: '108200',
  tipo_ue: 'EMEF',
  gestao: 'parceira',
  status: 'ativo',
  ativo: true,
  definicao_uuid: 'def-2',
  edicao_uuid: 'ed-1',
  nome_edicao: 'Janeiro 2025',
  tipo_polo_edicao: 'oficial',
  projecao_inscritos_edicao: null,
  total_inscritos_edicao: null,
}

function criarListagemPaginada(
  results: DefinicaoPoloApi[],
  count = results.length,
): ListagemDefinicoesPoloPaginada {
  return {
    count,
    next: null,
    previous: null,
    results,
  }
}

function renderDefinicaoPolosListagem(
  props: Partial<{
    onVisualizarPolo: (idPolo: string) => void
    onAlterarEdicaoPolo: (idsPolos: string[]) => void
    onAlterarTipoPolo: (polos: PoloParaAlterarTipo[]) => void
    filtros: FiltrosListagemDefinicaoPolos
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
        filtros={props.filtros}
        onVisualizarPolo={props.onVisualizarPolo ?? vi.fn()}
        onAlterarEdicaoPolo={props.onAlterarEdicaoPolo ?? vi.fn()}
        onAlterarTipoPolo={props.onAlterarTipoPolo ?? vi.fn()}
      />
    </QueryClientProvider>,
  )
}

describe('DefinicaoPolosListagem', () => {
  beforeEach(() => {
    listarDefinicoesPoloMock.mockResolvedValue(
      criarListagemPaginada([poloDiretaApi, poloParceiraApi]),
    )
  })

  it('exibe mensagem de listagem vazia', async () => {
    listarDefinicoesPoloMock.mockResolvedValue(criarListagemPaginada([]))

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

  it('envia os filtros e a paginação aplicados para a API', async () => {
    const filtros = {
      ...FILTROS_LISTAGEM_DEFINICAO_POLOS_INICIAIS,
      dre: '108100',
      tipoUe: 'CEI DIRET',
      nomeUeOuCodigoEol: '400496',
      edicao: 'ed-1',
      tipoPolo: 'pendente',
      gestao: 'direta',
    }

    renderDefinicaoPolosListagem({ filtros })

    await screen.findByRole('table')

    expect(listarDefinicoesPoloMock).toHaveBeenCalledWith({
      busca: '400496',
      dre_codigos_eol: ['108100'],
      tipo_ue: 'CEI DIRET',
      edicao: 'ed-1',
      gestao: 'direta',
      tipo_polo: 'pendente',
      page: 1,
      page_size: 10,
    })
  })

  it('solicita a página seguinte ao backend ao navegar na paginação', async () => {
    const usuario = userEvent.setup()
    listarDefinicoesPoloMock.mockResolvedValue(
      criarListagemPaginada([poloDiretaApi], 25),
    )

    renderDefinicaoPolosListagem()

    await screen.findByRole('table')

    await usuario.click(screen.getByRole('button', { name: /próxima página/i }))

    await waitFor(() => {
      expect(listarDefinicoesPoloMock).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 2,
          page_size: 10,
        }),
      )
    })
  })

  it('solicita novo page_size ao backend ao alterar itens por página', async () => {
    const usuario = userEvent.setup()
    listarDefinicoesPoloMock.mockResolvedValue(
      criarListagemPaginada([poloDiretaApi], 25),
    )

    renderDefinicaoPolosListagem()

    await screen.findByRole('table')

    await usuario.click(
      screen.getByRole('combobox', { name: /itens por página/i }),
    )
    await usuario.click(await screen.findByRole('option', { name: '20' }))

    await waitFor(() => {
      expect(listarDefinicoesPoloMock).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 1,
          page_size: 20,
        }),
      )
    })
  })

  it('não recorta a página no frontend quando o backend já paginou', async () => {
    listarDefinicoesPoloMock.mockResolvedValue(
      criarListagemPaginada(
        Array.from({ length: 10 }, (_, indice) => ({
          ...poloDiretaApi,
          polo_uuid: String(indice + 1),
          nome_polo: `POLO ${indice + 1}`,
        })),
        25,
      ),
    )

    renderDefinicaoPolosListagem()

    await screen.findByRole('table')

    expect(screen.getAllByRole('row')).toHaveLength(11)
    expect(screen.getByText('POLO 1')).toBeInTheDocument()
    expect(screen.getByText('POLO 10')).toBeInTheDocument()
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
        name: /selecionar polo emef amorim lima/i,
      }),
    )

    await usuario.click(
      screen.getByRole('button', { name: /^alterar edição$/i }),
    )
    expect(onAlterarEdicaoPolo).toHaveBeenCalledWith(['2'])

    await usuario.click(
      screen.getByRole('button', { name: /^alterar tipo de polo$/i }),
    )
    expect(onAlterarTipoPolo).toHaveBeenCalledWith([
      { polo_uuid: '2', edicao_uuid: 'ed-1' },
    ])

    await usuario.click(screen.getByRole('button', { name: /^cancelar$/i }))
    expect(screen.queryByText(/ue selecionada/i)).not.toBeInTheDocument()
  })

  it('envia edicao_uuid nulo ao alterar tipo de polo sem edição', async () => {
    const usuario = userEvent.setup()
    const onAlterarTipoPolo = vi.fn()
    listarDefinicoesPoloMock.mockResolvedValue(
      criarListagemPaginada([
        {
          ...poloDiretaApi,
          edicao_uuid: null,
          nome_edicao: null,
        },
      ]),
    )

    renderDefinicaoPolosListagem({ onAlterarTipoPolo })

    await screen.findByRole('table')

    await usuario.click(
      screen.getByRole('checkbox', {
        name: /selecionar polo cei diret aloysio/i,
      }),
    )
    await usuario.click(
      screen.getByRole('button', { name: /^alterar tipo de polo$/i }),
    )

    expect(onAlterarTipoPolo).toHaveBeenCalledWith([
      { polo_uuid: '1', edicao_uuid: null },
    ])
  })

  it('envia polo_uuid ao alterar edição mesmo sem definicao_uuid', async () => {
    const usuario = userEvent.setup()
    const onAlterarEdicaoPolo = vi.fn()

    renderDefinicaoPolosListagem({ onAlterarEdicaoPolo })

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
        name: /alterar edição do polo emef amorim lima/i,
      }),
    )
    expect(onAlterarEdicaoPolo).toHaveBeenCalledWith(['2'])
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
    listarDefinicoesPoloMock.mockResolvedValue(
      criarListagemPaginada([
        {
          ...poloDiretaApi,
          polo_uuid: '3',
          nome_polo: 'CEI SEM TIPO',
          nome_edicao: null,
          tipo_polo_edicao: null,
        },
      ]),
    )

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
          setTimeout(
            () => resolve(criarListagemPaginada([poloDiretaApi])),
            100,
          )
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
