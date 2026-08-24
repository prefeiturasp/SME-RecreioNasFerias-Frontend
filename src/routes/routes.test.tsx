import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  definirSessaoAutenticacao,
  limparSessaoAutenticacao,
} from '../services/autenticacao'
import { RotasAplicacao } from './index'

const { restaurarSessaoAutenticacaoMock } = vi.hoisted(() => ({
  restaurarSessaoAutenticacaoMock: vi.fn(),
}))

vi.mock('../services/autenticacao', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('../services/autenticacao')>()

  return {
    ...actual,
    restaurarSessaoAutenticacao: restaurarSessaoAutenticacaoMock,
  }
})

vi.mock('../components/MenuLateral', () => ({
  MenuLateral: () => <aside aria-label="menu lateral">Menu lateral</aside>,
}))

vi.mock('../services/poloParceiro/api', () => ({
  listarPolosParceiros: vi.fn().mockResolvedValue({
    polos: [],
    pagina: 1,
    tamanhoPagina: 10,
    total: 0,
    totalPaginas: 0,
  }),
  cadastrarPoloParceiro: vi.fn(),
  obterPoloParceiro: vi.fn().mockResolvedValue({
    id: '11111111-1111-1111-1111-111111111111',
    tipo: 'Pendente',
    nomeOsc: 'OSC Teste',
    nomePolo: 'Polo Teste',
    dre: 'DIRETORIA REGIONAL DE EDUCACAO BUTANTA',
    tipoUe: 'EMEF',
    quantidadeMaximaAlunos: 50,
    cep: '01310100',
    endereco: 'Av. Paulista, 1000',
    nomeGestor: 'Gestor Teste',
    emailPolo: 'polo@teste.com',
    telefonePolo: '11999999999',
    status: 'ativo',
    observacoesGerais: '',
  }),
  atualizarPoloParceiro: vi.fn(),
}))

vi.mock('../services/smeIntegracao/api', () => ({
  listarDresNomeAbreviacao: vi.fn().mockResolvedValue([]),
  listarTiposEscolas: vi.fn().mockResolvedValue([]),
}))

vi.mock(
  '../services/edicaoPrograma/listarEdicoesPrograma',
  async (importOriginal) => {
    const actual =
      await importOriginal<
        typeof import('../services/edicaoPrograma/listarEdicoesPrograma')
      >()

    return {
      ...actual,
      listarEdicoesPrograma: vi.fn().mockResolvedValue([]),
    }
  },
)

function renderRotas(initialEntry: string) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <RotasAplicacao />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

vi.mock('../services/definicaoPolo/api', () => ({
  listarDefinicoesPolo: vi.fn().mockResolvedValue({
    polos: [],
    pagina: 1,
    tamanhoPagina: 10,
    total: 0,
    totalPaginas: 0,
  }),
  sincronizarUnidadesDiretas: vi.fn().mockResolvedValue({
    totalConsultados: 0,
    totalNovos: 0,
    totalJaExistentes: 0,
    executada: false,
    motivoIgnorada: 'ja_executada_hoje',
    ultimaExecucaoEm: null,
  }),
  atualizarDefinicoesPoloEmLote: vi.fn(),
  listarOpcoesFiltroDefinicaoPolos: vi.fn().mockResolvedValue({
    dres: [],
    tiposUe: [],
    gestoes: [],
    nomesEdicao: [],
    tiposPolo: [],
  }),
}))

describe('RotasAplicacao', () => {
  beforeEach(() => {
    limparSessaoAutenticacao()
    restaurarSessaoAutenticacaoMock.mockReset()
    restaurarSessaoAutenticacaoMock.mockResolvedValue(undefined)
  })

  it('renderiza a página inicial na rota raiz', () => {
    renderRotas('/')

    expect(screen.getByText(/bem-vindo\(a\) ao/i)).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        name: /sistema de gestão.*do recreio nas férias/i,
      }),
    ).toBeInTheDocument()
  })

  it('redireciona para login ao acessar /inicio sem autenticação', async () => {
    renderRotas('/inicio')

    expect(await screen.findByText(/bem-vindo\(a\) ao/i)).toBeInTheDocument()
    expect(
      screen.queryByRole('navigation', { name: /mapa do site/i }),
    ).not.toBeInTheDocument()
  })

  it('renderiza a página principal na rota /inicio quando autenticado', () => {
    definirSessaoAutenticacao({
      token: 'eyJ-token',
      rf: '1234567',
      nome: 'USUARIO TESTE',
      descricaoCargo: 'CARGO TESTE',
    })

    render(
      <MemoryRouter initialEntries={['/inicio']}>
        <RotasAplicacao />
      </MemoryRouter>,
    )

    const mapa = screen.getByRole('navigation', { name: /mapa do site/i })
    expect(mapa).toHaveTextContent('Início')
  })

  it('redireciona para login ao acessar /edicoes-programa sem autenticação', async () => {
    renderRotas('/edicoes-programa')

    expect(await screen.findByText(/bem-vindo\(a\) ao/i)).toBeInTheDocument()
    expect(
      screen.queryByRole('navigation', { name: /mapa do site/i }),
    ).not.toBeInTheDocument()
  })

  it('renderiza a página Edições do Programa na rota /edicoes-programa quando autenticado', async () => {
    definirSessaoAutenticacao({
      token: 'eyJ-token',
      rf: '1234567',
      nome: 'USUARIO TESTE',
      descricaoCargo: 'CARGO TESTE',
    })

    renderRotas('/edicoes-programa')

    const mapa = screen.getByRole('navigation', { name: /mapa do site/i })
    expect(mapa).toHaveTextContent('Início')
    expect(mapa).toHaveTextContent('Cadastros')
    expect(mapa).toHaveTextContent('Edições do programa')
    expect(
      await screen.findByRole('heading', { name: /edições do programa/i }),
    ).toBeInTheDocument()
  })

  it('renderiza a página Cadastro de Polos Parceiros na rota /polos-parceiros quando autenticado', async () => {
    definirSessaoAutenticacao({
      token: 'eyJ-token',
      rf: '1234567',
      nome: 'USUARIO TESTE',
      descricaoCargo: 'CARGO TESTE',
    })

    render(
      <MemoryRouter initialEntries={['/polos-parceiros']}>
        <RotasAplicacao />
      </MemoryRouter>,
    )

    const mapa = screen.getByRole('navigation', { name: /mapa do site/i })
    expect(mapa).toHaveTextContent('Início')
    expect(mapa).toHaveTextContent('Cadastros')
    expect(mapa).toHaveTextContent('Cadastro de Polos Parceiros')
    expect(
      screen.getByRole('heading', { name: /cadastro de polos parceiros/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/filtrar polos/i)).toBeInTheDocument()
    expect(
      await screen.findByText(/resultados da pesquisa/i),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /adicionar polo parceiro/i }),
    ).toBeInTheDocument()
  })

  it('renderiza a página Cadastrar Polo Parceiro na rota /cadastrar-polo-parceiro quando autenticado', async () => {
    definirSessaoAutenticacao({
      token: 'eyJ-token',
      rf: '1234567',
      nome: 'USUARIO TESTE',
      descricaoCargo: 'CARGO TESTE',
    })

    render(
      <MemoryRouter initialEntries={['/cadastrar-polo-parceiro']}>
        <RotasAplicacao />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', { name: /cadastrar polo parceiro/i }),
    ).toBeInTheDocument()
    expect(await screen.findByLabelText(/^tipo$/i)).toHaveValue('Pendente')
    expect(screen.getByText(/informações gerais/i)).toBeInTheDocument()
  })

  it('renderiza a página Editar Polo Parceiro na rota /editar-polo-parceiro/:idPolo quando autenticado', async () => {
    definirSessaoAutenticacao({
      token: 'eyJ-token',
      rf: '1234567',
      nome: 'USUARIO TESTE',
      descricaoCargo: 'CARGO TESTE',
    })

    render(
      <MemoryRouter
        initialEntries={[
          '/editar-polo-parceiro/11111111-1111-1111-1111-111111111111',
        ]}
      >
        <RotasAplicacao />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', { name: /editar polo parceiro/i }),
    ).toBeInTheDocument()
    expect(await screen.findByDisplayValue('OSC Teste')).toBeInTheDocument()
    expect(screen.getByText(/informações gerais/i)).toBeInTheDocument()
  })

  it('renderiza a página Definições de Polo na rota /definicoes-polo quando autenticado', () => {
    definirSessaoAutenticacao({
      token: 'eyJ-token',
      rf: '1234567',
      nome: 'USUARIO TESTE',
      descricaoCargo: 'CARGO TESTE',
    })

    render(
      <MemoryRouter initialEntries={['/definicoes-polo']}>
        <RotasAplicacao />
      </MemoryRouter>,
    )

    const mapa = screen.getByRole('navigation', { name: /mapa do site/i })
    expect(mapa).toHaveTextContent('Início')
    expect(mapa).toHaveTextContent('Cadastros')
    expect(mapa).toHaveTextContent('Definição de Polos')
    expect(
      screen.getByRole('heading', { name: /definição de polos/i }),
    ).toBeInTheDocument()
  })
})
