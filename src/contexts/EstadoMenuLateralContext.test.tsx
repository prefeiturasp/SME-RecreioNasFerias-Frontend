import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ProvedorEstadoMenuLateral } from './EstadoMenuLateralContext'
import { useEstadoMenuLateral } from './useEstadoMenuLateral'

function ComponenteTeste() {
  const { menuAberto, abrirMenu, fecharMenu } = useEstadoMenuLateral()

  return (
    <div>
      <p>{menuAberto ? 'aberto' : 'fechado'}</p>
      <button type="button" onClick={abrirMenu}>
        Abrir
      </button>
      <button type="button" onClick={fecharMenu}>
        Fechar
      </button>
    </div>
  )
}

function AlternadorMenu() {
  const [visivel, setVisivel] = useState(true)

  return (
    <div>
      <button type="button" onClick={() => setVisivel((atual) => !atual)}>
        Alternar
      </button>
      {visivel ? <ComponenteTeste /> : <p>sem menu</p>}
    </div>
  )
}

describe('EstadoMenuLateralContext', () => {
  it('lança erro quando o hook é usado fora do provedor', () => {
    const consoleErro = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => render(<ComponenteTeste />)).toThrow(
      'useEstadoMenuLateral deve ser usado dentro de ProvedorEstadoMenuLateral',
    )

    consoleErro.mockRestore()
  })

  it('inicia com o menu fechado', () => {
    render(
      <ProvedorEstadoMenuLateral>
        <ComponenteTeste />
      </ProvedorEstadoMenuLateral>,
    )

    expect(screen.getByText('fechado')).toBeInTheDocument()
  })

  it('mantém o estado entre remontagens do consumidor', async () => {
    const usuario = userEvent.setup()

    render(
      <ProvedorEstadoMenuLateral>
        <AlternadorMenu />
      </ProvedorEstadoMenuLateral>,
    )

    await usuario.click(screen.getByRole('button', { name: /^abrir$/i }))
    expect(screen.getByText('aberto')).toBeInTheDocument()

    await usuario.click(screen.getByRole('button', { name: /alternar/i }))
    expect(screen.getByText(/sem menu/i)).toBeInTheDocument()

    await usuario.click(screen.getByRole('button', { name: /alternar/i }))
    expect(screen.getByText('aberto')).toBeInTheDocument()
  })
})
