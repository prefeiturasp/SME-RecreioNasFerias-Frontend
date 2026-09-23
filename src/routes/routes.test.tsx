import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  definirSessaoAutenticacao,
  limparSessaoAutenticacao,
} from '../services/autenticacao'
import { ToastProvider } from '@/contexts/ToastContext'
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

vi.mock('../services/polo/listarPolos', () => ({
  listarPolos: vi.fn().mockResolvedValue({
    count: 0,
    next: null,
    previous: null,
    results: [],
  }),
}))

vi.mock('../services/dre/listarDres', () => ({
  listarDres: vi.fn().mockResolvedValue([]),
}))

vi.mock('../services/tipoEscola/listarTiposEscola', () => ({
  listarTiposEscola: vi.fn().mockResolvedValue([]),
}))

vi.mock('../services/polo/obterPolo', () => ({
  obterPolo: vi.fn().mockResolvedValue({
    uuid: '11111111-1111-1111-1111-111111111111',
    codigo_eol: '123456',
    nome_polo: 'Polo Teste',
    nome_osc: 'OSC Teste',
    dre_nome: 'DIRETORIA REGIONAL DE EDUCACAO BUTANTA',
    dre_codigo_eol: '108100',
    tipo: 'pendente',
    status: 'ativo',
    gestao: 'parceira',
    tipo_ue: 'EMEF',
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
  }),
}))

vi.mock('../services/smeIntegracao/api', () => ({
  listarDresNomeAbreviacao: vi.fn().mockResolvedValue([]),
  listarTiposEscola: vi.fn().mockResolvedValue([]),
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
        <ToastProvider>
          <RotasAplicacao />
        </ToastProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

vi.mock('../services/definicaoPolo/listarDefinicoesPolo', () => ({
  listarDefinicoesPolo: vi.fn().mockResolvedValue({
    count: 0,
    next: null,
    previous: null,
    results: [],
  }),
}))

vi.mock('../services/definicaoPolo/obterDefinicaoPolo', () => ({
  obterDefinicaoPolo: vi.fn().mockResolvedValue({
    uuid: '11c43c20-dfcb-4a26-a677-30703b7de766',
    polo: {
      uuid: 'f05bc2c0-4728-4907-a10e-4971d06103fe',
      codigo_eol: '400496',
      nome_polo: '13 DE MAIO',
      nome_osc: '',
      dre_nome: 'DIRETORIA REGIONAL DE EDUCACAO IPIRANGA',
      dre_codigo_eol: '108600',
      tipo: 'pendente',
      status: 'ativo',
      gestao: 'direta',
      tipo_ue: 'CEI DIRET',
      quantidade_maxima_alunos: 100,
      cep: '04201000',
      tipo_logradouro: 'Rua',
      logradouro: 'Treze de Maio',
      bairro: 'Ipiranga',
      numero: '100',
      complemento: '',
      nome_gestor: 'Diretor Exemplo',
      email: 'polo@exemplo.com',
      telefone: '1133334444',
      observacoes_gerais: '',
      ativo: true,
      endereco_completo: 'Rua Treze de Maio, 100 - Ipiranga',
    },
    edicao: {
      uuid: '2da0f4f1-ef50-4346-b482-c06a237a7a8b',
      nome: 'edicao de fevereiro 2',
    },
    tipo: 'reserva',
    projecao_inscritos: 10,
    total_inscritos: 13,
    ponto_focal_nome: '',
    ponto_focal_telefone: '',
    ponto_focal_email: '',
    ativo: true,
    resultado_final_de_inscritos: 8,
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

    renderRotas('/polos-parceiros')

    const mapa = screen.getByRole('navigation', { name: /mapa do site/i })
    expect(mapa).toHaveTextContent('Início')
    expect(mapa).toHaveTextContent('Cadastros')
    expect(mapa).toHaveTextContent('Cadastro de Polos Parceiros')
    expect(
      screen.getByRole('heading', { name: /cadastro de polos parceiros/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/filtrar polos/i)).toBeInTheDocument()
    expect(
      await screen.findByText(/nenhum polo cadastrado/i),
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

    renderRotas('/cadastrar-polo-parceiro')

    expect(
      screen.getByRole('heading', { name: /cadastrar polo parceiro/i }),
    ).toBeInTheDocument()
    expect(await screen.findByLabelText(/^tipo$/i)).toHaveValue('pendente')
    expect(screen.getByText(/informações gerais/i)).toBeInTheDocument()
  })

  it('renderiza a página Editar Polo Parceiro na rota /editar-polo-parceiro/:idPolo quando autenticado', async () => {
    definirSessaoAutenticacao({
      token: 'eyJ-token',
      rf: '1234567',
      nome: 'USUARIO TESTE',
      descricaoCargo: 'CARGO TESTE',
    })

    renderRotas('/editar-polo-parceiro/11111111-1111-1111-1111-111111111111')

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

    renderRotas('/definicoes-polo')

    const mapa = screen.getByRole('navigation', { name: /mapa do site/i })
    expect(mapa).toHaveTextContent('Início')
    expect(mapa).toHaveTextContent('Cadastros')
    expect(mapa).toHaveTextContent('Definição de Polos')
    expect(
      screen.getByRole('heading', { name: /definição de polos/i }),
    ).toBeInTheDocument()
  })

  it('redireciona para login ao acessar /definicoes-polo/:idDefinicao sem autenticação', async () => {
    renderRotas('/definicoes-polo/11c43c20-dfcb-4a26-a677-30703b7de766')

    expect(await screen.findByText(/bem-vindo\(a\) ao/i)).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: /detalhamento do polo/i }),
    ).not.toBeInTheDocument()
  })

  it('renderiza a página Detalhamento do Polo na rota /definicoes-polo/:idDefinicao quando autenticado', async () => {
    definirSessaoAutenticacao({
      token: 'eyJ-token',
      rf: '1234567',
      nome: 'USUARIO TESTE',
      descricaoCargo: 'CARGO TESTE',
    })

    renderRotas('/definicoes-polo/11c43c20-dfcb-4a26-a677-30703b7de766')

    const mapa = screen.getByRole('navigation', { name: /mapa do site/i })
    expect(mapa).toHaveTextContent('Início')
    expect(mapa).toHaveTextContent('Cadastros')
    expect(mapa).toHaveTextContent('Definição de Polos')
    expect(mapa).toHaveTextContent('Detalhamento do Polo')
    expect(
      screen.getByRole('heading', { name: /detalhamento do polo/i }),
    ).toBeInTheDocument()
    expect(await screen.findByLabelText(/tipo de gest/i)).toHaveValue('Direta')
    expect(
      screen.getByRole('button', {
        name: /voltar para definição de polos/i,
      }),
    ).toBeInTheDocument()
  })
})
