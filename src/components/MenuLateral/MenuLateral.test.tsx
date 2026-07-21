import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ProvedorEstadoMenuLateral } from '../../contexts/EstadoMenuLateralContext'
import { MenuLateral } from './index'

vi.mock('../../assets/logo-sme-branco.png', () => ({
  default: 'logo-sme-branco-stub.png',
}))

function renderMenuLateral(initialPath = '/inicio') {
  return render(
    <ProvedorEstadoMenuLateral>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route
            path="/inicio"
            element={
              <>
                <MenuLateral />
                <div>Página Início</div>
              </>
            }
          />
          <Route
            path="/edicoes-programa"
            element={
              <>
                <MenuLateral />
                <div>Página Edições do Programa</div>
              </>
            }
          />
          <Route
            path="/polos-parceiros"
            element={
              <>
                <MenuLateral />
                <div>Página Polos Parceiros</div>
              </>
            }
          />
          <Route
            path="/definicoes-polo"
            element={
              <>
                <MenuLateral />
                <div>Página Definições de Polo</div>
              </>
            }
          />
        </Routes>
      </MemoryRouter>
    </ProvedorEstadoMenuLateral>,
  )
}

async function abrirMenuCompleto(usuario: ReturnType<typeof userEvent.setup>) {
  await usuario.click(screen.getByRole('button', { name: /abrir menu/i }))

  await waitFor(
    () => {
      expect(
        screen.getByRole('heading', {
          name: /sistema de gestão.*do recreio nas férias/i,
        }),
      ).toBeInTheDocument()
    },
    { timeout: 600 },
  )
}

describe('MenuLateral', () => {
  beforeEach(() => {
    vi.useRealTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('inicia com o menu fechado e exibe o botão hambúrguer', () => {
    renderMenuLateral()

    expect(
      screen.getByRole('button', { name: /abrir menu/i }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', {
        name: /sistema de gestão.*do recreio nas férias/i,
      }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /fechar menu/i }),
    ).not.toBeInTheDocument()
  })

  it('renderiza o grupo Cadastros com subitens no menu', async () => {
    const usuario = userEvent.setup()
    renderMenuLateral()
    await abrirMenuCompleto(usuario)

    expect(
      screen.getByRole('button', { name: /cadastros/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /cadastro de edições/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /definições de polo/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /cadastro de polos parceiros/i }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('link', { name: /cronogramas/i }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('link', { name: /inscrições/i }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('link', { name: /configurações/i }),
    ).not.toBeInTheDocument()
  })

  it('navega para /edicoes-programa ao clicar em Cadastro de Edições', async () => {
    const usuario = userEvent.setup()
    renderMenuLateral()
    await abrirMenuCompleto(usuario)

    await usuario.click(
      screen.getByRole('link', { name: /cadastro de edições/i }),
    )

    expect(screen.getByText(/página edições do programa/i)).toBeInTheDocument()
  })

  it('navega para /definicoes-polo ao clicar em Definições de Polo', async () => {
    const usuario = userEvent.setup()
    renderMenuLateral()
    await abrirMenuCompleto(usuario)

    await usuario.click(
      screen.getByRole('link', { name: /definições de polo/i }),
    )

    expect(screen.getByText(/página definições de polo/i)).toBeInTheDocument()
  })

  it('navega para /polos-parceiros ao clicar em Cadastro de Polos Parceiros', async () => {
    const usuario = userEvent.setup()
    renderMenuLateral()
    await abrirMenuCompleto(usuario)

    await usuario.click(
      screen.getByRole('link', { name: /cadastro de polos parceiros/i }),
    )

    expect(screen.getByText(/página polos parceiros/i)).toBeInTheDocument()
  })

  it('expande Cadastros automaticamente em rotas de cadastro', async () => {
    const usuario = userEvent.setup()
    renderMenuLateral('/polos-parceiros')
    await abrirMenuCompleto(usuario)

    expect(screen.getByRole('button', { name: /cadastros/i })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
    expect(
      screen.getByRole('link', { name: /cadastro de polos parceiros/i }),
    ).toBeInTheDocument()
  })

  it('alterna a expansão de Cadastros ao clicar no cabeçalho', async () => {
    const usuario = userEvent.setup()
    renderMenuLateral('/inicio')
    await abrirMenuCompleto(usuario)

    const botaoCadastros = screen.getByRole('button', { name: /cadastros/i })
    expect(botaoCadastros).toHaveAttribute('aria-expanded', 'true')

    await usuario.click(botaoCadastros)
    expect(botaoCadastros).toHaveAttribute('aria-expanded', 'false')
    expect(
      screen.queryByRole('link', { name: /cadastro de edições/i }),
    ).not.toBeInTheDocument()

    await usuario.click(botaoCadastros)
    expect(botaoCadastros).toHaveAttribute('aria-expanded', 'true')
  })

  it('mantém o menu aberto após navegar para outra página', async () => {
    const usuario = userEvent.setup()
    renderMenuLateral()
    await abrirMenuCompleto(usuario)

    await usuario.click(
      screen.getByRole('link', { name: /cadastro de edições/i }),
    )

    expect(
      screen.getByRole('heading', {
        name: /sistema de gestão.*do recreio nas férias/i,
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /fechar menu/i }),
    ).toBeInTheDocument()
  })

  it('renderiza a logo da Prefeitura com texto alternativo acessível', async () => {
    const usuario = userEvent.setup()
    renderMenuLateral()
    await abrirMenuCompleto(usuario)

    const logo = screen.getByRole('img', { name: /prefeitura de são paulo/i })
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('src', 'logo-sme-branco-stub.png')
  })

  it('ao clicar em fechar, esconde o conteúdo e exibe o botão hambúrguer', async () => {
    const usuario = userEvent.setup()
    renderMenuLateral()
    await abrirMenuCompleto(usuario)

    await usuario.click(screen.getByRole('button', { name: /fechar menu/i }))

    expect(
      screen.queryByRole('heading', {
        name: /sistema de gestão.*do recreio nas férias/i,
      }),
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /abrir menu/i }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('img', { name: /prefeitura de são paulo/i }),
    ).not.toBeInTheDocument()
  })

  it('ao clicar em abrir, volta a exibir cabeçalho, item Cadastros e logo', async () => {
    const usuario = userEvent.setup()
    renderMenuLateral()

    await abrirMenuCompleto(usuario)
    await usuario.click(screen.getByRole('button', { name: /fechar menu/i }))
    await abrirMenuCompleto(usuario)

    expect(
      screen.getByRole('button', { name: /fechar menu/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /cadastros/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: /prefeitura de são paulo/i }),
    ).toBeInTheDocument()
  })

  it('usa temporizador de segurança quando o evento transitionend não ocorre', async () => {
    vi.useFakeTimers()
    renderMenuLateral()

    fireEvent.click(screen.getByRole('button', { name: /abrir menu/i }))

    await act(async () => {
      await vi.advanceTimersByTimeAsync(300)
    })

    expect(
      screen.getByRole('heading', {
        name: /sistema de gestão.*do recreio nas férias/i,
      }),
    ).toBeInTheDocument()
  })

  it('dispara showContent ao receber transitionend válido na largura do aside', async () => {
    const usuario = userEvent.setup()
    renderMenuLateral()

    await usuario.click(screen.getByRole('button', { name: /abrir menu/i }))

    const aside = document.querySelector('aside')
    expect(aside).not.toBeNull()

    await act(() => {
      aside!.dispatchEvent(
        new TransitionEvent('transitionend', {
          bubbles: true,
          propertyName: 'width',
        }),
      )
    })

    await waitFor(() => {
      expect(
        screen.getByRole('heading', {
          name: /sistema de gestão.*do recreio nas férias/i,
        }),
      ).toBeInTheDocument()
    })
  })

  it('ignora transitionend de propriedades diferentes de width', async () => {
    vi.useFakeTimers()
    renderMenuLateral()

    fireEvent.click(screen.getByRole('button', { name: /abrir menu/i }))

    const aside = document.querySelector('aside')
    expect(aside).not.toBeNull()

    await act(() => {
      aside!.dispatchEvent(
        new TransitionEvent('transitionend', {
          bubbles: true,
          propertyName: 'opacity',
        }),
      )
    })

    expect(
      screen.queryByRole('heading', {
        name: /sistema de gestão.*do recreio nas férias/i,
      }),
    ).not.toBeInTheDocument()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(300)
    })

    expect(
      screen.getByRole('heading', {
        name: /sistema de gestão.*do recreio nas férias/i,
      }),
    ).toBeInTheDocument()
  })

  it('ignora transitionend disparado em elemento diferente do aside', async () => {
    vi.useFakeTimers()
    renderMenuLateral()

    fireEvent.click(screen.getByRole('button', { name: /abrir menu/i }))

    const aside = document.querySelector('aside')
    const filho = document.createElement('div')
    aside?.appendChild(filho)

    await act(() => {
      filho.dispatchEvent(
        new TransitionEvent('transitionend', {
          bubbles: true,
          propertyName: 'width',
        }),
      )
    })

    expect(
      screen.queryByRole('heading', {
        name: /sistema de gestão.*do recreio nas férias/i,
      }),
    ).not.toBeInTheDocument()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(300)
    })

    expect(
      screen.getByRole('heading', {
        name: /sistema de gestão.*do recreio nas férias/i,
      }),
    ).toBeInTheDocument()
  })

  it('mantém a lista de itens dentro da área de navegação', async () => {
    const usuario = userEvent.setup()
    renderMenuLateral()
    await abrirMenuCompleto(usuario)

    const navegacao = screen.getByRole('navigation')
    expect(within(navegacao).getAllByRole('list')).toHaveLength(2)
    expect(within(navegacao).getAllByRole('listitem')).toHaveLength(4)
  })
})
