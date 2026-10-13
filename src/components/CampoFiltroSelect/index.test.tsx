import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SelectItem } from '@/components/ui/select'
import { CampoFiltroSelect } from './index'

describe('CampoFiltroSelect', () => {
  it('renderiza rótulo e placeholder', () => {
    render(
      <CampoFiltroSelect
        id="filtro-gestao"
        rotulo="Gestão"
        placeholder="Selecione a Gestão"
        valor=""
        onValorChange={vi.fn()}
      >
        <SelectItem value="parceira">Parceira</SelectItem>
      </CampoFiltroSelect>,
    )

    expect(screen.getByLabelText('Gestão')).toBeInTheDocument()
    expect(screen.getByText('Selecione a Gestão')).toBeInTheDocument()
  })

  it('notifica a opção selecionada', async () => {
    const usuario = userEvent.setup()
    const onValorChange = vi.fn()

    render(
      <CampoFiltroSelect
        id="filtro-gestao"
        rotulo="Gestão"
        placeholder="Selecione a Gestão"
        valor=""
        onValorChange={onValorChange}
      >
        <SelectItem value="parceira">Parceira</SelectItem>
      </CampoFiltroSelect>,
    )

    await usuario.click(screen.getByLabelText('Gestão'))
    await usuario.click(await screen.findByRole('option', { name: 'Parceira' }))

    expect(onValorChange).toHaveBeenCalledWith('parceira')
  })
})
