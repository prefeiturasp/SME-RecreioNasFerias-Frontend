import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
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
    const grupo = screen.getByRole('button', {
      name: /informações por grupo/i,
    })
    const saude = screen.getByRole('button', {
      name: /informações de saúde/i,
    })

    expect(basicas).toHaveAttribute('aria-expanded', 'true')
    expect(grupo).toHaveAttribute('aria-expanded', 'false')
    expect(saude).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getAllByText(/campos obrigatórios/i)).toHaveLength(3)

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
})
