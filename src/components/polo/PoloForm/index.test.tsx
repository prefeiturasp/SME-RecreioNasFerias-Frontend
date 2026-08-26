import type { PoloDetalhado } from '@/services/polo/types'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PoloForm } from './index'

const {
  cadastrarPoloMock,
  obterPoloMock,
  atualizarPoloMock,
  listarDresNomeAbreviacaoMock,
  listarTiposEscolasMock,
} = vi.hoisted(() => ({
  cadastrarPoloMock: vi.fn(),
  obterPoloMock: vi.fn(),
  atualizarPoloMock: vi.fn(),
  listarDresNomeAbreviacaoMock: vi.fn(),
  listarTiposEscolasMock: vi.fn(),
}))

vi.mock('@/services/polo/cadastrarPolo', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('@/services/polo/cadastrarPolo')>()

  return {
    ...actual,
    cadastrarPolo: cadastrarPoloMock,
  }
})

vi.mock('@/services/polo/obterPolo', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('@/services/polo/obterPolo')>()

  return {
    ...actual,
    obterPolo: obterPoloMock,
  }
})

vi.mock('@/services/polo/atualizarPolo', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('@/services/polo/atualizarPolo')>()

  return {
    ...actual,
    atualizarPolo: atualizarPoloMock,
  }
})

vi.mock('@/services/smeIntegracao/api', () => ({
  listarDresNomeAbreviacao: listarDresNomeAbreviacaoMock,
  listarTiposEscolas: listarTiposEscolasMock,
}))

const poloCarregado: PoloDetalhado = {
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
}

const dreNome = 'DIRETORIA REGIONAL DE EDUCACAO BUTANTA'

function criarUsuario() {
  return userEvent.setup({ delay: null })
}

async function selecionarOpcao(
  usuario: ReturnType<typeof userEvent.setup>,
  rotulo: string | RegExp,
  opcao: string,
) {
  await usuario.click(screen.getByLabelText(rotulo))
  await usuario.click(await screen.findByRole('option', { name: opcao }))
}

async function preencherFormularioValido(
  usuario: ReturnType<typeof userEvent.setup>,
) {
  await usuario.type(screen.getByLabelText(/nome da osc/i), 'OSC Teste')
  await usuario.type(screen.getByLabelText(/nome do polo/i), 'Polo Teste')
  await selecionarOpcao(usuario, /^dre$/i, dreNome)
  await selecionarOpcao(usuario, /tipo de ue/i, 'EMEF')
  await usuario.type(
    screen.getByLabelText(/quantidade máxima de alunos/i),
    '50',
  )
  await usuario.type(screen.getByPlaceholderText('00000-000'), '01310100')
  await usuario.type(
    screen.getByPlaceholderText(/digite o endereço/i),
    'Av. Paulista, 1000',
  )
  await usuario.type(screen.getByLabelText(/nome do gestor/i), 'Gestor Teste')
  await usuario.type(screen.getByLabelText(/e-mail do polo/i), 'polo@teste.com')
  await usuario.type(
    screen.getByPlaceholderText('(00) 00000-0000'),
    '11999999999',
  )
}

function ListagemPolosStub() {
  const location = useLocation()
  const estado = location.state as { poloCadastrado?: boolean } | null

  return (
    <div>
      <p>Listagem de polos</p>
      {estado?.poloCadastrado ? <p>Polo cadastrado</p> : null}
    </div>
  )
}

function renderPoloForm(poloId?: string) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  const rotaInicial = poloId
    ? `/editar-polo-parceiro/${poloId}`
    : '/cadastrar-polo-parceiro'

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[rotaInicial]}>
        <Routes>
          <Route path="/cadastrar-polo-parceiro" element={<PoloForm />} />
          <Route
            path="/editar-polo-parceiro/:idPolo"
            element={<PoloForm poloId={poloId} />}
          />
          <Route path="/polos-parceiros" element={<ListagemPolosStub />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

async function aguardarFormularioCadastro() {
  expect(await screen.findByLabelText(/nome da osc/i)).toBeInTheDocument()
}

describe('PoloForm', { timeout: 15000 }, () => {
  beforeEach(() => {
    cadastrarPoloMock.mockReset()
    obterPoloMock.mockReset()
    atualizarPoloMock.mockReset()
    listarDresNomeAbreviacaoMock.mockResolvedValue([
      {
        codigo: '108100',
        nome: dreNome,
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
    cadastrarPoloMock.mockResolvedValue(poloCarregado)
  })

  it('exibe indicador de carregamento antes das opções dos selects', () => {
    listarDresNomeAbreviacaoMock.mockImplementation(
      () =>
        new Promise(() => {
          /* pendente */
        }),
    )

    renderPoloForm()

    expect(screen.getByText(/carregando formulário/i)).toBeInTheDocument()
    expect(screen.queryByLabelText(/nome da osc/i)).not.toBeInTheDocument()
  })

  it('renderiza os campos, o botão salvar e o cancelar', async () => {
    renderPoloForm()
    await aguardarFormularioCadastro()

    expect(screen.getByLabelText(/^tipo$/i)).toHaveValue('Pendente')
    expect(screen.queryByLabelText(/^status$/i)).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument()
  })

  it('exibe erros de validação quando os campos estão vazios', async () => {
    const usuario = criarUsuario()
    renderPoloForm()
    await aguardarFormularioCadastro()

    await usuario.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(
      await screen.findByText('Nome da OSC é obrigatório'),
    ).toBeInTheDocument()
    expect(screen.getByText('Nome do polo é obrigatório')).toBeInTheDocument()
    expect(cadastrarPoloMock).not.toHaveBeenCalled()
  })

  it('cadastra polo via API e redireciona para a listagem', async () => {
    const usuario = criarUsuario()
    renderPoloForm()
    await aguardarFormularioCadastro()

    await preencherFormularioValido(usuario)
    await usuario.click(screen.getByRole('button', { name: 'Salvar' }))

    await waitFor(() => {
      expect(cadastrarPoloMock).toHaveBeenCalledWith(
        expect.objectContaining({
          tipo: 'Pendente',
          nomeOsc: 'OSC Teste',
          nomePolo: 'Polo Teste',
          dre: dreNome,
          tipoUe: 'EMEF',
          quantidadeMaximaAlunos: '50',
          cep: '01310-100',
          endereco: 'Av. Paulista, 1000',
          nomeGestor: 'Gestor Teste',
          emailPolo: 'polo@teste.com',
          telefonePolo: '(11) 99999-9999',
          status: 'ativo',
        }),
        expect.objectContaining({
          client: expect.any(QueryClient),
        }),
      )
    })

    expect(await screen.findByText('Listagem de polos')).toBeInTheDocument()
    expect(screen.getByText('Polo cadastrado')).toBeInTheDocument()
  })

  it('exibe mensagem de erro quando o cadastro falha', async () => {
    const usuario = criarUsuario()
    cadastrarPoloMock.mockRejectedValue({
      response: {
        data: { detalhe: 'Já existe polo parceiro com o nome cadastrado.' },
      },
    })
    renderPoloForm()
    await aguardarFormularioCadastro()

    await preencherFormularioValido(usuario)
    await usuario.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Já existe polo parceiro com o nome cadastrado.',
    )
    expect(screen.queryByText('Listagem de polos')).not.toBeInTheDocument()
  })

  it('remove o alerta da API quando o usuário altera um campo', async () => {
    const usuario = criarUsuario()
    cadastrarPoloMock.mockRejectedValue({
      response: {
        data: { detalhe: 'Já existe polo parceiro com o nome cadastrado.' },
      },
    })
    renderPoloForm()
    await aguardarFormularioCadastro()

    await preencherFormularioValido(usuario)
    await usuario.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Já existe polo parceiro com o nome cadastrado.',
    )

    await usuario.type(screen.getByLabelText(/nome da osc/i), ' atualizada')

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })
  })
})

describe('PoloForm em edição', { timeout: 15000 }, () => {
  beforeEach(() => {
    cadastrarPoloMock.mockReset()
    obterPoloMock.mockReset()
    atualizarPoloMock.mockReset()
    listarDresNomeAbreviacaoMock.mockResolvedValue([
      {
        codigo: '108100',
        nome: dreNome,
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
    obterPoloMock.mockResolvedValue(poloCarregado)
    atualizarPoloMock.mockResolvedValue(poloCarregado)
  })

  it('preenche o formulário com os dados do GET', async () => {
    renderPoloForm(poloCarregado.id)

    expect(await screen.findByDisplayValue('OSC Teste')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Polo Teste')).toBeInTheDocument()
    expect(screen.getByLabelText(/^tipo$/i)).toHaveValue('Pendente')
    expect(screen.getByLabelText(/^status$/i)).toBeInTheDocument()
    expect(obterPoloMock).toHaveBeenCalledWith(poloCarregado.id)
  })

  it('exibe indicador de carregamento enquanto o GET não retorna', () => {
    obterPoloMock.mockImplementation(
      () =>
        new Promise(() => {
          /* pendente */
        }),
    )

    renderPoloForm(poloCarregado.id)

    expect(screen.getByText('Carregando polo parceiro...')).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Salvar' }),
    ).not.toBeInTheDocument()
  })

  it('abre confirmação, atualiza via PUT e redireciona', async () => {
    const usuario = criarUsuario()
    renderPoloForm(poloCarregado.id)

    const campoNome = await screen.findByLabelText(/nome do polo/i)
    await usuario.clear(campoNome)
    await usuario.type(campoNome, 'Polo Atualizado')
    await usuario.click(screen.getByRole('button', { name: 'Salvar' }))

    const modal = await screen.findByRole('dialog')
    expect(modal).toHaveTextContent(/deseja salvar as alterações/i)
    expect(atualizarPoloMock).not.toHaveBeenCalled()

    await usuario.click(
      within(modal).getByRole('button', { name: /^salvar$/i }),
    )

    await waitFor(() => {
      expect(atualizarPoloMock).toHaveBeenCalledWith(
        poloCarregado.id,
        expect.objectContaining({
          nomePolo: 'Polo Atualizado',
          nomeOsc: 'OSC Teste',
        }),
      )
    })

    expect(cadastrarPoloMock).not.toHaveBeenCalled()
    expect(await screen.findByText('Listagem de polos')).toBeInTheDocument()
  })

  it('não chama PUT quando a confirmação é cancelada', async () => {
    const usuario = criarUsuario()
    renderPoloForm(poloCarregado.id)

    const campoNome = await screen.findByLabelText(/nome do polo/i)
    await usuario.clear(campoNome)
    await usuario.type(campoNome, 'Polo Atualizado')
    await usuario.click(screen.getByRole('button', { name: 'Salvar' }))

    const modal = await screen.findByRole('dialog')
    await usuario.click(
      within(modal).getByRole('button', { name: /cancelar/i }),
    )

    expect(atualizarPoloMock).not.toHaveBeenCalled()
    expect(screen.queryByText('Listagem de polos')).not.toBeInTheDocument()
  })

  it('exibe mensagem de erro quando a consulta falha', async () => {
    obterPoloMock.mockRejectedValue({
      response: { data: { detalhe: 'Polo não encontrado.' } },
    })

    renderPoloForm(poloCarregado.id)

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Polo não encontrado.',
    )
    expect(
      screen.queryByRole('button', { name: 'Salvar' }),
    ).not.toBeInTheDocument()
  })

  it('exibe mensagem de erro quando a atualização falha', async () => {
    const usuario = criarUsuario()
    atualizarPoloMock.mockRejectedValue({
      response: { data: { detalhe: 'Não foi possível salvar o polo.' } },
    })

    renderPoloForm(poloCarregado.id)

    const campoNome = await screen.findByLabelText(/nome do polo/i)
    await usuario.clear(campoNome)
    await usuario.type(campoNome, 'Polo Alterado')
    await usuario.click(screen.getByRole('button', { name: 'Salvar' }))

    const modal = await screen.findByRole('dialog')
    await usuario.click(
      within(modal).getByRole('button', { name: /^salvar$/i }),
    )

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Não foi possível salvar o polo.',
    )
    expect(screen.queryByText('Listagem de polos')).not.toBeInTheDocument()
  })
})
