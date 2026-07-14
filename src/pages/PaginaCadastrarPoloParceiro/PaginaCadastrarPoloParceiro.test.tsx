import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ErroCadastroPoloParceiro } from '../../services/poloParceiro/api'

import PaginaCadastrarPoloParceiro from './index'

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
  cadastrarPoloParceiroMock,
  listarDresNomeAbreviacaoMock,
  listarTiposEscolasMock,
  navegarMock,
} = vi.hoisted(() => ({
  cadastrarPoloParceiroMock: vi.fn(),
  listarDresNomeAbreviacaoMock: vi.fn(),
  listarTiposEscolasMock: vi.fn(),
  navegarMock: vi.fn(),
}))

vi.mock('../../services/poloParceiro/api', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('../../services/poloParceiro/api')>()

  return {
    ...actual,
    cadastrarPoloParceiro: cadastrarPoloParceiroMock,
  }
})

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

async function aguardarFormularioCarregado() {
  await waitFor(() => {
    expect(screen.getByLabelText(/^tipo$/i)).toBeInTheDocument()
  })
}

async function preencherFormularioCompleto(usuario: ReturnType<typeof userEvent.setup>) {
  await aguardarFormularioCarregado()

  await usuario.type(screen.getByLabelText(/nome da osc/i), 'OSC Teste')
  await usuario.type(screen.getByLabelText(/nome do polo/i), 'Polo Teste')
  await usuario.selectOptions(
    screen.getByLabelText(/^dre$/i),
    'DIRETORIA REGIONAL DE EDUCACAO BUTANTA',
  )
  await usuario.selectOptions(screen.getByLabelText(/tipo de ue/i), 'EMEF')
  await usuario.type(
    screen.getByLabelText(/quantidade máxima de alunos/i),
    '50',
  )
  await usuario.type(
    screen.getByPlaceholderText('00000-000'),
    '01310100',
  )
  await usuario.type(
    screen.getByPlaceholderText(/digite o endereço/i),
    'Av. Paulista, 1000',
  )
  await usuario.type(screen.getByLabelText(/nome do gestor/i), 'Gestor Teste')
  await usuario.type(
    screen.getByLabelText(/e-mail do polo/i),
    'polo@teste.com',
  )
  await usuario.type(
    screen.getByPlaceholderText('(00) 00000-0000'),
    '11999999999',
  )
}

describe('PaginaCadastrarPoloParceiro', () => {
  beforeEach(() => {
    cadastrarPoloParceiroMock.mockReset()
    cadastrarPoloParceiroMock.mockResolvedValue({
      id: '1',
      dre: 'BUTANTA',
      tipoUe: 'EMEF',
      nomePolo: 'Polo Teste',
      nomeOsc: 'OSC Teste',
    })
    navegarMock.mockReset()
    listarDresNomeAbreviacaoMock.mockResolvedValue([
      {
        codigo: '108100',
        nome: 'DIRETORIA REGIONAL DE EDUCACAO BUTANTA',
        abreviacao: 'DRE - BT',
      },
    ])
    listarTiposEscolasMock.mockResolvedValue([
      {
        codigo: 1,
        descricaoSigla: 'EMEF',
        dtAtualizacao: '2012-01-13T14:09:23.647',
      },
    ])
  })

  it('exibe indicador de carregamento antes das opções dos selects', () => {
    listarDresNomeAbreviacaoMock.mockImplementation(
      () =>
        new Promise(() => {
          /* pendente */
        }),
    )
    listarTiposEscolasMock.mockImplementation(
      () =>
        new Promise(() => {
          /* pendente */
        }),
    )

    render(
      <MemoryRouter>
        <PaginaCadastrarPoloParceiro />
      </MemoryRouter>,
    )

    expect(screen.getByText(/carregando formulário/i)).toBeInTheDocument()
    expect(screen.queryByLabelText(/^tipo$/i)).not.toBeInTheDocument()
  })

  it('renderiza layout, seções do formulário e botões', async () => {
    render(
      <MemoryRouter>
        <PaginaCadastrarPoloParceiro />
      </MemoryRouter>,
    )

    expect(screen.getByLabelText(/menu lateral/i)).toBeInTheDocument()
    expect(screen.getByText(/header principal/i)).toBeInTheDocument()
    expect(
      screen.getByRole('navigation', { name: /mapa do site/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /cadastrar polo parceiro/i }),
    ).toBeInTheDocument()

    await aguardarFormularioCarregado()

    expect(screen.getByText(/informações gerais/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /^endereço$/i })).toBeInTheDocument()
    expect(screen.getByText(/informações de contato/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /^observações$/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/^tipo$/i)).toHaveValue('Pendente')
    expect(screen.getByRole('button', { name: /salvar/i })).toBeDisabled()
    expect(
      screen.getByRole('button', { name: /cancelar/i }),
    ).toBeInTheDocument()
  })

  it('mantém o botão salvar desabilitado até o formulário estar preenchido', async () => {
    const usuario = userEvent.setup()

    render(
      <MemoryRouter>
        <PaginaCadastrarPoloParceiro />
      </MemoryRouter>,
    )

    await aguardarFormularioCarregado()

    const botaoSalvar = screen.getByRole('button', { name: /salvar/i })
    expect(botaoSalvar).toBeDisabled()

    await usuario.type(screen.getByLabelText(/nome da osc/i), 'OSC Teste')
    expect(botaoSalvar).toBeDisabled()

    await usuario.type(screen.getByLabelText(/nome do polo/i), 'Polo Teste')

    await usuario.selectOptions(
      screen.getByLabelText(/^dre$/i),
      'DIRETORIA REGIONAL DE EDUCACAO BUTANTA',
    )
    await usuario.selectOptions(screen.getByLabelText(/tipo de ue/i), 'EMEF')
    await usuario.type(
      screen.getByLabelText(/quantidade máxima de alunos/i),
      '50',
    )
    await usuario.type(
      screen.getByPlaceholderText('00000-000'),
      '01310100',
    )
    await usuario.type(
      screen.getByPlaceholderText(/digite o endereço/i),
      'Av. Paulista, 1000',
    )
    await usuario.type(screen.getByLabelText(/nome do gestor/i), 'Gestor Teste')
    await usuario.type(
      screen.getByLabelText(/e-mail do polo/i),
      'polo@teste.com',
    )
    await usuario.type(
      screen.getByPlaceholderText('(00) 00000-0000'),
      '11999999999',
    )

    expect(botaoSalvar).toBeEnabled()
  })

  it('aplica máscaras nos campos de CEP e telefone durante a digitação', async () => {
    const usuario = userEvent.setup()

    render(
      <MemoryRouter>
        <PaginaCadastrarPoloParceiro />
      </MemoryRouter>,
    )

    await aguardarFormularioCarregado()

    await usuario.type(screen.getByLabelText(/^cep$/i), '01310100')
    await usuario.type(
      screen.getByLabelText(/telefone do polo/i),
      '1133334444',
    )

    expect(screen.getByLabelText(/^cep$/i)).toHaveValue('01310-100')
    expect(screen.getByLabelText(/telefone do polo/i)).toHaveValue(
      '(11) 3333-4444',
    )
  })

  it('cadastra polo parceiro via API e redireciona para a listagem', async () => {
    const usuario = userEvent.setup()

    render(
      <MemoryRouter>
        <PaginaCadastrarPoloParceiro />
      </MemoryRouter>,
    )

    await preencherFormularioCompleto(usuario)
    await usuario.click(screen.getByRole('button', { name: /salvar/i }))

    await waitFor(() => {
      expect(cadastrarPoloParceiroMock).toHaveBeenCalledWith({
        tipo: 'Pendente',
        nomeOsc: 'OSC Teste',
        nomePolo: 'Polo Teste',
        dre: 'DIRETORIA REGIONAL DE EDUCACAO BUTANTA',
        tipoUe: 'EMEF',
        quantidadeMaximaAlunos: '50',
        cep: '01310-100',
        endereco: 'Av. Paulista, 1000',
        nomeGestor: 'Gestor Teste',
        emailPolo: 'polo@teste.com',
        telefonePolo: '(11) 99999-9999',
        status: 'ativo',
        observacoes: '',
      })
    })

    expect(navegarMock).toHaveBeenCalledWith('/polos-parceiros', {
      state: { poloCadastrado: true },
    })
  })

  it('exibe mensagem de erro quando o e-mail é inválido', async () => {
    const usuario = userEvent.setup()

    render(
      <MemoryRouter>
        <PaginaCadastrarPoloParceiro />
      </MemoryRouter>,
    )

    await aguardarFormularioCarregado()

    await usuario.type(screen.getByLabelText(/nome da osc/i), 'OSC Teste')
    await usuario.type(screen.getByLabelText(/nome do polo/i), 'Polo Teste')

    await usuario.selectOptions(
      screen.getByLabelText(/^dre$/i),
      'DIRETORIA REGIONAL DE EDUCACAO BUTANTA',
    )
    await usuario.selectOptions(screen.getByLabelText(/tipo de ue/i), 'EMEF')
    await usuario.type(
      screen.getByLabelText(/quantidade máxima de alunos/i),
      '50',
    )
    await usuario.type(
      screen.getByPlaceholderText('00000-000'),
      '01310100',
    )
    await usuario.type(
      screen.getByPlaceholderText(/digite o endereço/i),
      'Av. Paulista, 1000',
    )
    await usuario.type(screen.getByLabelText(/nome do gestor/i), 'Gestor Teste')
    await usuario.type(
      screen.getByLabelText(/e-mail do polo/i),
      'email-invalido',
    )
    await usuario.type(
      screen.getByPlaceholderText('(00) 00000-0000'),
      '11999999999',
    )
    await usuario.click(screen.getByRole('button', { name: /salvar/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /informe um e-mail válido/i,
    )
    expect(cadastrarPoloParceiroMock).not.toHaveBeenCalled()
    expect(navegarMock).not.toHaveBeenCalled()
  })

  it('exibe mensagem de erro quando o cadastro falha', async () => {
    const usuario = userEvent.setup()

    cadastrarPoloParceiroMock.mockRejectedValue(
      new ErroCadastroPoloParceiro('Não foi possível cadastrar o polo parceiro.'),
    )

    render(
      <MemoryRouter>
        <PaginaCadastrarPoloParceiro />
      </MemoryRouter>,
    )

    await preencherFormularioCompleto(usuario)
    await usuario.click(screen.getByRole('button', { name: /salvar/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Não foi possível cadastrar o polo parceiro.',
    )
    expect(navegarMock).not.toHaveBeenCalled()
  })
})
