import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ModalAlterarEdicaoDoPolo } from './ModalAlterarEdicaoDoPolo'

const { listarEdicoesProgramaMock } = vi.hoisted(() => ({
  listarEdicoesProgramaMock: vi.fn(),
}))

vi.mock('../../services/edicaoPrograma/api', () => ({
  listarEdicoesPrograma: listarEdicoesProgramaMock,
}))

describe('ModalAlterarEdicaoDoPolo', () => {
  beforeEach(() => {
    listarEdicoesProgramaMock.mockReset()
    listarEdicoesProgramaMock.mockResolvedValue({
      edicoes: [
        {
          id: '1',
          nome: 'Janeiro 2025',
          dataInicioEdicao: '2025-01-01',
          dataFimEdicao: '2025-01-31',
          dataInicioInscricoes: '2024-12-01',
          dataFimInscricoes: '2024-12-20',
          quantidadeInscritos: 0,
          quantidadeAtendimentoEfetivo: 0,
          quantidadePasseios: 0,
          quantidadeApresentacoes: 0,
        },
        {
          id: '2',
          nome: 'Julho 2025',
          dataInicioEdicao: '2025-07-01',
          dataFimEdicao: '2025-07-31',
          dataInicioInscricoes: '2025-06-01',
          dataFimInscricoes: '2025-06-20',
          quantidadeInscritos: 0,
          quantidadeAtendimentoEfetivo: 0,
          quantidadePasseios: 0,
          quantidadeApresentacoes: 0,
        },
      ],
      pagina: 1,
      tamanhoPagina: 100,
      total: 2,
      totalPaginas: 1,
    })
  })

  it('não renderiza quando aberto é false', () => {
    render(
      <ModalAlterarEdicaoDoPolo
        aberto={false}
        onFechar={vi.fn()}
        onAlterar={vi.fn()}
      />,
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('carrega opções incluindo "-"', async () => {
    render(
      <ModalAlterarEdicaoDoPolo
        aberto
        onFechar={vi.fn()}
        onAlterar={vi.fn()}
      />,
    )

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(await screen.findByLabelText(/selecione o nome da edição/i)).toBeInTheDocument()

    expect(screen.getByRole('option', { name: '-' })).toBeInTheDocument()
    expect(
      screen.getByRole('option', { name: /janeiro 2025/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('option', { name: /julho 2025/i }),
    ).toBeInTheDocument()
  })

  it('mantém opção "-" quando a API falha', async () => {
    listarEdicoesProgramaMock.mockRejectedValue(new Error('falha'))

    render(
      <ModalAlterarEdicaoDoPolo
        aberto
        onFechar={vi.fn()}
        onAlterar={vi.fn()}
      />,
    )

    expect(await screen.findByRole('option', { name: '-' })).toBeInTheDocument()
    expect(
      screen.queryByRole('option', { name: /janeiro 2025/i }),
    ).not.toBeInTheDocument()
  })

  it('fecha ao pressionar Escape', async () => {
    const usuario = userEvent.setup()
    const onFechar = vi.fn()

    render(
      <ModalAlterarEdicaoDoPolo
        aberto
        onFechar={onFechar}
        onAlterar={vi.fn()}
      />,
    )

    await screen.findByLabelText(/selecione o nome da edição/i)
    await usuario.keyboard('{Escape}')

    expect(onFechar).toHaveBeenCalledTimes(1)
  })

  it('não fecha com Escape quando estaSalvando', async () => {
    const usuario = userEvent.setup()
    const onFechar = vi.fn()

    render(
      <ModalAlterarEdicaoDoPolo
        aberto
        estaSalvando
        onFechar={onFechar}
        onAlterar={vi.fn()}
      />,
    )

    await screen.findByLabelText(/selecione o nome da edição/i)
    await usuario.keyboard('{Escape}')

    expect(onFechar).not.toHaveBeenCalled()
  })

  it('fecha ao clicar na sobreposição', async () => {
    const usuario = userEvent.setup()
    const onFechar = vi.fn()

    render(
      <ModalAlterarEdicaoDoPolo
        aberto
        onFechar={onFechar}
        onAlterar={vi.fn()}
      />,
    )

    await screen.findByLabelText(/selecione o nome da edição/i)

    const dialog = screen.getByRole('dialog')
    await usuario.click(dialog.parentElement!)

    expect(onFechar).toHaveBeenCalledTimes(1)
  })

  it('não fecha ao clicar na sobreposição quando estaSalvando', async () => {
    const usuario = userEvent.setup()
    const onFechar = vi.fn()

    render(
      <ModalAlterarEdicaoDoPolo
        aberto
        estaSalvando
        onFechar={onFechar}
        onAlterar={vi.fn()}
      />,
    )

    await screen.findByLabelText(/selecione o nome da edição/i)

    const dialog = screen.getByRole('dialog')
    await usuario.click(dialog.parentElement!)

    expect(onFechar).not.toHaveBeenCalled()
  })

  it('desabilita Alterar sem seleção de edição', async () => {
    render(
      <ModalAlterarEdicaoDoPolo
        aberto
        onFechar={vi.fn()}
        onAlterar={vi.fn()}
      />,
    )

    await screen.findByLabelText(/selecione o nome da edição/i)

    expect(screen.getByRole('button', { name: /^alterar$/i })).toBeDisabled()
  })

  it('chama onAlterar com a edição selecionada', async () => {
    const usuario = userEvent.setup()
    const onAlterar = vi.fn()

    render(
      <ModalAlterarEdicaoDoPolo
        aberto
        onFechar={vi.fn()}
        onAlterar={onAlterar}
      />,
    )

    await screen.findByLabelText(/selecione o nome da edição/i)
    await usuario.selectOptions(
      screen.getByLabelText(/selecione o nome da edição/i),
      'Janeiro 2025',
    )
    await usuario.click(screen.getByRole('button', { name: /^alterar$/i }))

    expect(onAlterar).toHaveBeenCalledWith('Janeiro 2025')
  })

  it('exibe mensagemErro com role alert', async () => {
    render(
      <ModalAlterarEdicaoDoPolo
        aberto
        mensagemErro="Não foi possível alterar a edição."
        onFechar={vi.fn()}
        onAlterar={vi.fn()}
      />,
    )

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        /não foi possível alterar a edição/i,
      )
    })
  })
})
