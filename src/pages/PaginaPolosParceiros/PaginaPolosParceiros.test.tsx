import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { PoloDetalhado } from '../../services/polo/types'

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

const { listarPolosMock, listarDresMock, listarTiposEscolaMock, navegarMock } =
  vi.hoisted(() => ({
    listarPolosMock: vi.fn(),
    listarDresMock: vi.fn(),
    listarTiposEscolaMock: vi.fn(),
    navegarMock: vi.fn(),
  }))

vi.mock('../../services/polo/listarPolos', () => ({
  listarPolos: listarPolosMock,
}))

vi.mock('../../services/dre/listarDres', () => ({
  listarDres: listarDresMock,
}))

vi.mock('../../services/tipoEscola/listarTiposEscola', () => ({
  listarTiposEscola: listarTiposEscolaMock,
}))

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()

  return {
    ...actual,
    useNavigate: () => navegarMock,
  }
})

const poloExemplo: PoloDetalhado = {
  uuid: '1',
  codigo_eol: '123456',
  nome_polo: 'CEI DIRET ALOYSIO DE MENEZES PINTO NETO',
  nome_osc: 'Cantinho Feliz',
  dre_nome: 'DIRETORIA REGIONAL DE EDUCACAO BUTANTA',
  dre_codigo_eol: '108100',
  tipo: 'pendente',
  status: 'ativo',
  gestao: 'parceira',
  tipo_ue: 'CEI',
  quantidade_maxima_alunos: 50,
  cep: '01310100',
  tipo_logradouro: 'Avenida',
  logradouro: 'Paulista',
  bairro: 'Bela Vista',
  numero: '1000',
  complemento: '',
  nome_gestor: 'Gestor Teste',
  email: 'polo@teste.com',
  telefone: '11999999999',
  observacoes_gerais: '',
  ativo: true,
  criado_em: '2026-08-27T11:28:47.128Z',
  atualizado_em: '2026-08-27T11:28:47.128Z',
}

function renderPagina() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <PaginaPolosParceiros />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('PaginaPolosParceiros', () => {
  beforeEach(() => {
    navegarMock.mockReset()
    listarPolosMock.mockResolvedValue([poloExemplo])
    listarDresMock.mockResolvedValue([
      {
        codigo_dre: '108100',
        nome_dre: 'DIRETORIA REGIONAL DE EDUCACAO BUTANTA',
        sigla_dre: 'BT',
      },
      {
        codigo_dre: '108600',
        nome_dre: 'DIRETORIA REGIONAL DE EDUCACAO IPIRANGA',
        sigla_dre: 'IP',
      },
    ])
    listarTiposEscolaMock.mockResolvedValue([
      {
        codigo: 1,
        descricao_sigla: 'EMEF',
      },
      {
        codigo: 10,
        descricao_sigla: 'CEI DIRET',
      },
    ])
  })

  it('exibe indicador de carregamento antes da listagem retornar', () => {
    listarPolosMock.mockImplementation(
      () =>
        new Promise(() => {
          /* pendente */
        }),
    )

    renderPagina()

    expect(screen.getByText(/carregando polos/i)).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  it('renderiza filtros, título da listagem e botão voltar', async () => {
    renderPagina()

    expect(
      screen.getByRole('heading', { name: /cadastro de polos parceiros/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/filtrar polos/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /voltar ao início/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /adicionar polo parceiro/i }),
    ).toBeInTheDocument()

    expect(await screen.findByRole('table')).toBeInTheDocument()

    expect(
      screen.getByRole('cell', { name: poloExemplo.nome_polo, exact: true }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('cell', { name: /cantinho feliz/i }),
    ).toBeInTheDocument()
  })

  it('aplica filtros ao clicar em filtrar', async () => {
    const usuario = userEvent.setup()

    renderPagina()

    await waitFor(() => {
      expect(listarPolosMock).toHaveBeenCalled()
    })

    await waitFor(() => {
      expect(listarDresMock).toHaveBeenCalled()
    })

    await screen.findByLabelText(/filtrar por dre/i)

    await usuario.click(screen.getByLabelText(/filtrar por dre/i))
    await usuario.click(await screen.findByRole('option', { name: /butanta/i }))
    await usuario.click(screen.getByRole('button', { name: /^filtrar$/i }))

    await waitFor(() => {
      expect(listarPolosMock).toHaveBeenLastCalledWith('', '108100', '')
    })
  })

  it('limpa filtros ao clicar em limpar filtros', async () => {
    const usuario = userEvent.setup()

    renderPagina()

    await waitFor(() => {
      expect(listarPolosMock).toHaveBeenCalled()
    })

    await screen.findByLabelText(/filtrar por tipo de ue/i)

    await usuario.click(screen.getByLabelText(/filtrar por tipo de ue/i))
    await usuario.click(await screen.findByRole('option', { name: 'EMEF' }))
    await usuario.click(screen.getByRole('button', { name: /limpar filtros/i }))

    expect(screen.getByLabelText(/filtrar por tipo de ue/i)).toHaveValue('')

    await waitFor(() => {
      expect(listarPolosMock).toHaveBeenLastCalledWith('', '', '')
    })
  })

  it('navega para edição ao clicar em editar polo', async () => {
    renderPagina()

    await screen.findByRole('table')

    expect(
      screen.getByRole('link', {
        name: /editar polo cei diret aloysio de menezes pinto neto/i,
      }),
    ).toHaveAttribute('href', '/editar-polo-parceiro/1')
  })

  it('navega para cadastro ao clicar em adicionar polo parceiro', async () => {
    const usuario = userEvent.setup()

    renderPagina()

    await usuario.click(
      screen.getByRole('button', { name: /adicionar polo parceiro/i }),
    )

    expect(navegarMock).toHaveBeenCalledWith('/cadastrar-polo-parceiro')
  })

  it('exibe mensagem de sucesso ao retornar do cadastro', () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter
          initialEntries={[
            {
              pathname: '/polos-parceiros',
              state: { poloCadastrado: true },
            },
          ]}
        >
          <PaginaPolosParceiros />
        </MemoryRouter>
      </QueryClientProvider>,
    )

    expect(
      screen.getByText(/polo parceiro cadastrado com sucesso/i),
    ).toBeInTheDocument()
  })
})
