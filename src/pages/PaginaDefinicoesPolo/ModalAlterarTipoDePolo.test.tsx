import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { OPCOES_TIPO_POLO_ALTERACAO_MOCK } from '../../services/definicaoPolo/mocks'

import { ModalAlterarTipoDePolo } from './ModalAlterarTipoDePolo'

describe('ModalAlterarTipoDePolo', () => {
  it('não renderiza quando aberto é false', () => {
    render(
      <ModalAlterarTipoDePolo
        aberto={false}
        onFechar={vi.fn()}
        onAlterar={vi.fn()}
      />,
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('exibe opções de OPCOES_TIPO_POLO_ALTERACAO_MOCK', () => {
    render(
      <ModalAlterarTipoDePolo aberto onFechar={vi.fn()} onAlterar={vi.fn()} />,
    )

    expect(screen.getByRole('dialog')).toBeInTheDocument()

    for (const opcao of OPCOES_TIPO_POLO_ALTERACAO_MOCK) {
      expect(
        screen.getByRole('option', { name: opcao.rotulo }),
      ).toBeInTheDocument()
    }
  })

  it('fecha ao pressionar Escape', async () => {
    const usuario = userEvent.setup()
    const onFechar = vi.fn()

    render(
      <ModalAlterarTipoDePolo aberto onFechar={onFechar} onAlterar={vi.fn()} />,
    )

    await usuario.keyboard('{Escape}')

    expect(onFechar).toHaveBeenCalledTimes(1)
  })

  it('não fecha com Escape quando estaSalvando', async () => {
    const usuario = userEvent.setup()
    const onFechar = vi.fn()

    render(
      <ModalAlterarTipoDePolo
        aberto
        estaSalvando
        onFechar={onFechar}
        onAlterar={vi.fn()}
      />,
    )

    await usuario.keyboard('{Escape}')

    expect(onFechar).not.toHaveBeenCalled()
  })

  it('fecha ao clicar na sobreposição', async () => {
    const usuario = userEvent.setup()
    const onFechar = vi.fn()

    render(
      <ModalAlterarTipoDePolo aberto onFechar={onFechar} onAlterar={vi.fn()} />,
    )

    const dialog = screen.getByRole('dialog')
    await usuario.click(dialog.parentElement!)

    expect(onFechar).toHaveBeenCalledTimes(1)
  })

  it('não fecha ao clicar na sobreposição quando estaSalvando', async () => {
    const usuario = userEvent.setup()
    const onFechar = vi.fn()

    render(
      <ModalAlterarTipoDePolo
        aberto
        estaSalvando
        onFechar={onFechar}
        onAlterar={vi.fn()}
      />,
    )

    const dialog = screen.getByRole('dialog')
    await usuario.click(dialog.parentElement!)

    expect(onFechar).not.toHaveBeenCalled()
  })

  it('desabilita Alterar sem seleção de tipo', () => {
    render(
      <ModalAlterarTipoDePolo aberto onFechar={vi.fn()} onAlterar={vi.fn()} />,
    )

    expect(screen.getByRole('button', { name: /^alterar$/i })).toBeDisabled()
  })

  it('chama onAlterar com o tipo selecionado', async () => {
    const usuario = userEvent.setup()
    const onAlterar = vi.fn()

    render(
      <ModalAlterarTipoDePolo
        aberto
        onFechar={vi.fn()}
        onAlterar={onAlterar}
      />,
    )

    await usuario.selectOptions(
      screen.getByLabelText(/selecione o tipo de polo/i),
      'Polo oficial',
    )
    await usuario.click(screen.getByRole('button', { name: /^alterar$/i }))

    expect(onAlterar).toHaveBeenCalledWith('Polo oficial')
  })

  it('exibe mensagemErro com role alert', () => {
    render(
      <ModalAlterarTipoDePolo
        aberto
        mensagemErro="Não foi possível alterar o tipo."
        onFechar={vi.fn()}
        onAlterar={vi.fn()}
      />,
    )

    expect(screen.getByRole('alert')).toHaveTextContent(
      /não foi possível alterar o tipo/i,
    )
  })

  it('exibe texto Alterando... quando estaSalvando', () => {
    render(
      <ModalAlterarTipoDePolo
        aberto
        estaSalvando
        onFechar={vi.fn()}
        onAlterar={vi.fn()}
      />,
    )

    expect(screen.getByRole('button', { name: /alterando/i })).toBeDisabled()
  })
})
