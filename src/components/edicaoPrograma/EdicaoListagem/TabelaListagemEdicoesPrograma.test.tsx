import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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
  onEditarEdicao: vi.fn(),
}

describe('TabelaListagemEdicoesPrograma', () => {
  it('exibe mensagem de listagem vazia', () => {
    render(
      <TabelaListagemEdicoesPrograma edicoes={[]} {...propsPaginacaoPadrao} />,
    )

    expect(screen.getByText(/edições do programa/i)).toBeInTheDocument()
    expect(screen.getByText(/sem dados/i)).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  it('renderiza tabela com colunas e dados da edição', () => {
    render(
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
      screen.getByRole('button', { name: /editar edição fevereiro 2026/i }),
    ).toBeInTheDocument()
  })

  it('notifica clique no botão de editar', async () => {
    const usuario = userEvent.setup()
    const onEditarEdicao = vi.fn()

    render(
      <TabelaListagemEdicoesPrograma
        edicoes={[edicaoExemplo]}
        {...propsPaginacaoPadrao}
        onEditarEdicao={onEditarEdicao}
      />,
    )

    await usuario.click(
      screen.getByRole('button', { name: /editar edição fevereiro 2026/i }),
    )

    expect(onEditarEdicao).toHaveBeenCalledWith('1')
  })

  it('exibe paginação e notifica mudanças de página', async () => {
    const usuario = userEvent.setup()
    const onMudarPagina = vi.fn()

    render(
      <TabelaListagemEdicoesPrograma
        edicoes={[edicaoExemplo]}
        paginaAtual={1}
        totalPaginas={20}
        itensPorPagina={10}
        onMudarPagina={onMudarPagina}
        onMudarItensPorPagina={vi.fn()}
        onEditarEdicao={vi.fn()}
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

    render(
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

  it('ordena a lista inteira antes de paginar', () => {
    const edicoes: EdicaoPrograma[] = [
      { ...edicaoExemplo, id: 'z', nome: 'Zebra 2026' },
      ...Array.from({ length: 10 }, (_, indice) => ({
        ...edicaoExemplo,
        id: String(indice),
        nome: `Abril ${indice}`,
      })),
    ]

    render(
      <TabelaListagemEdicoesPrograma
        edicoes={edicoes}
        paginaAtual={1}
        totalPaginas={2}
        itensPorPagina={10}
        onMudarPagina={vi.fn()}
        onMudarItensPorPagina={vi.fn()}
        onEditarEdicao={vi.fn()}
      />,
    )

    expect(screen.getByText('Abril 0')).toBeInTheDocument()
    expect(screen.queryByText('Zebra 2026')).not.toBeInTheDocument()
  })
})
