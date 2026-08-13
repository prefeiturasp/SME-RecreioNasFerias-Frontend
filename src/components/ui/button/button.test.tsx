import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button, buttonVariants } from './index'

describe('Button', () => {
  it('renderiza um botão com o conteúdo informado', () => {
    render(<Button>Salvar</Button>)

    expect(screen.getByRole('button', { name: /salvar/i })).toBeInTheDocument()
  })

  it('usa variante, tamanho e slot padrão', () => {
    render(<Button>Padrão</Button>)

    const botao = screen.getByRole('button', { name: /padrão/i })
    expect(botao).toHaveAttribute('data-slot', 'button')
    expect(botao).toHaveAttribute('data-variant', 'default')
    expect(botao).toHaveAttribute('data-size', 'default')
  })

  it.each(['outline', 'secondary', 'ghost', 'destructive', 'link'] as const)(
    'aplica a variante %s',
    (variant) => {
      render(<Button variant={variant}>{variant}</Button>)

      expect(screen.getByRole('button', { name: variant })).toHaveAttribute(
        'data-variant',
        variant,
      )
    },
  )

  it.each(['xs', 'sm', 'lg', 'icon', 'icon-xs', 'icon-sm', 'icon-lg'] as const)(
    'aplica o tamanho %s',
    (size) => {
      render(<Button size={size}>Ação</Button>)

      expect(screen.getByRole('button', { name: /ação/i })).toHaveAttribute(
        'data-size',
        size,
      )
    },
  )

  it('respeita o estado desabilitado', () => {
    render(<Button disabled>Enviar</Button>)

    expect(screen.getByRole('button', { name: /enviar/i })).toBeDisabled()
  })

  it('dispara o clique quando habilitado', async () => {
    const onClick = vi.fn()
    const usuario = userEvent.setup()

    render(<Button onClick={onClick}>Clique</Button>)
    await usuario.click(screen.getByRole('button', { name: /clique/i }))

    expect(onClick).toHaveBeenCalledOnce()
  })

  it('renderiza o filho quando asChild é verdadeiro', () => {
    render(
      <Button asChild>
        <a href="/exemplo">Ir para exemplo</a>
      </Button>,
    )

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    const link = screen.getByRole('link', { name: /ir para exemplo/i })
    expect(link).toHaveAttribute('href', '/exemplo')
    expect(link).toHaveAttribute('data-slot', 'button')
  })

  it('exporta buttonVariants para composição', () => {
    expect(buttonVariants({ variant: 'outline', size: 'sm' })).toContain(
      'border-border',
    )
  })
})
