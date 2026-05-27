import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SideMenu } from './index'

vi.mock('../../assets/logo-sme-branco.png', () => ({
  default: 'logo-sme-branco-stub.png',
}))

describe('SideMenu', () => {
  beforeEach(() => {
    vi.useRealTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('inicia com o menu aberto e o conteúdo visível', () => {
    render(<SideMenu />)

    expect(
      screen.getByRole('heading', {
        name: /sistema de gestão.*do recreio nas férias/i,
      }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /fechar menu/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /abrir menu/i })).not.toBeInTheDocument()
  })

  it('renderiza os três itens principais do menu', () => {
    render(<SideMenu />)

    expect(screen.getByRole('button', { name: /cronogramas/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /inscrições/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /configurações/i })).toBeInTheDocument()
  })

  it('renderiza a logo da Prefeitura com texto alternativo acessível', () => {
    render(<SideMenu />)

    const logo = screen.getByRole('img', { name: /prefeitura de são paulo/i })
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('src', 'logo-sme-branco-stub.png')
  })

  it('marca os itens do menu como recolhidos até haver submenus', () => {
    render(<SideMenu />)

    const botoesItens = [
      screen.getByRole('button', { name: /cronogramas/i }),
      screen.getByRole('button', { name: /inscrições/i }),
      screen.getByRole('button', { name: /configurações/i }),
    ]

    for (const botao of botoesItens) {
      expect(botao).toHaveAttribute('aria-expanded', 'false')
    }
  })

  it('ao clicar em fechar, esconde o conteúdo e exibe o botão hambúrguer', async () => {
    const usuario = userEvent.setup()
    render(<SideMenu />)

    await usuario.click(screen.getByRole('button', { name: /fechar menu/i }))

    expect(
      screen.queryByRole('heading', {
        name: /sistema de gestão.*do recreio nas férias/i,
      }),
    ).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /abrir menu/i })).toBeInTheDocument()
    expect(screen.queryByRole('img', { name: /prefeitura de são paulo/i })).not.toBeInTheDocument()
  })

  it('ao clicar em abrir, volta a exibir cabeçalho, itens e logo', async () => {
    const usuario = userEvent.setup()
    render(<SideMenu />)

    await usuario.click(screen.getByRole('button', { name: /fechar menu/i }))
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

    expect(screen.getByRole('button', { name: /fechar menu/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cronogramas/i })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /prefeitura de são paulo/i })).toBeInTheDocument()
  })

  it('usa temporizador de segurança quando o evento transitionend não ocorre', async () => {
    vi.useFakeTimers()
    render(<SideMenu />)

    fireEvent.click(screen.getByRole('button', { name: /fechar menu/i }))
    fireEvent.click(screen.getByRole('button', { name: /abrir menu/i }))

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

  it('dispara showContent ao receber transitionend válido na largura do aside', async () => {
    const usuario = userEvent.setup()
    render(<SideMenu />)

    await usuario.click(screen.getByRole('button', { name: /fechar menu/i }))
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
    render(<SideMenu />)

    fireEvent.click(screen.getByRole('button', { name: /fechar menu/i }))
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
    render(<SideMenu />)

    fireEvent.click(screen.getByRole('button', { name: /fechar menu/i }))
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

  it('mantém a lista de itens dentro da área de navegação', () => {
    render(<SideMenu />)

    const navegacao = screen.getByRole('navigation')
    expect(within(navegacao).getByRole('list')).toBeInTheDocument()
    expect(within(navegacao).getAllByRole('listitem')).toHaveLength(3)
  })
})
