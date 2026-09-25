import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import {
  AGRUPAMENTO_BERCARIO,
  AGRUPAMENTO_MINI_GRUPO,
  AGRUPAMENTO_QUATRO_A_QUATORZE,
  TIPO_ESTUDANTE_FORA_DA_REDE,
  TIPO_ESTUDANTE_REDE,
} from './constantes'
import { ParticipanteForm } from './index'

function renderFormulario() {
  return render(
    <MemoryRouter initialEntries={['/inscricoes-participantes']}>
      <Routes>
        <Route
          path="/inscricoes-participantes"
          element={<ParticipanteForm />}
        />
        <Route path="/inicio" element={<div>Página Início</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ParticipanteForm', () => {
  it('renderiza alerta, seções do accordion e ações do rodapé', () => {
    renderFormulario()

    expect(
      screen.getByRole('form', {
        name: /formulário de cadastro de participante/i,
      }),
    ).toBeInTheDocument()
    const alerta = screen.getByRole('alert')
    expect(alerta).toHaveClass('h-36', 'max-h-36', 'overflow-y-auto')
    expect(alerta).toHaveTextContent(
      /usuário deve visualizar texto com orientações que precisa compartilhar com familiares e responsáveis/i,
    )

    const basicas = screen.getByRole('button', {
      name: /informações básicas/i,
    })

    expect(basicas).toHaveAttribute('aria-expanded', 'true')
    expect(
      screen.getByLabelText(/tipo de agrupamento/i),
    ).toBeInTheDocument()
    expect(
      screen.queryByLabelText(/tipo de estudante/i),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /informações por grupo/i }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /informações de saúde/i }),
    ).not.toBeInTheDocument()
    expect(screen.getAllByText(/campos obrigatórios/i)).toHaveLength(1)

    expect(
      screen.getByRole('button', { name: /cancelar/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /salvar rascunho/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^salvar$/i })).toBeInTheDocument()
  })

  it('navega para o início ao clicar em Cancelar', async () => {
    const usuario = userEvent.setup()
    renderFormulario()

    await usuario.click(screen.getByRole('button', { name: /cancelar/i }))

    expect(screen.getByText(/página início/i)).toBeInTheDocument()
  })

  it('trava Estudante da Rede e libera as seções ao escolher Berçário', async () => {
    const usuario = userEvent.setup()
    renderFormulario()

    await usuario.click(screen.getByLabelText(/tipo de agrupamento/i))
    await usuario.click(
      await screen.findByRole('option', { name: AGRUPAMENTO_BERCARIO }),
    )

    const tipo = await screen.findByLabelText(/tipo de estudante/i)
    expect(tipo).toHaveValue(TIPO_ESTUDANTE_REDE)
    expect(tipo).toHaveAttribute('readonly')
    expect(
      screen.getByRole('button', { name: /informações por grupo/i }),
    ).toHaveAttribute('aria-expanded', 'false')
    expect(
      screen.getByRole('button', { name: /informações de saúde/i }),
    ).toHaveAttribute('aria-expanded', 'false')
  })

  it('trava Estudante da Rede ao escolher Mini Grupo', async () => {
    const usuario = userEvent.setup()
    renderFormulario()

    await usuario.click(screen.getByLabelText(/tipo de agrupamento/i))
    await usuario.click(
      await screen.findByRole('option', { name: AGRUPAMENTO_MINI_GRUPO }),
    )

    const tipo = await screen.findByLabelText(/tipo de estudante/i)
    expect(tipo).toHaveValue(TIPO_ESTUDANTE_REDE)
    expect(tipo).toHaveAttribute('readonly')
  })

  it('libera o tipo e só então as seções em 4 a 14 anos', async () => {
    const usuario = userEvent.setup()
    renderFormulario()

    await usuario.click(screen.getByLabelText(/tipo de agrupamento/i))
    await usuario.click(
      await screen.findByRole('option', {
        name: AGRUPAMENTO_QUATRO_A_QUATORZE,
      }),
    )

    expect(
      screen.queryByRole('button', { name: /informações por grupo/i }),
    ).not.toBeInTheDocument()

    await usuario.click(screen.getByLabelText(/tipo de estudante/i))
    expect(
      screen.getByRole('option', { name: TIPO_ESTUDANTE_REDE }),
    ).toBeInTheDocument()
    await usuario.click(
      screen.getByRole('option', { name: TIPO_ESTUDANTE_FORA_DA_REDE }),
    )

    expect(
      screen.getByRole('button', { name: /informações por grupo/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /informações de saúde/i }),
    ).toBeInTheDocument()
  })

  it('limpa o tipo e oculta as seções ao trocar o agrupamento', async () => {
    const usuario = userEvent.setup()
    renderFormulario()

    await usuario.click(screen.getByLabelText(/tipo de agrupamento/i))
    await usuario.click(
      await screen.findByRole('option', {
        name: AGRUPAMENTO_QUATRO_A_QUATORZE,
      }),
    )
    await usuario.click(screen.getByLabelText(/tipo de estudante/i))
    await usuario.click(
      screen.getByRole('option', { name: TIPO_ESTUDANTE_FORA_DA_REDE }),
    )

    await usuario.click(screen.getByLabelText(/tipo de agrupamento/i))
    await usuario.click(
      screen.getByRole('option', { name: AGRUPAMENTO_BERCARIO }),
    )

    const tipo = await screen.findByLabelText(/tipo de estudante/i)
    expect(tipo).toHaveValue(TIPO_ESTUDANTE_REDE)
    expect(tipo).toHaveAttribute('readonly')

    await usuario.click(screen.getByLabelText(/tipo de agrupamento/i))
    await usuario.click(
      screen.getByRole('option', { name: AGRUPAMENTO_QUATRO_A_QUATORZE }),
    )

    expect(screen.getByLabelText(/tipo de estudante/i)).not.toHaveValue(
      TIPO_ESTUDANTE_FORA_DA_REDE,
    )
    expect(
      screen.queryByRole('button', { name: /informações por grupo/i }),
    ).not.toBeInTheDocument()
  })
})
