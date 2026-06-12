import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { MapaVisual } from './index'

function renderComRotas(
  niveis: Parameters<typeof MapaVisual>[0]['niveis'],
  rotaInicial = '/inicio',
) {
  return render(
    <MemoryRouter initialEntries={[rotaInicial]}>
      <Routes>
        <Route path="/inicio" element={<MapaVisual niveis={niveis} />} />
        <Route
          path="/edicoes-programa"
          element={<MapaVisual niveis={niveis} />}
        />
      </Routes>
    </MemoryRouter>,
  )
}

describe('MapaVisual', () => {
  it('renderiza apenas Início na página inicial', () => {
    renderComRotas([{ rotulo: 'Início' }])

    const mapa = screen.getByRole('navigation', { name: /mapa do site/i })
    expect(within(mapa).getByText('Início').parentElement).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(within(mapa).queryByRole('link')).not.toBeInTheDocument()
    expect(within(mapa).queryByText('Cadastros')).not.toBeInTheDocument()
  })

  it('renderiza o caminho completo na página de edições', () => {
    renderComRotas(
      [
        { rotulo: 'Início', caminho: '/inicio' },
        { rotulo: 'Cadastros' },
        { rotulo: 'Edições do programa' },
      ],
      '/edicoes-programa',
    )

    const mapa = screen.getByRole('navigation', { name: /mapa do site/i })
    expect(within(mapa).getByRole('link', { name: /início/i })).toHaveAttribute(
      'href',
      '/inicio',
    )
    expect(within(mapa).getByText('Cadastros')).toBeInTheDocument()
    expect(
      within(mapa).getByText('Edições do programa').parentElement,
    ).toHaveAttribute('aria-current', 'page')
  })

  it('navega para /inicio ao clicar em Início no caminho completo', async () => {
    const usuario = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/edicoes-programa']}>
        <Routes>
          <Route
            path="/edicoes-programa"
            element={
              <MapaVisual
                niveis={[
                  { rotulo: 'Início', caminho: '/inicio' },
                  { rotulo: 'Cadastros' },
                  { rotulo: 'Edições do programa' },
                ]}
              />
            }
          />
          <Route path="/inicio" element={<div>Página inicial</div>} />
        </Routes>
      </MemoryRouter>,
    )

    await usuario.click(screen.getByRole('link', { name: /início/i }))

    expect(screen.getByText(/página inicial/i)).toBeInTheDocument()
  })
})
