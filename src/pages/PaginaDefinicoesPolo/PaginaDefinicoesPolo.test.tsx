import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ErroAtualizacaoDefinicoesPolo } from '../../services/definicaoPolo/api'
import type { DefinicaoPolo } from '../../services/definicaoPolo/types'

import PaginaDefinicoesPolo from './index'

vi.mock('../../components/MenuLateral', () => ({
  MenuLateral: () => <aside aria-label="menu lateral">Menu lateral</aside>,
}))

vi.mock('../../components/Cabecalho', () => ({
  Cabecalho: () => <header>Header principal</header>,
}))

vi.mock('../../components/MapaVisual', () => ({
  MapaVisual: () => <nav aria-label="Mapa do site">Mapa visual</nav>,
}))

const {
  listarDefinicoesPoloMock,
  sincronizarUnidadesDiretasMock,
  atualizarDefinicoesPoloEmLoteMock,
  listarEdicoesProgramaMock,
  navegarMock,
} = vi.hoisted(() => ({
  listarDefinicoesPoloMock: vi.fn(),
  sincronizarUnidadesDiretasMock: vi.fn(),
  atualizarDefinicoesPoloEmLoteMock: vi.fn(),
  listarEdicoesProgramaMock: vi.fn(),
  navegarMock: vi.fn(),
}))

vi.mock('../../services/definicaoPolo/api', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('../../services/definicaoPolo/api')>()

  return {
    ...actual,
    listarDefinicoesPolo: listarDefinicoesPoloMock,
    sincronizarUnidadesDiretas: sincronizarUnidadesDiretasMock,
    atualizarDefinicoesPoloEmLote: atualizarDefinicoesPoloEmLoteMock,
  }
})

vi.mock('../../services/edicaoPrograma/listarEdicoesPrograma', () => ({
  listarEdicoesPrograma: listarEdicoesProgramaMock,
}))

vi.mock('../../services/definicaoPolo/useOpcoesFiltroDefinicaoPolos', () => ({
  useOpcoesFiltroDefinicaoPolos: () => ({
    opcoesDre: ['DIRETORIA REGIONAL DE EDUCACAO PENHA'],
    opcoesTipoUe: ['CEI DIRET', 'EMEF'],
    opcoesGestao: ['Direta', 'Parceira'],
    opcoesNomeEdicao: ['-'],
    opcoesTipoPolo: ['Pendente', 'Polo oficial', 'Polo reserva'],
    estaCarregando: false,
  }),
}))

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()

  return {
    ...actual,
    useNavigate: () => navegarMock,
  }
})

const poloExemplo: DefinicaoPolo = {
  id: 'polo-1',
  dre: 'BUTANTA',
  tipoUe: 'CEI',
  nomeUe: 'CEI DIRET ALOYSIO',
  nomeEdicao: '-',
  tipoPolo: 'Pendente',
  gestao: 'Parceira',
}

function criarListagemMock(
  polos: DefinicaoPolo[],
  sobrescritas: Partial<{
    pagina: number
    tamanhoPagina: number
    total: number
    totalPaginas: number
  }> = {},
) {
  return {
    polos,
    pagina: 1,
    tamanhoPagina: 10,
    total: polos.length,
    totalPaginas: polos.length > 0 ? 1 : 0,
    ...sobrescritas,
  }
}

function syncSemNovos() {
  return {
    totalConsultados: 0,
    totalNovos: 0,
    totalJaExistentes: 0,
    executada: false,
    motivoIgnorada: 'ja_executada_hoje',
    ultimaExecucaoEm: '2026-07-13T12:00:00+00:00',
  }
}

function syncComNovos() {
  return {
    totalConsultados: 5,
    totalNovos: 2,
    totalJaExistentes: 3,
    executada: true,
    motivoIgnorada: null,
    ultimaExecucaoEm: '2026-07-14T12:00:00+00:00',
  }
}

describe('PaginaDefinicoesPolo', () => {
  beforeEach(() => {
    navegarMock.mockReset()
    listarDefinicoesPoloMock.mockReset()
    sincronizarUnidadesDiretasMock.mockReset()
    atualizarDefinicoesPoloEmLoteMock.mockReset()
    listarEdicoesProgramaMock.mockReset()

    sincronizarUnidadesDiretasMock.mockResolvedValue(syncSemNovos())
    listarDefinicoesPoloMock.mockResolvedValue(criarListagemMock([poloExemplo]))
    atualizarDefinicoesPoloEmLoteMock.mockResolvedValue({ atualizados: 1 })
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

  it('exibe indicador de carregamento antes da listagem retornar', () => {
    listarDefinicoesPoloMock.mockImplementation(
      () =>
        new Promise(() => {
          /* pendente */
        }),
    )

    render(
      <MemoryRouter>
        <PaginaDefinicoesPolo />
      </MemoryRouter>,
    )

    expect(
      screen.getByText(/carregando definição de polos/i),
    ).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  it('carrega a listagem do banco e sincroniza unidades em seguida', async () => {
    render(
      <MemoryRouter>
        <PaginaDefinicoesPolo />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', { name: /definição de polos/i }),
    ).toBeInTheDocument()

    await waitFor(() => {
      expect(listarDefinicoesPoloMock).toHaveBeenCalled()
    })

    await waitFor(() => {
      expect(sincronizarUnidadesDiretasMock).toHaveBeenCalled()
    })

    expect(await screen.findByRole('table')).toBeInTheDocument()
  })

  it('exibe Sem dados quando a listagem falha', async () => {
    listarDefinicoesPoloMock.mockRejectedValue(new Error('falha'))

    render(
      <MemoryRouter>
        <PaginaDefinicoesPolo />
      </MemoryRouter>,
    )

    expect(await screen.findByText(/sem dados/i)).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  it('recarrega a listagem quando a sincronização retorna totalNovos > 0', async () => {
    sincronizarUnidadesDiretasMock.mockResolvedValue(syncComNovos())
    listarDefinicoesPoloMock
      .mockResolvedValueOnce(criarListagemMock([poloExemplo]))
      .mockResolvedValueOnce(
        criarListagemMock([
          poloExemplo,
          { ...poloExemplo, id: 'polo-2', nomeUe: 'CEI NOVA UNIDADE' },
        ]),
      )

    render(
      <MemoryRouter>
        <PaginaDefinicoesPolo />
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(sincronizarUnidadesDiretasMock).toHaveBeenCalled()
    })

    await waitFor(() => {
      expect(listarDefinicoesPoloMock).toHaveBeenCalledTimes(2)
    })

    expect(await screen.findByText(/cei nova unidade/i)).toBeInTheDocument()
  })

  it('não recarrega a listagem quando totalNovos é 0', async () => {
    sincronizarUnidadesDiretasMock.mockResolvedValue(syncSemNovos())

    render(
      <MemoryRouter>
        <PaginaDefinicoesPolo />
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(sincronizarUnidadesDiretasMock).toHaveBeenCalled()
    })

    await screen.findByRole('table')

    expect(listarDefinicoesPoloMock).toHaveBeenCalledTimes(1)
  })

  it('mantém a listagem quando a sincronização rejeita', async () => {
    sincronizarUnidadesDiretasMock.mockRejectedValue(new Error('sync falhou'))

    render(
      <MemoryRouter>
        <PaginaDefinicoesPolo />
      </MemoryRouter>,
    )

    expect(await screen.findByRole('table')).toBeInTheDocument()
    expect(screen.getByText(/cei diret aloysio/i)).toBeInTheDocument()
    expect(listarDefinicoesPoloMock).toHaveBeenCalledTimes(1)
  })

  it('aplica filtro de gestão Parceira ao filtrar', async () => {
    const usuario = userEvent.setup()

    render(
      <MemoryRouter>
        <PaginaDefinicoesPolo />
      </MemoryRouter>,
    )

    await screen.findByRole('table')

    await usuario.selectOptions(screen.getByLabelText(/^gestão$/i), 'Parceira')
    await usuario.click(screen.getByRole('button', { name: /^filtrar$/i }))

    await waitFor(() => {
      expect(listarDefinicoesPoloMock).toHaveBeenLastCalledWith(
        expect.objectContaining({
          gestao: 'Parceira',
          pagina: 1,
        }),
      )
    })
  })

  it('limpa filtros ao clicar em limpar filtros', async () => {
    const usuario = userEvent.setup()

    render(
      <MemoryRouter>
        <PaginaDefinicoesPolo />
      </MemoryRouter>,
    )

    await screen.findByRole('table')

    await usuario.selectOptions(screen.getByLabelText(/^gestão$/i), 'Parceira')
    await usuario.click(screen.getByRole('button', { name: /limpar filtros/i }))

    expect(screen.getByLabelText(/^gestão$/i)).toHaveValue('')

    await waitFor(() => {
      expect(listarDefinicoesPoloMock).toHaveBeenLastCalledWith(
        expect.objectContaining({
          dre: '',
          tipoUe: '',
          nomeUeOuCodigoEol: '',
          nomeEdicao: '',
          tipoPolo: '',
          gestao: '',
          pagina: 1,
        }),
      )
    })
  })

  it('abre alterar edição pela ação da linha e confirma com sucesso', async () => {
    const usuario = userEvent.setup()

    render(
      <MemoryRouter>
        <PaginaDefinicoesPolo />
      </MemoryRouter>,
    )

    await screen.findByRole('table')

    await usuario.click(
      screen.getByRole('button', {
        name: /alterar edição do polo cei diret aloysio/i,
      }),
    )

    expect(
      await screen.findByRole('dialog', { name: /alterar edição do polo/i }),
    ).toBeInTheDocument()

    await screen.findByLabelText(/selecione o nome da edição/i)
    await usuario.selectOptions(
      screen.getByLabelText(/selecione o nome da edição/i),
      'Janeiro 2025',
    )
    await usuario.click(screen.getByRole('button', { name: /^alterar$/i }))

    await waitFor(() => {
      expect(atualizarDefinicoesPoloEmLoteMock).toHaveBeenCalledWith({
        ids: ['polo-1'],
        nomeEdicao: 'Janeiro 2025',
      })
    })

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('fecha o modal de alterar edição pelo botão Fechar', async () => {
    const usuario = userEvent.setup()

    render(
      <MemoryRouter>
        <PaginaDefinicoesPolo />
      </MemoryRouter>,
    )

    await screen.findByRole('table')
    await usuario.click(
      screen.getByRole('button', {
        name: /alterar edição do polo cei diret aloysio/i,
      }),
    )

    expect(
      await screen.findByRole('dialog', { name: /alterar edição do polo/i }),
    ).toBeInTheDocument()

    await usuario.keyboard('{Escape}')

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('fecha o modal de alterar tipo pelo botão Fechar', async () => {
    const usuario = userEvent.setup()

    render(
      <MemoryRouter>
        <PaginaDefinicoesPolo />
      </MemoryRouter>,
    )

    await screen.findByRole('table')
    await usuario.click(
      screen.getByRole('checkbox', {
        name: /selecionar polo cei diret aloysio/i,
      }),
    )
    await usuario.click(
      screen.getByRole('button', { name: /alterar tipo de polo/i }),
    )

    expect(
      await screen.findByRole('dialog', { name: /alterar tipo de polo/i }),
    ).toBeInTheDocument()

    await usuario.keyboard('{Escape}')

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('altera a quantidade de itens por página', async () => {
    const usuario = userEvent.setup()
    listarDefinicoesPoloMock.mockImplementation(
      (params?: { tamanhoPagina?: number }) =>
        Promise.resolve(
          criarListagemMock([poloExemplo], {
            totalPaginas: 3,
            total: 30,
            tamanhoPagina: params?.tamanhoPagina ?? 10,
          }),
        ),
    )

    render(
      <MemoryRouter>
        <PaginaDefinicoesPolo />
      </MemoryRouter>,
    )

    await screen.findByRole('table')

    const seletorItens = screen.getByLabelText(/itens por página/i)
    await usuario.selectOptions(seletorItens, '20')

    await waitFor(() => {
      expect(listarDefinicoesPoloMock).toHaveBeenCalledWith(
        expect.objectContaining({
          pagina: 1,
          tamanhoPagina: 20,
        }),
      )
    })
  })

  it('exibe erro tipado ao falhar alterar edição', async () => {
    const usuario = userEvent.setup()
    atualizarDefinicoesPoloEmLoteMock.mockRejectedValue(
      new ErroAtualizacaoDefinicoesPolo('Edição inválida para o polo.'),
    )

    render(
      <MemoryRouter>
        <PaginaDefinicoesPolo />
      </MemoryRouter>,
    )

    await screen.findByRole('table')
    await usuario.click(
      screen.getByRole('button', {
        name: /alterar edição do polo cei diret aloysio/i,
      }),
    )

    await screen.findByLabelText(/selecione o nome da edição/i)
    await usuario.selectOptions(
      screen.getByLabelText(/selecione o nome da edição/i),
      'Janeiro 2025',
    )
    await usuario.click(screen.getByRole('button', { name: /^alterar$/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /edição inválida para o polo/i,
    )
  })

  it('exibe erro genérico ao falhar alterar edição com erro comum', async () => {
    const usuario = userEvent.setup()
    atualizarDefinicoesPoloEmLoteMock.mockRejectedValue(new Error('rede'))

    render(
      <MemoryRouter>
        <PaginaDefinicoesPolo />
      </MemoryRouter>,
    )

    await screen.findByRole('table')
    await usuario.click(
      screen.getByRole('button', {
        name: /alterar edição do polo cei diret aloysio/i,
      }),
    )

    await screen.findByLabelText(/selecione o nome da edição/i)
    await usuario.selectOptions(
      screen.getByLabelText(/selecione o nome da edição/i),
      'Janeiro 2025',
    )
    await usuario.click(screen.getByRole('button', { name: /^alterar$/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /não foi possível alterar a edição dos polos selecionados/i,
    )
  })

  it('abre alterar tipo pela barra e confirma com sucesso', async () => {
    const usuario = userEvent.setup()

    render(
      <MemoryRouter>
        <PaginaDefinicoesPolo />
      </MemoryRouter>,
    )

    await screen.findByRole('table')

    await usuario.click(
      screen.getByRole('checkbox', {
        name: /selecionar polo cei diret aloysio/i,
      }),
    )
    await usuario.click(
      screen.getByRole('button', { name: /alterar tipo de polo/i }),
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
      expect(atualizarDefinicoesPoloEmLoteMock).toHaveBeenCalledWith({
        ids: ['polo-1'],
        tipo: 'Polo oficial',
      })
    })

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('executa a ação de visualizar polo sem alterar a listagem', async () => {
    const usuario = userEvent.setup()

    render(
      <MemoryRouter>
        <PaginaDefinicoesPolo />
      </MemoryRouter>,
    )

    await screen.findByRole('table')

    await usuario.click(
      screen.getByRole('button', {
        name: /visualizar polo cei diret aloysio/i,
      }),
    )

    expect(screen.getByRole('table')).toBeInTheDocument()
  })

  it('exibe erro tipado ao falhar alterar tipo de polo', async () => {
    const usuario = userEvent.setup()
    atualizarDefinicoesPoloEmLoteMock.mockRejectedValue(
      new ErroAtualizacaoDefinicoesPolo('Tipo inválido para o polo.'),
    )

    render(
      <MemoryRouter>
        <PaginaDefinicoesPolo />
      </MemoryRouter>,
    )

    await screen.findByRole('table')

    await usuario.click(
      screen.getByRole('checkbox', {
        name: /selecionar polo cei diret aloysio/i,
      }),
    )
    await usuario.click(
      screen.getByRole('button', { name: /alterar tipo de polo/i }),
    )

    expect(
      await screen.findByRole('dialog', { name: /alterar tipo de polo/i }),
    ).toBeInTheDocument()

    await usuario.selectOptions(
      screen.getByLabelText(/selecione o tipo de polo/i),
      'Polo oficial',
    )
    await usuario.click(screen.getByRole('button', { name: /^alterar$/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /tipo inválido para o polo/i,
    )
  })

  it('exibe erro genérico ao falhar alterar tipo de polo com erro comum', async () => {
    const usuario = userEvent.setup()
    atualizarDefinicoesPoloEmLoteMock.mockRejectedValue(new Error('rede'))

    render(
      <MemoryRouter>
        <PaginaDefinicoesPolo />
      </MemoryRouter>,
    )

    await screen.findByRole('table')

    await usuario.click(
      screen.getByRole('checkbox', {
        name: /selecionar polo cei diret aloysio/i,
      }),
    )
    await usuario.click(
      screen.getByRole('button', { name: /alterar tipo de polo/i }),
    )

    await screen.findByRole('dialog', { name: /alterar tipo de polo/i })
    await usuario.selectOptions(
      screen.getByLabelText(/selecione o tipo de polo/i),
      'Polo oficial',
    )
    await usuario.click(screen.getByRole('button', { name: /^alterar$/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /não foi possível alterar o tipo dos polos selecionados/i,
    )
  })

  it('navega para o início ao clicar em voltar', async () => {
    const usuario = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/definicoes-polo']}>
        <PaginaDefinicoesPolo />
      </MemoryRouter>,
    )

    await usuario.click(
      screen.getByRole('button', { name: /voltar ao início/i }),
    )

    expect(navegarMock).toHaveBeenCalledWith('/inicio')
  })
})
