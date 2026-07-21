import { render, screen, waitFor } from '@testing-library/react'

import userEvent from '@testing-library/user-event'

import { MemoryRouter } from 'react-router-dom'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ErroCadastroEdicaoPrograma } from '../../services/edicaoPrograma/api'

import PaginaCadastrarNovaEdicaoPrograma from './index'

vi.mock('../../components/MenuLateral', () => ({
  MenuLateral: () => <aside aria-label="menu lateral">Menu lateral</aside>,
}))

vi.mock('../../components/Cabecalho', () => ({
  Cabecalho: () => <header>Header principal</header>,
}))

vi.mock('../../components/MapaVisual', () => ({
  MapaVisual: () => <nav aria-label="Mapa do site">Mapa visual</nav>,
}))

const { cadastrarEdicaoProgramaMock, navegarMock } = vi.hoisted(() => ({
  cadastrarEdicaoProgramaMock: vi.fn(),

  navegarMock: vi.fn(),
}))

vi.mock('../../services/edicaoPrograma/api', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('../../services/edicaoPrograma/api')>()

  return {
    ...actual,

    cadastrarEdicaoPrograma: cadastrarEdicaoProgramaMock,
  }
})

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()

  return {
    ...actual,

    useNavigate: () => navegarMock,
  }
})

describe('PaginaCadastrarNovaEdicaoPrograma', () => {
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

    navegarMock.mockReset()
  })

  it('renderiza MenuLateral, Cabecalho, mapa visual e formulário', () => {
    render(
      <MemoryRouter>
        <PaginaCadastrarNovaEdicaoPrograma />
      </MemoryRouter>,
    )

    expect(screen.getByLabelText(/menu lateral/i)).toBeInTheDocument()

    expect(screen.getByText(/header principal/i)).toBeInTheDocument()

    expect(
      screen.getByRole('navigation', { name: /mapa do site/i }),
    ).toBeInTheDocument()

    expect(screen.getByRole('button', { name: /salvar/i })).toBeDisabled()

    expect(
      screen.getByRole('button', { name: /cancelar/i }),
    ).toBeInTheDocument()
  })

  it('mantém o botão salvar desabilitado até o formulário estar preenchido', async () => {
    const usuario = userEvent.setup()

    render(
      <MemoryRouter>
        <PaginaCadastrarNovaEdicaoPrograma />
      </MemoryRouter>,
    )

    const botaoSalvar = screen.getByRole('button', { name: /salvar/i })
    expect(botaoSalvar).toBeDisabled()

    await usuario.type(screen.getByLabelText(/nome da edição/i), 'Edição Teste')
    expect(botaoSalvar).toBeDisabled()

    await usuario.type(
      screen.getByLabelText(/data de início da edição/i),
      '2026-06-10',
    )
    await usuario.type(
      screen.getByLabelText(/data de fim da edição/i),
      '2026-06-20',
    )
    await usuario.type(
      screen.getByLabelText(/data de início das inscrições/i),
      '2026-05-01',
    )
    await usuario.type(
      screen.getByLabelText(/data de fim das inscrições/i),
      '2026-05-31',
    )

    expect(botaoSalvar).toBeEnabled()
  })

  it('cadastra nova edição via API e redireciona para a listagem', async () => {
    const usuario = userEvent.setup()

    render(
      <MemoryRouter>
        <PaginaCadastrarNovaEdicaoPrograma />
      </MemoryRouter>,
    )

    await usuario.type(screen.getByLabelText(/nome da edição/i), 'Edição Teste')

    await usuario.type(
      screen.getByLabelText(/data de início da edição/i),
      '2026-06-10',
    )

    await usuario.type(
      screen.getByLabelText(/data de fim da edição/i),
      '2026-06-20',
    )

    await usuario.type(
      screen.getByLabelText(/data de início das inscrições/i),

      '2026-05-01',
    )

    await usuario.type(
      screen.getByLabelText(/data de fim das inscrições/i),
      '2026-05-31',
    )

    await usuario.click(screen.getByRole('button', { name: /salvar/i }))

    await waitFor(() => {
      expect(cadastrarEdicaoProgramaMock).toHaveBeenCalledWith({
        nome: 'Edição Teste',

        dataInicioEdicao: '2026-06-10',

        dataFimEdicao: '2026-06-20',

        dataInicioInscricoes: '2026-05-01',

        dataFimInscricoes: '2026-05-31',
      })
    })

    expect(navegarMock).toHaveBeenCalledWith('/edicoes-programa', {
      state: { edicaoCadastrada: true },
    })
  })

  it('exibe mensagem de erro quando o período da edição é inválido', async () => {
    const usuario = userEvent.setup()

    render(
      <MemoryRouter>
        <PaginaCadastrarNovaEdicaoPrograma />
      </MemoryRouter>,
    )

    await usuario.type(
      screen.getByLabelText(/nome da edição/i),
      'Edição Inválida',
    )
    await usuario.type(
      screen.getByLabelText(/data de início da edição/i),
      '2026-06-20',
    )
    await usuario.type(
      screen.getByLabelText(/data de fim da edição/i),
      '2026-06-10',
    )
    await usuario.type(
      screen.getByLabelText(/data de início das inscrições/i),
      '2026-05-01',
    )
    await usuario.type(
      screen.getByLabelText(/data de fim das inscrições/i),
      '2026-05-31',
    )
    await usuario.click(screen.getByRole('button', { name: /salvar/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /data "de" não pode ser maior que a data "até"/i,
    )
    expect(cadastrarEdicaoProgramaMock).not.toHaveBeenCalled()
    expect(navegarMock).not.toHaveBeenCalled()
  })

  it('exibe mensagem de erro quando o período das inscrições é inválido', async () => {
    const usuario = userEvent.setup()

    render(
      <MemoryRouter>
        <PaginaCadastrarNovaEdicaoPrograma />
      </MemoryRouter>,
    )

    await usuario.type(
      screen.getByLabelText(/nome da edição/i),
      'Edição Inválida',
    )
    await usuario.type(
      screen.getByLabelText(/data de início da edição/i),
      '2026-06-01',
    )
    await usuario.type(
      screen.getByLabelText(/data de fim da edição/i),
      '2026-06-30',
    )
    await usuario.type(
      screen.getByLabelText(/data de início das inscrições/i),
      '2026-05-31',
    )
    await usuario.type(
      screen.getByLabelText(/data de fim das inscrições/i),
      '2026-05-01',
    )
    await usuario.click(screen.getByRole('button', { name: /salvar/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /período das inscrições/i,
    )
    expect(cadastrarEdicaoProgramaMock).not.toHaveBeenCalled()
    expect(navegarMock).not.toHaveBeenCalled()
  })

  it('exibe mensagem de erro quando o fim das inscrições é posterior ao início da edição', async () => {
    const usuario = userEvent.setup()

    render(
      <MemoryRouter>
        <PaginaCadastrarNovaEdicaoPrograma />
      </MemoryRouter>,
    )

    await usuario.type(
      screen.getByLabelText(/nome da edição/i),
      'Edição Inválida',
    )
    await usuario.type(
      screen.getByLabelText(/data de início da edição/i),
      '2026-06-01',
    )
    await usuario.type(
      screen.getByLabelText(/data de fim da edição/i),
      '2026-06-30',
    )
    await usuario.type(
      screen.getByLabelText(/data de início das inscrições/i),
      '2026-05-01',
    )
    await usuario.type(
      screen.getByLabelText(/data de fim das inscrições/i),
      '2026-06-15',
    )
    await usuario.click(screen.getByRole('button', { name: /salvar/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /não pode ser maior que o início do período da edição/i,
    )
    expect(cadastrarEdicaoProgramaMock).not.toHaveBeenCalled()
    expect(navegarMock).not.toHaveBeenCalled()
  })

  it('exibe mensagem de erro quando o cadastro falha', async () => {
    const usuario = userEvent.setup()

    cadastrarEdicaoProgramaMock.mockRejectedValue(
      new ErroCadastroEdicaoPrograma('Já existe uma edição com este nome.'),
    )

    render(
      <MemoryRouter>
        <PaginaCadastrarNovaEdicaoPrograma />
      </MemoryRouter>,
    )

    await usuario.type(
      screen.getByLabelText(/nome da edição/i),
      'Edição Duplicada',
    )

    await usuario.type(
      screen.getByLabelText(/data de início da edição/i),
      '2026-06-10',
    )

    await usuario.type(
      screen.getByLabelText(/data de fim da edição/i),
      '2026-06-20',
    )

    await usuario.type(
      screen.getByLabelText(/data de início das inscrições/i),

      '2026-05-01',
    )

    await usuario.type(
      screen.getByLabelText(/data de fim das inscrições/i),
      '2026-05-31',
    )

    await usuario.click(screen.getByRole('button', { name: /salvar/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Já existe uma edição com este nome.',
    )

    expect(navegarMock).not.toHaveBeenCalled()
  })
})
