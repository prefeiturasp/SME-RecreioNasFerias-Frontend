import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { TabelaListagem, type DefinicaoColuna } from './index'

type ItemExemplo = {
  id: string
  nome: string
  quantidade: number
}

const itemExemplo: ItemExemplo = {
  id: '1',
  nome: 'Fevereiro 2026',
  quantidade: 100,
}

const COLUNAS: DefinicaoColuna<ItemExemplo>[] = [
  {
    id: 'nome',
    rotulo: 'Nome',
    valorOrdenacao: (item) => item.nome,
    renderizar: (item) => item.nome,
  },
  {
    id: 'quantidade',
    rotulo: 'Quantidade',
    valorOrdenacao: (item) => item.quantidade,
    renderizar: (item) => item.quantidade,
  },
]

const propsPaginacaoPadrao = {
  paginaAtual: 1,
  totalPaginas: 1,
  itensPorPagina: 10,
  onMudarPagina: vi.fn(),
  onMudarItensPorPagina: vi.fn(),
}

const propsTabelaPadrao = {
  colunas: COLUNAS,
  obterId: (item: ItemExemplo) => item.id,
  colunaOrdenacaoInicial: 'nome',
  ...propsPaginacaoPadrao,
}

describe('TabelaListagem', () => {
  it('exibe mensagem de listagem vazia', () => {
    render(<TabelaListagem itens={[]} {...propsTabelaPadrao} />)

    expect(screen.getByRole('status')).toHaveTextContent(/sem dados/i)
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  it('renderiza tabela com colunas e dados', () => {
    render(<TabelaListagem itens={[itemExemplo]} {...propsTabelaPadrao} />)

    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(
      screen.getByRole('columnheader', { name: /nome/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('columnheader', { name: /quantidade/i }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('columnheader', { name: /ações/i }),
    ).not.toBeInTheDocument()
    expect(screen.getByText('Fevereiro 2026')).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument()
  })

  it('renderiza coluna de ações quando informada', () => {
    render(
      <TabelaListagem
        itens={[itemExemplo]}
        {...propsTabelaPadrao}
        renderizarAcoes={(item) => (
          <button type="button">Editar {item.nome}</button>
        )}
      />,
    )

    expect(
      screen.getByRole('columnheader', { name: /ações/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /editar fevereiro 2026/i }),
    ).toBeInTheDocument()
  })

  it('exibe paginação e notifica mudanças de página', async () => {
    const usuario = userEvent.setup()
    const onMudarPagina = vi.fn()

    render(
      <TabelaListagem
        itens={[itemExemplo]}
        colunas={COLUNAS}
        obterId={(item) => item.id}
        paginaAtual={1}
        totalPaginas={20}
        itensPorPagina={10}
        onMudarPagina={onMudarPagina}
        onMudarItensPorPagina={vi.fn()}
      />,
    )

    expect(
      screen.getByRole('navigation', { name: /paginação da listagem/i }),
    ).toBeInTheDocument()

    await usuario.click(screen.getByRole('button', { name: /^página 3$/i }))

    expect(onMudarPagina).toHaveBeenCalledWith(3)
  })

  it('permite ordenar pela coluna inicial', async () => {
    const usuario = userEvent.setup()
    const itens: ItemExemplo[] = [
      { id: '1', nome: 'Março 2026', quantidade: 1 },
      { id: '2', nome: 'Janeiro 2026', quantidade: 2 },
    ]

    render(<TabelaListagem itens={itens} {...propsTabelaPadrao} />)

    const linhas = () => screen.getAllByRole('row').slice(1)

    expect(linhas()[0]).toHaveTextContent('Janeiro 2026')

    await usuario.click(screen.getByRole('button', { name: /ordenar por nome/i }))

    expect(linhas()[0]).toHaveTextContent('Março 2026')
  })

  it('ordena nomes com locale pt-BR', () => {
    const itens: ItemExemplo[] = [
      { id: '1', nome: 'Última edição', quantidade: 1 },
      { id: '2', nome: 'Abril 2026', quantidade: 2 },
      { id: '3', nome: 'Érica 2026', quantidade: 3 },
    ]

    render(<TabelaListagem itens={itens} {...propsTabelaPadrao} />)

    const linhas = screen.getAllByRole('row').slice(1)

    expect(linhas[0]).toHaveTextContent('Abril 2026')
    expect(linhas[1]).toHaveTextContent('Érica 2026')
    expect(linhas[2]).toHaveTextContent('Última edição')
  })

  it('expõe direção da ordenação para tecnologias assistivas', async () => {
    const usuario = userEvent.setup()

    render(<TabelaListagem itens={[itemExemplo]} {...propsTabelaPadrao} />)

    const cabecalhoNome = screen.getByRole('columnheader', { name: /nome/i })
    const cabecalhoQuantidade = screen.getByRole('columnheader', {
      name: /quantidade/i,
    })

    expect(cabecalhoNome).toHaveAttribute('aria-sort', 'ascending')
    expect(cabecalhoQuantidade).toHaveAttribute('aria-sort', 'none')
    expect(
      screen.getByRole('button', {
        name: /ordenar por nome, ordem crescente/i,
      }),
    ).toBeInTheDocument()

    await usuario.click(
      screen.getByRole('button', {
        name: /ordenar por nome, ordem crescente/i,
      }),
    )

    expect(cabecalhoNome).toHaveAttribute('aria-sort', 'descending')
    expect(
      screen.getByRole('button', {
        name: /ordenar por nome, ordem decrescente/i,
      }),
    ).toBeInTheDocument()
  })

  it('ordena a lista inteira antes de paginar', () => {
    const itens: ItemExemplo[] = [
      { id: 'z', nome: 'Zebra 2026', quantidade: 0 },
      ...Array.from({ length: 10 }, (_, indice) => ({
        id: String(indice),
        nome: `Abril ${indice}`,
        quantidade: indice,
      })),
    ]

    render(
      <TabelaListagem
        itens={itens}
        colunas={COLUNAS}
        obterId={(item) => item.id}
        paginaAtual={1}
        totalPaginas={2}
        itensPorPagina={10}
        onMudarPagina={vi.fn()}
        onMudarItensPorPagina={vi.fn()}
      />,
    )

    expect(screen.getByText('Abril 0')).toBeInTheDocument()
    expect(screen.queryByText('Zebra 2026')).not.toBeInTheDocument()
  })

  it('volta para a primeira página ao ordenar', async () => {
    const usuario = userEvent.setup()
    const onMudarPagina = vi.fn()
    const itens: ItemExemplo[] = Array.from({ length: 11 }, (_, indice) => ({
      id: String(indice),
      nome: `Item ${String(indice + 1).padStart(2, '0')}`,
      quantidade: indice,
    }))

    render(
      <TabelaListagem
        itens={itens}
        colunas={COLUNAS}
        obterId={(item) => item.id}
        colunaOrdenacaoInicial="nome"
        paginaAtual={2}
        totalPaginas={2}
        itensPorPagina={10}
        onMudarPagina={onMudarPagina}
        onMudarItensPorPagina={vi.fn()}
      />,
    )

    await usuario.click(screen.getByRole('button', { name: /ordenar por nome/i }))

    expect(onMudarPagina).toHaveBeenCalledWith(1)
  })
})
