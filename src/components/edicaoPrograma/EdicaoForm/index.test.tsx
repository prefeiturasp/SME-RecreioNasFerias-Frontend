import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { format, isValid, parse } from 'date-fns'
import { ptBR as dateFnsPtBR } from 'date-fns/locale'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { EdicaoPrograma } from '@/services/edicaoPrograma/types'
import { EdicaoForm } from './index'

const {
  cadastrarEdicaoProgramaMock,
  obterEdicaoProgramaMock,
  atualizarEdicaoProgramaMock,
} = vi.hoisted(() => ({
  cadastrarEdicaoProgramaMock: vi.fn(),
  obterEdicaoProgramaMock: vi.fn(),
  atualizarEdicaoProgramaMock: vi.fn(),
}))

vi.mock(
  '@/services/edicaoPrograma/cadastrarEdicaoPrograma',
  async (importOriginal) => {
    const actual =
      await importOriginal<
        typeof import('@/services/edicaoPrograma/cadastrarEdicaoPrograma')
      >()

    return {
      ...actual,
      cadastrarEdicaoPrograma: cadastrarEdicaoProgramaMock,
    }
  },
)

vi.mock(
  '@/services/edicaoPrograma/obterEdicaoPrograma',
  async (importOriginal) => {
    const actual =
      await importOriginal<
        typeof import('@/services/edicaoPrograma/obterEdicaoPrograma')
      >()

    return {
      ...actual,
      obterEdicaoPrograma: obterEdicaoProgramaMock,
    }
  },
)

vi.mock(
  '@/services/edicaoPrograma/atualizarEdicaoPrograma',
  async (importOriginal) => {
    const actual =
      await importOriginal<
        typeof import('@/services/edicaoPrograma/atualizarEdicaoPrograma')
      >()

    return {
      ...actual,
      atualizarEdicaoPrograma: atualizarEdicaoProgramaMock,
    }
  },
)

const edicaoCarregada: EdicaoPrograma = {
  id: '11111111-1111-1111-1111-111111111111',
  nome: 'Edição Teste',
  dataInicioEdicao: '2026-06-10',
  dataFimEdicao: '2026-06-20',
  dataInicioInscricoes: '2026-05-01',
  dataFimInscricoes: '2026-05-31',
  quantidadeInscritos: 50,
  quantidadeAtendimentoEfetivo: 40,
  quantidadePasseios: 5,
  quantidadeApresentacoes: 2,
}

function parseIsoLocal(iso: string) {
  const [ano, mes, dia] = iso.split('-').map(Number)
  return new Date(ano, mes - 1, dia)
}

async function escolherData(
  usuario: ReturnType<typeof userEvent.setup>,
  rotulo: string,
  iso: string,
) {
  const alvo = parseIsoLocal(iso)
  const dataDay = format(alvo, 'dd/MM/yyyy')
  await usuario.click(screen.getByRole('button', { name: rotulo }))

  for (let tentativa = 0; tentativa < 36; tentativa += 1) {
    const botaoDia = document.querySelector(`[data-day="${dataDay}"]`)

    if (botaoDia instanceof HTMLElement) {
      await usuario.click(botaoDia)
      return
    }

    const rotuloMes = screen.getByRole('grid').getAttribute('aria-label') ?? ''
    const mesVisivel = parse(rotuloMes, 'MMMM yyyy', new Date(), {
      locale: dateFnsPtBR,
    })

    const deveVoltar =
      !isValid(mesVisivel) ||
      mesVisivel.getFullYear() > alvo.getFullYear() ||
      (mesVisivel.getFullYear() === alvo.getFullYear() &&
        mesVisivel.getMonth() > alvo.getMonth())

    await usuario.click(
      screen.getByRole('button', {
        name: deveVoltar ? /ir para o mês anterior/i : /ir para o próximo mês/i,
      }),
    )
  }

  throw new Error(`Não foi possível selecionar a data ${iso}`)
}

async function preencherFormularioValido(
  usuario: ReturnType<typeof userEvent.setup>,
) {
  await usuario.type(screen.getByLabelText(/nome da edição/i), 'Edição Teste')
  await escolherData(usuario, 'Data de início da edição', '2026-06-10')
  await escolherData(usuario, 'Data de fim da edição', '2026-06-20')
  await escolherData(usuario, 'Data de início das inscrições', '2026-05-01')
  await escolherData(usuario, 'Data de fim das inscrições', '2026-05-31')
}

function ListagemEdicoesStub() {
  const location = useLocation()
  const estado = location.state as {
    edicaoCadastrada?: boolean
    edicaoAtualizada?: boolean
  } | null

  return (
    <div>
      <p>Listagem de edições</p>
      {estado?.edicaoCadastrada ? <p>Edição cadastrada</p> : null}
      {estado?.edicaoAtualizada ? <p>Edição atualizada</p> : null}
    </div>
  )
}

function renderEdicaoForm(edicaoId?: string) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  const rotaInicial = edicaoId
    ? `/editar-edicao-programa/${edicaoId}`
    : '/cadastrar-nova-edicao-programa'

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[rotaInicial]}>
        <Routes>
          <Route
            path="/cadastrar-nova-edicao-programa"
            element={<EdicaoForm />}
          />
          <Route
            path="/editar-edicao-programa/:idEdicao"
            element={<EdicaoForm edicaoId={edicaoId} />}
          />
          <Route path="/edicoes-programa" element={<ListagemEdicoesStub />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

function renderCadastroEdicaoForm() {
  return renderEdicaoForm()
}

describe('EdicaoForm', () => {
  beforeEach(() => {
    cadastrarEdicaoProgramaMock.mockReset()
    obterEdicaoProgramaMock.mockReset()
    atualizarEdicaoProgramaMock.mockReset()
    cadastrarEdicaoProgramaMock.mockResolvedValue({
      id: '1',
      nome: 'Edição Teste',
      dataInicioEdicao: '2026-06-10',
      dataFimEdicao: '2026-06-20',
      dataInicioInscricoes: '2026-05-01',
      dataFimInscricoes: '2026-05-31',
      quantidadeInscritos: 0,
      quantidadeAtendimentoEfetivo: 0,
      quantidadePasseios: 0,
      quantidadeApresentacoes: 0,
    })
  })

  it('renderiza os campos, o botão salvar e o cancelar', () => {
    renderCadastroEdicaoForm()

    expect(screen.getByLabelText(/nome da edição/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Data de início da edição' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument()
  })

  it('exibe erros de validação quando os campos estão vazios', async () => {
    const usuario = userEvent.setup()
    renderCadastroEdicaoForm()

    await usuario.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(
      await screen.findByText('Nome da edição é obrigatório'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Data de início da edição é obrigatória'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Data de fim da edição é obrigatória'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Data de início das inscrições é obrigatória'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Data de fim das inscrições é obrigatória'),
    ).toBeInTheDocument()
    expect(cadastrarEdicaoProgramaMock).not.toHaveBeenCalled()
  })

  it('cadastra nova edição via API e redireciona para a listagem', async () => {
    const usuario = userEvent.setup()
    renderCadastroEdicaoForm()

    await preencherFormularioValido(usuario)
    await usuario.click(screen.getByRole('button', { name: 'Salvar' }))

    await waitFor(() => {
      expect(cadastrarEdicaoProgramaMock).toHaveBeenCalledWith(
        {
          nome: 'Edição Teste',
          dataInicioEdicao: '2026-06-10',
          dataFimEdicao: '2026-06-20',
          dataInicioInscricoes: '2026-05-01',
          dataFimInscricoes: '2026-05-31',
        },
        expect.objectContaining({
          client: expect.any(QueryClient),
        }),
      )
    })

    expect(await screen.findByText('Listagem de edições')).toBeInTheDocument()
    expect(screen.getByText('Edição cadastrada')).toBeInTheDocument()
    expect(screen.queryByText('Edição atualizada')).not.toBeInTheDocument()
  })

  it('exibe mensagem de erro quando o período da edição é inválido', async () => {
    const usuario = userEvent.setup()
    renderCadastroEdicaoForm()

    await usuario.type(
      screen.getByLabelText(/nome da edição/i),
      'Edição Inválida',
    )
    await escolherData(usuario, 'Data de início da edição', '2026-06-20')
    await escolherData(usuario, 'Data de fim da edição', '2026-06-10')
    await escolherData(usuario, 'Data de início das inscrições', '2026-05-01')
    await escolherData(usuario, 'Data de fim das inscrições', '2026-05-31')
    await usuario.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(
      await screen.findByText(/data "de" não pode ser maior que a data "até"/i),
    ).toBeInTheDocument()
    expect(cadastrarEdicaoProgramaMock).not.toHaveBeenCalled()
  })

  it('exibe mensagem de erro quando o período das inscrições é inválido', async () => {
    const usuario = userEvent.setup()
    renderCadastroEdicaoForm()

    await usuario.type(
      screen.getByLabelText(/nome da edição/i),
      'Edição Inválida',
    )
    await escolherData(usuario, 'Data de início da edição', '2026-06-01')
    await escolherData(usuario, 'Data de fim da edição', '2026-06-30')
    await escolherData(usuario, 'Data de início das inscrições', '2026-05-31')
    await escolherData(usuario, 'Data de fim das inscrições', '2026-05-01')
    await usuario.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(
      await screen.findByText(
        /no período das inscrições, a data "de" não pode ser maior que a data "até"/i,
      ),
    ).toBeInTheDocument()
    expect(cadastrarEdicaoProgramaMock).not.toHaveBeenCalled()
  })

  it('exibe mensagem de erro quando o fim das inscrições é posterior ao fim da edição', async () => {
    const usuario = userEvent.setup()
    renderCadastroEdicaoForm()

    await usuario.type(
      screen.getByLabelText(/nome da edição/i),
      'Edição Inválida',
    )
    await escolherData(usuario, 'Data de início da edição', '2026-06-01')
    await escolherData(usuario, 'Data de fim da edição', '2026-06-30')
    await escolherData(usuario, 'Data de início das inscrições', '2026-05-01')
    await escolherData(usuario, 'Data de fim das inscrições', '2026-07-01')
    await usuario.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(
      await screen.findByText(/não pode ser posterior à data fim da edição/i),
    ).toBeInTheDocument()
    expect(cadastrarEdicaoProgramaMock).not.toHaveBeenCalled()
  })

  it('exibe mensagem de erro quando o cadastro falha', async () => {
    const usuario = userEvent.setup()
    cadastrarEdicaoProgramaMock.mockRejectedValue({
      response: { data: { detalhe: 'Já existe uma edição com este nome.' } },
    })
    renderCadastroEdicaoForm()

    await preencherFormularioValido(usuario)
    await usuario.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Já existe uma edição com este nome.',
    )
    expect(screen.queryByText('Listagem de edições')).not.toBeInTheDocument()
  })

  it('não exibe alerta quando o backend não envia detalhe', async () => {
    const usuario = userEvent.setup()
    cadastrarEdicaoProgramaMock.mockRejectedValue({
      response: { data: {} },
    })
    renderCadastroEdicaoForm()

    await preencherFormularioValido(usuario)
    await usuario.click(screen.getByRole('button', { name: 'Salvar' }))

    await waitFor(() => {
      expect(cadastrarEdicaoProgramaMock).toHaveBeenCalled()
    })
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.queryByText('Listagem de edições')).not.toBeInTheDocument()
  })

  it('indica carregamento e bloqueia novo envio enquanto aguarda', async () => {
    const usuario = userEvent.setup()
    let resolver!: () => void
    cadastrarEdicaoProgramaMock.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolver = () =>
            resolve({
              id: '1',
              nome: 'Edição Teste',
              dataInicioEdicao: '2026-06-10',
              dataFimEdicao: '2026-06-20',
              dataInicioInscricoes: '2026-05-01',
              dataFimInscricoes: '2026-05-31',
              quantidadeInscritos: 0,
              quantidadeAtendimentoEfetivo: 0,
              quantidadePasseios: 0,
              quantidadeApresentacoes: 0,
            })
        }),
    )

    renderCadastroEdicaoForm()
    await preencherFormularioValido(usuario)
    await usuario.click(screen.getByRole('button', { name: 'Salvar' }))

    const botao = screen.getByRole('button', { name: 'Salvando...' })
    expect(botao).toBeDisabled()

    resolver()
    expect(await screen.findByText('Listagem de edições')).toBeInTheDocument()
  })
})

describe('EdicaoForm em edição', () => {
  beforeEach(() => {
    cadastrarEdicaoProgramaMock.mockReset()
    obterEdicaoProgramaMock.mockReset()
    atualizarEdicaoProgramaMock.mockReset()
    obterEdicaoProgramaMock.mockResolvedValue(edicaoCarregada)
    atualizarEdicaoProgramaMock.mockResolvedValue(edicaoCarregada)
  })

  it('preenche o formulário com os dados do GET', async () => {
    renderEdicaoForm(edicaoCarregada.id)

    expect(await screen.findByDisplayValue('Edição Teste')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Data de início da edição' }),
    ).toHaveTextContent('10/06/2026')
    expect(
      screen.getByRole('button', { name: 'Data de fim da edição' }),
    ).toHaveTextContent('20/06/2026')
    expect(
      screen.getByRole('button', { name: 'Data de início das inscrições' }),
    ).toHaveTextContent('01/05/2026')
    expect(
      screen.getByRole('button', { name: 'Data de fim das inscrições' }),
    ).toHaveTextContent('31/05/2026')
    expect(screen.getByLabelText(/quantidade de inscritos/i)).toHaveValue(50)
    expect(
      screen.getByLabelText(/quantidade de atendimento efetivo/i),
    ).toHaveValue(40)
    expect(screen.getByLabelText(/quantidade de passeios/i)).toHaveValue(5)
    expect(screen.getByLabelText(/quantidade de apresentações/i)).toHaveValue(2)
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeEnabled()
    expect(obterEdicaoProgramaMock).toHaveBeenCalledWith(edicaoCarregada.id)
  })

  it('exibe indicador de carregamento enquanto o GET não retorna', () => {
    obterEdicaoProgramaMock.mockImplementation(
      () =>
        new Promise(() => {
          /* pendente */
        }),
    )

    renderEdicaoForm(edicaoCarregada.id)

    expect(
      screen.getByText('Carregando edição do programa...'),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Salvar' }),
    ).not.toBeInTheDocument()
  })

  it('atualiza a edição via PUT e redireciona com toast de atualização', async () => {
    const usuario = userEvent.setup()
    renderEdicaoForm(edicaoCarregada.id)

    const campoNome = await screen.findByLabelText(/nome da edição/i)
    await usuario.clear(campoNome)
    await usuario.type(campoNome, 'Edição Atualizada')
    await usuario.click(screen.getByRole('button', { name: 'Salvar' }))

    await waitFor(() => {
      expect(atualizarEdicaoProgramaMock).toHaveBeenCalledWith(
        edicaoCarregada.id,
        {
          nome: 'Edição Atualizada',
          dataInicioEdicao: '2026-06-10',
          dataFimEdicao: '2026-06-20',
          dataInicioInscricoes: '2026-05-01',
          dataFimInscricoes: '2026-05-31',
        },
      )
    })

    expect(cadastrarEdicaoProgramaMock).not.toHaveBeenCalled()
    expect(await screen.findByText('Listagem de edições')).toBeInTheDocument()
    expect(screen.getByText('Edição atualizada')).toBeInTheDocument()
    expect(screen.queryByText('Edição cadastrada')).not.toBeInTheDocument()
  })

  it('exibe mensagem de erro quando a consulta falha', async () => {
    obterEdicaoProgramaMock.mockRejectedValue({
      response: { data: { detalhe: 'Edição não encontrada.' } },
    })

    renderEdicaoForm(edicaoCarregada.id)

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Edição não encontrada.',
    )
    expect(
      screen.queryByRole('button', { name: 'Salvar' }),
    ).not.toBeInTheDocument()
  })

  it('não exibe alerta quando o GET não envia detalhe', async () => {
    obterEdicaoProgramaMock.mockRejectedValue({
      response: { data: {} },
    })

    renderEdicaoForm(edicaoCarregada.id)

    await waitFor(() => {
      expect(obterEdicaoProgramaMock).toHaveBeenCalled()
    })
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Salvar' }),
    ).not.toBeInTheDocument()
  })

  it('exibe mensagem de erro quando a atualização falha', async () => {
    const usuario = userEvent.setup()
    atualizarEdicaoProgramaMock.mockRejectedValue({
      response: { data: { detalhe: 'Não foi possível salvar a edição.' } },
    })

    renderEdicaoForm(edicaoCarregada.id)

    const campoNome = await screen.findByLabelText(/nome da edição/i)
    await usuario.clear(campoNome)
    await usuario.type(campoNome, 'Edição Alterada')
    await usuario.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Não foi possível salvar a edição.',
    )
    expect(screen.queryByText('Listagem de edições')).not.toBeInTheDocument()
  })

  it('não exibe alerta quando o PUT não envia detalhe', async () => {
    const usuario = userEvent.setup()
    atualizarEdicaoProgramaMock.mockRejectedValue({
      response: { data: {} },
    })

    renderEdicaoForm(edicaoCarregada.id)

    const campoNome = await screen.findByLabelText(/nome da edição/i)
    await usuario.clear(campoNome)
    await usuario.type(campoNome, 'Edição Alterada')
    await usuario.click(screen.getByRole('button', { name: 'Salvar' }))

    await waitFor(() => {
      expect(atualizarEdicaoProgramaMock).toHaveBeenCalled()
    })
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.queryByText('Listagem de edições')).not.toBeInTheDocument()
  })
})
