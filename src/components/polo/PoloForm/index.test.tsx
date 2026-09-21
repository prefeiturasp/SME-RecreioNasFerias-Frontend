import type { DadosDaUnidade, PoloDetalhado } from '@/services/polo/types'
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
  obterDadosDaUnidadeMock,
  toastMock,
  dismissToastMock,
} = vi.hoisted(() => ({
  cadastrarPoloMock: vi.fn(),
  obterPoloMock: vi.fn(),
  atualizarPoloMock: vi.fn(),
  obterDadosDaUnidadeMock: vi.fn(),
  toastMock: vi.fn(),
  dismissToastMock: vi.fn(),
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

vi.mock('@/services/polo/obterDadosDaUnidade', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('@/services/polo/obterDadosDaUnidade')>()

  return {
    ...actual,
    obterDadosDaUnidade: obterDadosDaUnidadeMock,
  }
})

vi.mock('@/hooks/useToast', () => ({
  useToast: () => ({
    showToast: toastMock,
    dismissToast: dismissToastMock,
  }),
}))

const dreNome = 'DIRETORIA REGIONAL DE EDUCACAO BUTANTA'

const poloCarregado: PoloDetalhado = {
  uuid: '11111111-1111-1111-1111-111111111111',
  codigo_eol: '123456',
  nome_polo: 'Polo Teste',
  nome_osc: 'OSC Teste',
  dre_nome: dreNome,
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
}

const dadosDaUnidade: DadosDaUnidade = {
  nome: 'Polo Teste',
  codigo_eol: '123456',
  sigla_tipo_escola: 'EMEF',
  nome_dre: dreNome,
  sigla_dre: 'BT',
  codigo_dre: '108100',
  email: 'polo@teste.com',
  telefone: '11999999999',
  cep: '01310100',
  tipo_logradouro: 'Avenida',
  logradouro: 'Paulista',
  bairro: 'Bela Vista',
  numero: '1000',
  complemento: '',
  municipio: 'SAO PAULO',
  uf: 'SP',
}

function criarUsuario() {
  return userEvent.setup({ delay: null })
}

function campoCodigoEol() {
  return screen.getByRole('textbox', { name: /^código eol$/i })
}

async function consultarUnidade(
  usuario: ReturnType<typeof userEvent.setup>,
  codigoEol = '123456',
  nomeEsperado = dadosDaUnidade.nome,
) {
  await usuario.type(campoCodigoEol(), codigoEol)
  await usuario.click(
    screen.getByRole('button', { name: /consultar código eol/i }),
  )
  await waitFor(() => {
    expect(screen.getByLabelText(/nome do polo/i)).toHaveValue(nomeEsperado)
  })
}

async function preencherCamposManuais(
  usuario: ReturnType<typeof userEvent.setup>,
) {
  await usuario.type(screen.getByLabelText(/nome da osc/i), 'OSC Teste')
  await usuario.type(
    screen.getByLabelText(/quantidade máxima de alunos/i),
    '50',
  )
  await usuario.type(screen.getByLabelText(/nome do gestor/i), 'Gestor Teste')
}

async function preencherFormularioValido(
  usuario: ReturnType<typeof userEvent.setup>,
) {
  await consultarUnidade(usuario)
  await preencherCamposManuais(usuario)
}

function ListagemPolosStub() {
  const location = useLocation()
  const estado = location.state as {
    poloCadastrado?: boolean
    poloAtualizado?: boolean
  } | null

  return (
    <div>
      <p>Listagem de polos</p>
      {estado?.poloCadastrado ? <p>Polo cadastrado</p> : null}
      {estado?.poloAtualizado ? <p>Polo atualizado</p> : null}
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

describe('PoloForm', { timeout: 15000 }, () => {
  beforeEach(() => {
    cadastrarPoloMock.mockReset()
    obterPoloMock.mockReset()
    atualizarPoloMock.mockReset()
    obterDadosDaUnidadeMock.mockReset()
    toastMock.mockReset()
    dismissToastMock.mockReset()
    cadastrarPoloMock.mockResolvedValue(poloCarregado)
    obterDadosDaUnidadeMock.mockResolvedValue(dadosDaUnidade)
  })

  it('renderiza os campos, o botão salvar e o cancelar', () => {
    renderPoloForm()

    expect(screen.getByLabelText(/^tipo$/i)).toHaveValue('pendente')
    expect(screen.queryByLabelText(/^status$/i)).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /consultar código eol/i }),
    ).toBeInTheDocument()
  })

  it('consulta a unidade pela lupa e preenche os campos retornados', async () => {
    const usuario = criarUsuario()
    renderPoloForm()

    await consultarUnidade(usuario)

    expect(obterDadosDaUnidadeMock).toHaveBeenCalledWith('123456')
    expect(screen.getByLabelText(/nome do polo/i)).toHaveValue('Polo Teste')
    expect(screen.getByLabelText(/^dre$/i)).toHaveValue(dreNome)
    expect(screen.getByLabelText(/tipo de ue/i)).toHaveValue('EMEF')
    expect(screen.getByLabelText(/^cep$/i)).toHaveValue('01310100')
    expect(screen.getByLabelText(/tipo de logradouro/i)).toHaveValue('Avenida')
    expect(screen.getByLabelText(/^logradouro$/i)).toHaveValue('Paulista')
    expect(screen.getByLabelText(/^bairro$/i)).toHaveValue('Bela Vista')
    expect(screen.getByLabelText(/^número$/i)).toHaveValue('1000')
    expect(screen.getByLabelText(/e-mail do polo/i)).toHaveValue(
      'polo@teste.com',
    )
    expect(screen.getByLabelText(/telefone do polo/i)).toHaveValue(
      '11999999999',
    )
  })

  it('consulta a unidade ao pressionar Enter no código EOL', async () => {
    const usuario = criarUsuario()
    renderPoloForm()

    await usuario.type(campoCodigoEol(), '123456{Enter}')

    await waitFor(() => {
      expect(screen.getByLabelText(/nome do polo/i)).toHaveValue('Polo Teste')
    })
    expect(obterDadosDaUnidadeMock).toHaveBeenCalledWith('123456')
    expect(cadastrarPoloMock).not.toHaveBeenCalled()
  })

  it('impede o preenchimento manual dos campos retornados pela unidade', async () => {
    const usuario = criarUsuario()
    renderPoloForm()

    await consultarUnidade(usuario)

    expect(screen.getByLabelText(/nome do polo/i)).toHaveAttribute('readonly')
    expect(screen.getByLabelText(/^dre$/i)).toHaveAttribute('readonly')
    expect(screen.getByLabelText(/tipo de ue/i)).toHaveAttribute('readonly')
    expect(screen.getByLabelText(/^cep$/i)).toHaveAttribute('readonly')
    expect(screen.getByLabelText(/tipo de logradouro/i)).toHaveAttribute(
      'readonly',
    )
    expect(screen.getByLabelText(/^logradouro$/i)).toHaveAttribute('readonly')
    expect(screen.getByLabelText(/^bairro$/i)).toHaveAttribute('readonly')
    expect(screen.getByLabelText(/^número$/i)).toHaveAttribute('readonly')
    expect(screen.getByLabelText(/^complemento$/i)).toHaveAttribute('readonly')
    expect(screen.getByLabelText(/e-mail do polo/i)).toHaveAttribute('readonly')
    expect(screen.getByLabelText(/telefone do polo/i)).toHaveAttribute(
      'readonly',
    )
  })

  it('permite informar o e-mail quando a unidade retorna o campo vazio', async () => {
    const usuario = criarUsuario()
    obterDadosDaUnidadeMock.mockResolvedValue({
      ...dadosDaUnidade,
      email: '',
    })
    renderPoloForm()

    await consultarUnidade(usuario)

    const campoEmail = screen.getByLabelText(/e-mail do polo/i)
    expect(campoEmail).not.toHaveAttribute('readonly')
    await usuario.type(campoEmail, 'unidade@escola.sp.gov.br')
    expect(campoEmail).toHaveValue('unidade@escola.sp.gov.br')
  })

  it('permite informar o telefone quando a unidade retorna o campo vazio', async () => {
    const usuario = criarUsuario()
    obterDadosDaUnidadeMock.mockResolvedValue({
      ...dadosDaUnidade,
      telefone: '',
    })
    renderPoloForm()

    await consultarUnidade(usuario)

    const campoTelefone = screen.getByLabelText(/telefone do polo/i)
    expect(campoTelefone).not.toHaveAttribute('readonly')
    await usuario.type(campoTelefone, '11999999999')
    expect(campoTelefone).toHaveValue('11999999999')
  })

  it('não cadastra sem e-mail e telefone quando a unidade não retorna esses dados', async () => {
    const usuario = criarUsuario()
    obterDadosDaUnidadeMock.mockResolvedValue({
      ...dadosDaUnidade,
      email: '',
      telefone: '',
    })
    renderPoloForm()

    await consultarUnidade(usuario)
    await preencherCamposManuais(usuario)
    await usuario.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(
      await screen.findByText('E-mail do polo é obrigatório'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Telefone do polo é obrigatório'),
    ).toBeInTheDocument()
    expect(cadastrarPoloMock).not.toHaveBeenCalled()

    await usuario.type(
      screen.getByLabelText(/e-mail do polo/i),
      'unidade@escola.sp.gov.br',
    )
    await usuario.type(
      screen.getByLabelText(/telefone do polo/i),
      '11999999999',
    )
    await usuario.click(screen.getByRole('button', { name: 'Salvar' }))

    await waitFor(() => {
      expect(cadastrarPoloMock).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'unidade@escola.sp.gov.br',
          telefone: '11999999999',
        }),
        expect.objectContaining({
          client: expect.any(QueryClient),
        }),
      )
    })
  })

  it('exibe toast quando o código EOL não é encontrado', async () => {
    const usuario = criarUsuario()
    obterDadosDaUnidadeMock.mockRejectedValue({
      response: { status: 404, data: {} },
    })
    renderPoloForm()

    await usuario.type(campoCodigoEol(), '000000')
    await usuario.click(
      screen.getByRole('button', { name: /consultar código eol/i }),
    )

    await waitFor(() => {
      expect(toastMock).toHaveBeenCalledWith({
        id: 'eol-nao-encontrado',
        variant: 'destructive',
        description: 'EOL não encontrado. Favor entrar em contato com a DRE',
      })
    })
    expect(screen.getByLabelText(/nome do polo/i)).toHaveValue('')
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeDisabled()
    expect(cadastrarPoloMock).not.toHaveBeenCalled()
  })

  it('exibe toast quando a unidade retorna codigo_eol vazio', async () => {
    const usuario = criarUsuario()
    obterDadosDaUnidadeMock.mockResolvedValue({
      ...dadosDaUnidade,
      codigo_eol: '',
    })
    renderPoloForm()

    await usuario.type(campoCodigoEol(), '123456')
    await usuario.click(
      screen.getByRole('button', { name: /consultar código eol/i }),
    )

    await waitFor(() => {
      expect(toastMock).toHaveBeenCalledWith({
        id: 'eol-nao-encontrado',
        variant: 'destructive',
        description: 'EOL não encontrado. Favor entrar em contato com a DRE',
      })
    })
    expect(screen.getByLabelText(/nome do polo/i)).toHaveValue('')
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeDisabled()
    expect(cadastrarPoloMock).not.toHaveBeenCalled()
  })

  it('limpa os dados da unidade quando o código EOL deixa de corresponder à consulta', async () => {
    const usuario = criarUsuario()
    renderPoloForm()

    await consultarUnidade(usuario)
    await usuario.type(campoCodigoEol(), '7')

    expect(screen.getByLabelText(/nome do polo/i)).toHaveValue('')
    expect(screen.getByLabelText(/^dre$/i)).toHaveValue('')
    expect(screen.getByLabelText(/^cep$/i)).toHaveValue('')
    expect(screen.getByLabelText(/e-mail do polo/i)).toHaveValue('')
  })

  it('preenche os campos novamente ao consultar outro código EOL', async () => {
    const usuario = criarUsuario()
    const outraUnidade: DadosDaUnidade = {
      ...dadosDaUnidade,
      nome: 'AURI VERDE - CHACARA SANTO AMARO',
      codigo_eol: '400571',
      sigla_tipo_escola: 'CR.P.CONV',
      nome_dre: 'DIRETORIA REGIONAL DE EDUCACAO CAPELA DO SOCORRO',
      codigo_dre: '108300',
      email: '',
      telefone: '59742587',
      cep: '04856-300',
      tipo_logradouro: 'Rua',
      logradouro: 'GLORIOSA',
      bairro: 'JARDIM NOVO HORIZONTE',
      numero: '1',
    }
    obterDadosDaUnidadeMock
      .mockResolvedValueOnce(dadosDaUnidade)
      .mockResolvedValueOnce(outraUnidade)
    renderPoloForm()

    await consultarUnidade(usuario)

    const campoCodigo = campoCodigoEol()
    await usuario.clear(campoCodigo)
    await consultarUnidade(usuario, '400571', outraUnidade.nome)

    expect(screen.getByLabelText(/nome do polo/i)).toHaveValue(
      outraUnidade.nome,
    )
    expect(screen.getByLabelText(/^dre$/i)).toHaveValue(outraUnidade.nome_dre)
    expect(screen.getByLabelText(/tipo de ue/i)).toHaveValue(
      outraUnidade.sigla_tipo_escola,
    )
    expect(screen.getByLabelText(/^cep$/i)).toHaveValue('04856-300')
    expect(screen.getByLabelText(/e-mail do polo/i)).toHaveValue('')
    expect(screen.getByLabelText(/e-mail do polo/i)).not.toHaveAttribute(
      'readonly',
    )
    expect(screen.getByLabelText(/telefone do polo/i)).toHaveValue('59742587')
    expect(screen.getByLabelText(/telefone do polo/i)).toHaveAttribute(
      'readonly',
    )
  })

  it('não consulta a unidade quando o código EOL é inválido', async () => {
    const usuario = criarUsuario()
    renderPoloForm()

    await usuario.type(campoCodigoEol(), '123')
    await usuario.click(
      screen.getByRole('button', { name: /consultar código eol/i }),
    )

    expect(
      await screen.findByText(
        'Código EOL é obrigatório e não pode ser menor que 6 caracteres',
      ),
    ).toBeInTheDocument()
    expect(obterDadosDaUnidadeMock).not.toHaveBeenCalled()
  })

  it('exibe erros de validação quando os campos estão vazios', async () => {
    const usuario = criarUsuario()
    renderPoloForm()

    await usuario.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(
      await screen.findByText('Nome da OSC é obrigatório'),
    ).toBeInTheDocument()
    expect(screen.getByText('Nome do polo é obrigatório')).toBeInTheDocument()
    expect(screen.getByText('E-mail do polo é obrigatório')).toBeInTheDocument()
    expect(
      screen.getByText('Telefone do polo é obrigatório'),
    ).toBeInTheDocument()
    expect(cadastrarPoloMock).not.toHaveBeenCalled()
  })

  it('cadastra polo via API e redireciona para a listagem', async () => {
    const usuario = criarUsuario()
    renderPoloForm()

    await preencherFormularioValido(usuario)
    await usuario.click(screen.getByRole('button', { name: 'Salvar' }))

    await waitFor(() => {
      expect(cadastrarPoloMock).toHaveBeenCalledWith(
        expect.objectContaining({
          tipo: 'pendente',
          gestao: 'parceira',
          codigoEol: '123456',
          nomeOsc: 'OSC Teste',
          nomePolo: 'Polo Teste',
          dreNome: dreNome,
          dreCodigoEol: '108100',
          tipoUe: 'EMEF',
          quantidadeMaximaAlunos: '50',
          cep: '01310100',
          tipoLogradouro: 'Avenida',
          logradouro: 'Paulista',
          bairro: 'Bela Vista',
          numero: '1000',
          nomeGestor: 'Gestor Teste',
          email: 'polo@teste.com',
          telefone: '11999999999',
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

  it('exibe toast de erro quando o cadastro falha', async () => {
    const usuario = criarUsuario()
    cadastrarPoloMock.mockRejectedValue({
      response: {
        data: { detalhe: 'Já existe polo parceiro com o nome cadastrado.' },
      },
    })
    renderPoloForm()

    await preencherFormularioValido(usuario)
    await usuario.click(screen.getByRole('button', { name: 'Salvar' }))

    await waitFor(() => {
      expect(toastMock).toHaveBeenCalledWith({
        id: 'erro-cadastro-polo-parceiro',
        variant: 'destructive',
        title: 'Erro ao cadastrar polo parceiro',
        description: 'Já existe polo parceiro com o nome cadastrado.',
      })
    })
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.queryByText('Listagem de polos')).not.toBeInTheDocument()
  })

  it('fecha o toast da API quando o usuário altera um campo', async () => {
    const usuario = criarUsuario()
    cadastrarPoloMock.mockRejectedValue({
      response: {
        data: { detalhe: 'Já existe polo parceiro com o nome cadastrado.' },
      },
    })
    renderPoloForm()

    await preencherFormularioValido(usuario)
    await usuario.click(screen.getByRole('button', { name: 'Salvar' }))

    await waitFor(() => {
      expect(toastMock).toHaveBeenCalled()
    })

    await usuario.type(screen.getByLabelText(/nome da osc/i), ' atualizada')

    await waitFor(() => {
      expect(dismissToastMock).toHaveBeenCalledWith(
        'erro-cadastro-polo-parceiro',
      )
    })
  })
})

describe('PoloForm em edição', { timeout: 15000 }, () => {
  beforeEach(() => {
    cadastrarPoloMock.mockReset()
    obterPoloMock.mockReset()
    atualizarPoloMock.mockReset()
    obterDadosDaUnidadeMock.mockReset()
    toastMock.mockReset()
    dismissToastMock.mockReset()
    obterPoloMock.mockResolvedValue(poloCarregado)
    atualizarPoloMock.mockResolvedValue(poloCarregado)
    obterDadosDaUnidadeMock.mockResolvedValue(dadosDaUnidade)
  })

  it('preenche o formulário com os dados do GET', async () => {
    renderPoloForm(poloCarregado.uuid)

    expect(await screen.findByDisplayValue('OSC Teste')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Polo Teste')).toBeInTheDocument()
    expect(screen.getByLabelText(/^tipo$/i)).toHaveValue('pendente')
    expect(screen.getByLabelText(/^status$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/nome do polo/i)).toHaveAttribute('readonly')
    expect(screen.getByLabelText(/^código eol$/i)).toHaveAttribute('readonly')
    expect(
      screen.getByRole('button', { name: /consultar código eol/i }),
    ).toBeDisabled()
    expect(obterPoloMock).toHaveBeenCalledWith(poloCarregado.uuid)
  })

  it('exibe indicador de carregamento enquanto o GET não retorna', () => {
    obterPoloMock.mockImplementation(
      () =>
        new Promise(() => {
          /* pendente */
        }),
    )

    renderPoloForm(poloCarregado.uuid)

    expect(screen.getByText('Carregando polo parceiro...')).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Salvar' }),
    ).not.toBeInTheDocument()
  })

  it('abre confirmação, atualiza via PUT e redireciona', async () => {
    const usuario = criarUsuario()
    renderPoloForm(poloCarregado.uuid)

    const campoNomeOsc = await screen.findByLabelText(/nome da osc/i)
    await usuario.clear(campoNomeOsc)
    await usuario.type(campoNomeOsc, 'OSC Atualizada')
    await usuario.click(screen.getByRole('button', { name: 'Salvar' }))

    const modal = await screen.findByRole('dialog')
    expect(modal).toHaveTextContent(/deseja salvar as alterações/i)
    expect(atualizarPoloMock).not.toHaveBeenCalled()

    await usuario.click(
      within(modal).getByRole('button', { name: /^salvar$/i }),
    )

    await waitFor(() => {
      expect(atualizarPoloMock).toHaveBeenCalledWith(
        poloCarregado.uuid,
        expect.objectContaining({
          nomePolo: 'Polo Teste',
          nomeOsc: 'OSC Atualizada',
        }),
      )
    })

    expect(cadastrarPoloMock).not.toHaveBeenCalled()
    expect(await screen.findByText('Listagem de polos')).toBeInTheDocument()
    expect(screen.getByText('Polo atualizado')).toBeInTheDocument()
  })

  it('não chama PUT quando a confirmação é cancelada', async () => {
    const usuario = criarUsuario()
    renderPoloForm(poloCarregado.uuid)

    const campoNomeOsc = await screen.findByLabelText(/nome da osc/i)
    await usuario.clear(campoNomeOsc)
    await usuario.type(campoNomeOsc, 'OSC Atualizada')
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

    renderPoloForm(poloCarregado.uuid)

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

    renderPoloForm(poloCarregado.uuid)

    const campoNomeOsc = await screen.findByLabelText(/nome da osc/i)
    await usuario.clear(campoNomeOsc)
    await usuario.type(campoNomeOsc, 'OSC Alterada')
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
