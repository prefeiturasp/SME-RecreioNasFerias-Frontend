import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { OPCOES_TIPO_POLO_ALTERACAO_MOCK } from '@/services/definicaoPolo/mocks'
import { ModalAlterarSelecao } from './index'

const propsModalPadrao = {
  titulo: 'Alterar valor',
  descricao: 'Selecione o valor desejado:',
  rotuloCampo: 'Selecione o valor',
  idCampo: 'modal-valor',
  textoOpcaoVazia: 'Selecione o valor',
  opcoes: [
    { valor: 'opcao-a', rotulo: 'Opção A' },
    { valor: 'opcao-b', rotulo: 'Opção B' },
  ],
  onFechar: vi.fn(),
  onAlterar: vi.fn(),
}

function renderModalAlterarSelecao(
  props: Partial<typeof propsModalPadrao & { aberto: boolean }> = {},
) {
  return render(
    <ModalAlterarSelecao
      aberto={props.aberto ?? true}
      {...propsModalPadrao}
      {...props}
    />,
  )
}

describe('ModalAlterarSelecao', () => {
  it('não renderiza quando aberto é false', () => {
    renderModalAlterarSelecao({ aberto: false })

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('exibe opções informadas', () => {
    renderModalAlterarSelecao()

    expect(screen.getByRole('option', { name: 'Opção A' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Opção B' })).toBeInTheDocument()
  })

  it('fecha ao pressionar Escape', async () => {
    const usuario = userEvent.setup()
    const onFechar = vi.fn()

    renderModalAlterarSelecao({ onFechar })

    await usuario.keyboard('{Escape}')

    expect(onFechar).toHaveBeenCalledTimes(1)
  })

  it('não fecha com Escape quando estaSalvando', async () => {
    const usuario = userEvent.setup()
    const onFechar = vi.fn()

    render(
      <ModalAlterarSelecao
        aberto
        estaSalvando
        {...propsModalPadrao}
        onFechar={onFechar}
      />,
    )

    await usuario.keyboard('{Escape}')

    expect(onFechar).not.toHaveBeenCalled()
  })

  it('desabilita Alterar sem seleção', () => {
    renderModalAlterarSelecao()

    expect(screen.getByRole('button', { name: /^alterar$/i })).toBeDisabled()
  })

  it('chama onAlterar com o valor selecionado', async () => {
    const usuario = userEvent.setup()
    const onAlterar = vi.fn()

    renderModalAlterarSelecao({ onAlterar })

    await usuario.selectOptions(
      screen.getByLabelText(/selecione o valor/i),
      'opcao-a',
    )
    await usuario.click(screen.getByRole('button', { name: /^alterar$/i }))

    expect(onAlterar).toHaveBeenCalledWith('opcao-a')
  })

  it('exibe mensagemErro com role alert', () => {
    render(
      <ModalAlterarSelecao
        aberto
        mensagemErro="Não foi possível alterar."
        {...propsModalPadrao}
      />,
    )

    expect(screen.getByRole('alert')).toHaveTextContent(
      /não foi possível alterar/i,
    )
  })

  it('exibe texto Alterando... quando estaSalvando', () => {
    render(
      <ModalAlterarSelecao aberto estaSalvando {...propsModalPadrao} />,
    )

    expect(screen.getByRole('button', { name: /alterando/i })).toBeDisabled()
  })

  it('funciona com opções de tipo de polo', async () => {
    const usuario = userEvent.setup()
    const onAlterar = vi.fn()

    render(
      <ModalAlterarSelecao
        aberto
        titulo="Alterar Tipo de Polo"
        descricao="Selecione o Tipo de Polo que deseja vincular ao(s) Polo(s):"
        rotuloCampo="Selecione o Tipo de Polo"
        idCampo="modal-tipo-polo"
        textoOpcaoVazia="Selecione o Tipo de Polo"
        opcoes={OPCOES_TIPO_POLO_ALTERACAO_MOCK}
        onFechar={vi.fn()}
        onAlterar={onAlterar}
      />,
    )

    for (const opcao of OPCOES_TIPO_POLO_ALTERACAO_MOCK) {
      expect(
        screen.getByRole('option', { name: opcao.rotulo }),
      ).toBeInTheDocument()
    }

    await usuario.selectOptions(
      screen.getByLabelText(/selecione o tipo de polo/i),
      'Polo oficial',
    )
    await usuario.click(screen.getByRole('button', { name: /^alterar$/i }))

    expect(onAlterar).toHaveBeenCalledWith('Polo oficial')
  })
})
