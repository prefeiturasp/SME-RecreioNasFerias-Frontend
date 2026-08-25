import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactElement } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import type { EdicaoPrograma } from '@/services/edicaoPrograma/types'
import { TabelaListagemEdicoesPrograma } from './TabelaListagemEdicoesPrograma'

const edicaoExemplo: EdicaoPrograma = {
  id: '1',
  nome: 'Fevereiro 2026',
  dataInicioEdicao: '2026-01-26',
  dataFimEdicao: '2026-02-26',
  dataInicioInscricoes: '2026-12-26',
  dataFimInscricoes: '2026-01-26',
  quantidadeInscritos: 100,
  quantidadeAtendimentoEfetivo: 100,
  quantidadePasseios: 0,
  quantidadeApresentacoes: 0,
}

const propsPaginacaoPadrao = {
  paginaAtual: 1,
  totalPaginas: 1,
  itensPorPagina: 10,
  onMudarPagina: vi.fn(),
  onMudarItensPorPagina: vi.fn(),
}

function renderTabela(ui: ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

describe('TabelaListagemEdicoesPrograma', () => {
  it('exibe mensagem de listagem vazia', () => {
    renderTabela(
      <TabelaListagemEdicoesPrograma edicoes={[]} {...propsPaginacaoPadrao} />,
    )

    expect(screen.getByRole('status')).toHaveTextContent(/sem dados/i)
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  it('renderiza tabela com colunas e dados da edição', () => {
    renderTabela(
      <TabelaListagemEdicoesPrograma
        edicoes={[edicaoExemplo]}
        {...propsPaginacaoPadrao}
      />,
    )

    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(
      screen.getByRole('columnheader', { name: /nome da edição/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('columnheader', { name: /período da edição/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('columnheader', { name: /período das inscrições/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('columnheader', { name: /quantidade de inscritos/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('columnheader', {
        name: /quantidade de atendimento efetivo/i,
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('columnheader', { name: /ações/i }),
    ).toBeInTheDocument()
    expect(screen.getByText('Fevereiro 2026')).toBeInTheDocument()
    expect(screen.getByText('26/01/2026 - 26/02/2026')).toBeInTheDocument()
    expect(screen.getByText('26/12/2026 - 26/01/2026')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /editar edição fevereiro 2026/i }),
    ).toHaveAttribute('href', '/editar-edicao-programa/1')
  })

  it('exibe paginação e notifica mudanças de página', async () => {
    const usuario = userEvent.setup()
    const onMudarPagina = vi.fn()

    renderTabela(
      <TabelaListagemEdicoesPrograma
        edicoes={[edicaoExemplo]}
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

  it('permite ordenar por nome da edição', async () => {
    const usuario = userEvent.setup()
    const edicoes: EdicaoPrograma[] = [
      { ...edicaoExemplo, id: '1', nome: 'Março 2026' },
      { ...edicaoExemplo, id: '2', nome: 'Janeiro 2026' },
    ]

    renderTabela(
      <TabelaListagemEdicoesPrograma
        edicoes={edicoes}
        {...propsPaginacaoPadrao}
      />,
    )

    const linhas = () => screen.getAllByRole('row').slice(1)

    expect(linhas()[0]).toHaveTextContent('Janeiro 2026')

    await usuario.click(
      screen.getByRole('button', { name: /ordenar por nome da edição/i }),
    )

    expect(linhas()[0]).toHaveTextContent('Março 2026')
  })

  it('ordena nomes com locale pt-BR', () => {
    const edicoes: EdicaoPrograma[] = [
      { ...edicaoExemplo, id: '1', nome: 'Última edição' },
      { ...edicaoExemplo, id: '2', nome: 'Abril 2026' },
      { ...edicaoExemplo, id: '3', nome: 'Érica 2026' },
    ]

    renderTabela(
      <TabelaListagemEdicoesPrograma
        edicoes={edicoes}
        {...propsPaginacaoPadrao}
      />,
    )

    const linhas = screen.getAllByRole('row').slice(1)

    expect(linhas[0]).toHaveTextContent('Abril 2026')
    expect(linhas[1]).toHaveTextContent('Érica 2026')
    expect(linhas[2]).toHaveTextContent('Última edição')
  })

  it('expõe direção da ordenação para tecnologias assistivas', async () => {
    const usuario = userEvent.setup()

    renderTabela(
      <TabelaListagemEdicoesPrograma
        edicoes={[edicaoExemplo]}
        {...propsPaginacaoPadrao}
      />,
    )

    const cabecalhoNome = screen.getByRole('columnheader', {
      name: /nome da edição/i,
    })
    const cabecalhoPeriodo = screen.getByRole('columnheader', {
      name: /período da edição/i,
    })

    expect(cabecalhoNome).toHaveAttribute('aria-sort', 'ascending')
    expect(cabecalhoPeriodo).toHaveAttribute('aria-sort', 'none')
    expect(
      screen.getByRole('button', {
        name: /ordenar por nome da edição do programa, ordem crescente/i,
      }),
    ).toBeInTheDocument()

    await usuario.click(
      screen.getByRole('button', {
        name: /ordenar por nome da edição do programa, ordem crescente/i,
      }),
    )

    expect(cabecalhoNome).toHaveAttribute('aria-sort', 'descending')
    expect(
      screen.getByRole('button', {
        name: /ordenar por nome da edição do programa, ordem decrescente/i,
      }),
    ).toBeInTheDocument()
  })

  it('ordena a lista inteira antes de paginar', () => {
    const edicoes: EdicaoPrograma[] = [
      { ...edicaoExemplo, id: 'z', nome: 'Zebra 2026' },
      ...Array.from({ length: 10 }, (_, indice) => ({
        ...edicaoExemplo,
        id: String(indice),
        nome: `Abril ${indice}`,
      })),
    ]

    renderTabela(
      <TabelaListagemEdicoesPrograma
        edicoes={edicoes}
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
    const edicoes: EdicaoPrograma[] = Array.from(
      { length: 11 },
      (_, indice) => ({
        ...edicaoExemplo,
        id: String(indice),
        nome: `Edição ${String(indice + 1).padStart(2, '0')}`,
      }),
    )

    renderTabela(
      <TabelaListagemEdicoesPrograma
        edicoes={edicoes}
        paginaAtual={2}
        totalPaginas={2}
        itensPorPagina={10}
        onMudarPagina={onMudarPagina}
        onMudarItensPorPagina={vi.fn()}
      />,
    )

    await usuario.click(
      screen.getByRole('button', { name: /ordenar por nome da edição/i }),
    )

    expect(onMudarPagina).toHaveBeenCalledWith(1)
  })
})
