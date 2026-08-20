import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { format, isValid, parse } from 'date-fns'
import { ptBR as dateFnsPtBR } from 'date-fns/locale'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ErroCadastroEdicaoPrograma } from '@/services/edicaoPrograma/api'
import { CadastroEdicaoForm } from './index'

const { cadastrarEdicaoProgramaMock } = vi.hoisted(() => ({
  cadastrarEdicaoProgramaMock: vi.fn(),
}))

vi.mock('@/services/edicaoPrograma/api', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('@/services/edicaoPrograma/api')>()

  return {
    ...actual,
    cadastrarEdicaoPrograma: cadastrarEdicaoProgramaMock,
  }
})

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
        name: deveVoltar
          ? /ir para o mês anterior/i
          : /ir para o próximo mês/i,
      }),
    )
  }

  throw new Error(`Não foi possível selecionar a data ${iso}`)
}

async function preencherFormularioValido(
  usuario: ReturnType<typeof userEvent.setup>,
) {
  await usuario.type(
    screen.getByLabelText(/nome da edição/i),
    'Edição Teste',
  )
  await escolherData(usuario, 'Data de início da edição', '2026-06-10')
  await escolherData(usuario, 'Data de fim da edição', '2026-06-20')
  await escolherData(usuario, 'Data de início das inscrições', '2026-05-01')
  await escolherData(usuario, 'Data de fim das inscrições', '2026-05-31')
}

function renderCadastroEdicaoForm() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/cadastrar-nova-edicao-programa']}>
        <Routes>
          <Route
            path="/cadastrar-nova-edicao-programa"
            element={<CadastroEdicaoForm />}
          />
          <Route
            path="/edicoes-programa"
            element={<p>Listagem de edições</p>}
          />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('CadastroEdicaoForm', () => {
  beforeEach(() => {
    cadastrarEdicaoProgramaMock.mockReset()
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

  it('renderiza os campos, o botão salvar desabilitado e o cancelar', () => {
    renderCadastroEdicaoForm()

    expect(
      screen.getByLabelText(/nome da edição/i),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Data de início da edição' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeDisabled()
    expect(
      screen.getByRole('button', { name: 'Cancelar' }),
    ).toBeInTheDocument()
  })

  it('mantém o botão salvar desabilitado até o formulário estar preenchido', async () => {
    const usuario = userEvent.setup()
    renderCadastroEdicaoForm()

    const botaoSalvar = screen.getByRole('button', { name: 'Salvar' })
    expect(botaoSalvar).toBeDisabled()

    await usuario.type(screen.getByLabelText(/nome da edição/i), 'Edição Teste')
    expect(botaoSalvar).toBeDisabled()

    await escolherData(usuario, 'Data de início da edição', '2026-06-10')
    await escolherData(usuario, 'Data de fim da edição', '2026-06-20')
    await escolherData(usuario, 'Data de início das inscrições', '2026-05-01')
    await escolherData(usuario, 'Data de fim das inscrições', '2026-05-31')

    expect(botaoSalvar).toBeEnabled()
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

    expect(
      await screen.findByText('Listagem de edições'),
    ).toBeInTheDocument()
  })

  it('exibe mensagem de erro quando o período da edição é inválido e bloqueia novo envio', async () => {
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
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeDisabled()
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

  it('exibe mensagem de erro quando o fim das inscrições é posterior ao início da edição', async () => {
    const usuario = userEvent.setup()
    renderCadastroEdicaoForm()

    await usuario.type(
      screen.getByLabelText(/nome da edição/i),
      'Edição Inválida',
    )
    await escolherData(usuario, 'Data de início da edição', '2026-06-01')
    await escolherData(usuario, 'Data de fim da edição', '2026-06-30')
    await escolherData(usuario, 'Data de início das inscrições', '2026-05-01')
    await escolherData(usuario, 'Data de fim das inscrições', '2026-06-15')
    await usuario.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(
      await screen.findByText(
        /não pode ser maior que o início do período da edição/i,
      ),
    ).toBeInTheDocument()
    expect(cadastrarEdicaoProgramaMock).not.toHaveBeenCalled()
  })

  it('exibe mensagem de erro quando o cadastro falha', async () => {
    const usuario = userEvent.setup()
    cadastrarEdicaoProgramaMock.mockRejectedValue(
      new ErroCadastroEdicaoPrograma('Já existe uma edição com este nome.'),
    )
    renderCadastroEdicaoForm()

    await preencherFormularioValido(usuario)
    await usuario.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Já existe uma edição com este nome.',
    )
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
    expect(
      await screen.findByText('Listagem de edições'),
    ).toBeInTheDocument()
  })
})
