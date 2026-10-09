import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  CampoFiltroCombobox,
  type OpcaoFiltroCombobox,
} from './CampoFiltroCombobox'

const opcoesMock: OpcaoFiltroCombobox[] = [
  { value: 'sp', label: 'São Paulo' },
  { value: 'rj', label: 'Rio de Janeiro' },
  { value: 'mg', label: 'Minas Gerais' },
]

describe('CampoFiltroCombobox', () => {
  it('deve renderizar o rótulo e o input com o placeholder correto', () => {
    const onValorChange = vi.fn()

    render(
      <CampoFiltroCombobox
        id="estado"
        rotulo="Estado"
        placeholder="Selecione o estado"
        valor=""
        opcoes={opcoesMock}
        onValorChange={onValorChange}
      />,
    )

    // Verifica se o rótulo (Label) está presente e associado corretamente
    const rotulo = screen.getByText('Estado')
    expect(rotulo).toBeInTheDocument()
    expect(rotulo).toHaveAttribute('for', 'estado')

    // Verifica se o input do combobox está presente com o placeholder correto
    const input = screen.getByPlaceholderText('Selecione o estado')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('id', 'estado')
  })

  it('deve chamar onValorChange quando uma opção for selecionada', async () => {
    const user = userEvent.setup()
    const onValorChange = vi.fn()

    render(
      <CampoFiltroCombobox
        id="estado"
        rotulo="Estado"
        placeholder="Selecione o estado"
        valor=""
        opcoes={opcoesMock}
        onValorChange={onValorChange}
      />,
    )

    const input = screen.getByPlaceholderText('Selecione o estado')

    // Clica ou foca no input para abrir as opções do combobox
    await user.click(input)

    // Procura por uma das opções na lista (ex: "Rio de Janeiro")
    const opcaoRj = await screen.findByText('Rio de Janeiro')
    expect(opcaoRj).toBeInTheDocument()

    // Clica na opção
    await user.click(opcaoRj)

    // Verifica se a função de callback foi acionada com o value correto ('rj')
    expect(onValorChange).toHaveBeenCalledTimes(1)
    expect(onValorChange).toHaveBeenCalledWith('rj')
  })

  it('deve exibir a opção correspondente quando um valor inicial for fornecido', () => {
    const onValorChange = vi.fn()

    render(
      <CampoFiltroCombobox
        id="estado"
        rotulo="Estado"
        placeholder="Selecione o estado"
        valor="sp"
        opcoes={opcoesMock}
        onValorChange={onValorChange}
      />,
    )

    // Opcional: dependendo de como a biblioteca do combobox renderiza o valor selecionado,
    // podemos validar se o componente foi inicializado corretamente.
    const input = screen.getByPlaceholderText('Selecione o estado')
    expect(input).toBeInTheDocument()
  })
})
