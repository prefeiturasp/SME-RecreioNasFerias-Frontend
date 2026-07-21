import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { PoloParceiro } from '../../services/poloParceiro/types'

import PaginaPolosParceiros from './index'

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
  listarPolosParceirosMock,
  listarDresNomeAbreviacaoMock,
  listarTiposEscolasMock,
  navegarMock,
} = vi.hoisted(() => ({
  listarPolosParceirosMock: vi.fn(),
  listarDresNomeAbreviacaoMock: vi.fn(),
  listarTiposEscolasMock: vi.fn(),
  navegarMock: vi.fn(),
}))

vi.mock('../../services/poloParceiro/api', () => ({
  listarPolosParceiros: listarPolosParceirosMock,
}))

vi.mock('../../services/smeIntegracao/api', () => ({
  listarDresNomeAbreviacao: listarDresNomeAbreviacaoMock,
  listarTiposEscolas: listarTiposEscolasMock,
}))

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()

  return {
    ...actual,
    useNavigate: () => navegarMock,
  }
})

const poloExemplo: PoloParceiro = {
  id: '1',
  dre: 'BUTANTA',
  tipoUe: 'CEI',
  nomePolo: 'CEI DIRET ALOYSIO DE MENEZES PINTO NETO',
  nomeOsc: 'Cantinho Feliz',
}

function criarListagemMock(
  polos: PoloParceiro[],
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
    totalPaginas: 1,
    ...sobrescritas,
  }
}

describe('PaginaPolosParceiros', () => {
  beforeEach(() => {
    navegarMock.mockReset()
    listarPolosParceirosMock.mockResolvedValue(
      criarListagemMock([poloExemplo], { totalPaginas: 20, total: 200 }),
    )
    listarDresNomeAbreviacaoMock.mockResolvedValue([
      {
        codigo: '108100',
        nome: 'DIRETORIA REGIONAL DE EDUCACAO BUTANTA',
        abreviacao: 'DRE - BT',
      },
      {
        codigo: '108600',
        nome: 'DIRETORIA REGIONAL DE EDUCACAO IPIRANGA',
        abreviacao: 'DRE - IP',
      },
    ])
    listarTiposEscolasMock.mockResolvedValue([
      {
        codigo: 1,
        descricaoSigla: 'EMEF',
        dtAtualizacao: '2012-01-13T14:09:23.647',
      },
      {
        codigo: 10,
        descricaoSigla: 'CEI DIRET',
        dtAtualizacao: '2007-05-25T14:38:12.173',
      },
    ])
  })

  it('exibe indicador de carregamento antes da listagem retornar', () => {
    listarPolosParceirosMock.mockImplementation(
      () =>
        new Promise(() => {
          /* pendente */
        }),
    )

    render(
      <MemoryRouter>
        <PaginaPolosParceiros />
      </MemoryRouter>,
    )

    expect(screen.getByText(/carregando polos parceiros/i)).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  it('renderiza filtros, título da listagem e botão voltar', async () => {
    render(
      <MemoryRouter>
        <PaginaPolosParceiros />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', { name: /cadastro de polos parceiros/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /filtrar polos/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /voltar ao início/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /adicionar polo parceiro/i }),
    ).toBeInTheDocument()

    expect(
      await screen.findByText(/resultados da pesquisa/i),
    ).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument()
    })

    expect(screen.getByRole('cell', { name: /butanta/i })).toBeInTheDocument()
    expect(
      screen.getByRole('cell', { name: /cantinho feliz/i }),
    ).toBeInTheDocument()
  })

  it('aplica filtros ao clicar em filtrar', async () => {
    const usuario = userEvent.setup()

    render(
      <MemoryRouter>
        <PaginaPolosParceiros />
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(listarPolosParceirosMock).toHaveBeenCalled()
    })

    await waitFor(() => {
      expect(listarDresNomeAbreviacaoMock).toHaveBeenCalled()
    })

    await screen.findByLabelText(/filtrar por dre/i)

    await usuario.selectOptions(
      screen.getByLabelText(/filtrar por dre/i),
      'DIRETORIA REGIONAL DE EDUCACAO BUTANTA',
    )
    await usuario.click(screen.getByRole('button', { name: /^filtrar$/i }))

    await waitFor(() => {
      expect(listarPolosParceirosMock).toHaveBeenLastCalledWith(
        expect.objectContaining({
          dre: 'DIRETORIA REGIONAL DE EDUCACAO BUTANTA',
          pagina: 1,
        }),
      )
    })
  })

  it('limpa filtros ao clicar em limpar filtros', async () => {
    const usuario = userEvent.setup()

    render(
      <MemoryRouter>
        <PaginaPolosParceiros />
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(listarPolosParceirosMock).toHaveBeenCalled()
    })

    await screen.findByLabelText(/filtrar por tipo de ue/i)

    await usuario.selectOptions(
      screen.getByLabelText(/filtrar por tipo de ue/i),
      'EMEF',
    )
    await usuario.click(screen.getByRole('button', { name: /limpar filtros/i }))

    expect(screen.getByLabelText(/filtrar por tipo de ue/i)).toHaveValue('')

    await waitFor(() => {
      expect(listarPolosParceirosMock).toHaveBeenLastCalledWith(
        expect.objectContaining({
          dre: '',
          tipoUe: '',
          nomePoloOuOsc: '',
          pagina: 1,
        }),
      )
    })
  })

  it('navega para edição ao clicar em editar polo', async () => {
    const usuario = userEvent.setup()

    render(
      <MemoryRouter>
        <PaginaPolosParceiros />
      </MemoryRouter>,
    )

    await screen.findByRole('table')

    await usuario.click(
      screen.getByRole('button', {
        name: /editar polo cei diret aloysio de menezes pinto neto/i,
      }),
    )

    expect(navegarMock).toHaveBeenCalledWith('/editar-polo-parceiro/1')
  })

  it('navega para cadastro ao clicar em adicionar polo parceiro', async () => {
    const usuario = userEvent.setup()

    render(
      <MemoryRouter>
        <PaginaPolosParceiros />
      </MemoryRouter>,
    )

    await usuario.click(
      screen.getByRole('button', { name: /adicionar polo parceiro/i }),
    )

    expect(navegarMock).toHaveBeenCalledWith('/cadastrar-polo-parceiro')
  })

  it('exibe mensagem de sucesso ao retornar do cadastro', () => {
    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: '/polos-parceiros',
            state: { poloCadastrado: true },
          },
        ]}
      >
        <PaginaPolosParceiros />
      </MemoryRouter>,
    )

    expect(
      screen.getByText(/polo parceiro cadastrado com sucesso/i),
    ).toBeInTheDocument()
  })
})
