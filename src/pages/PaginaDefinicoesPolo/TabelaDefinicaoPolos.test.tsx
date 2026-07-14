import { useState } from 'react'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import type { DefinicaoPolo } from '../../services/definicaoPolo/types'

import { TabelaDefinicaoPolos } from './TabelaDefinicaoPolos'

const poloDireta: DefinicaoPolo = {
  id: '1',
  dre: 'BUTANTA',
  tipoUe: 'CEI',
  nomeUe: 'CEI DIRET ALOYSIO',
  nomeEdicao: 'Janeiro 2025',
  tipoPolo: 'Pendente',
  gestao: 'Direta',
}

const poloParceira: DefinicaoPolo = {
  id: '2',
  dre: 'PENHA',
  tipoUe: 'EMEF',
  nomeUe: 'EMEF AMORIM LIMA',
  nomeEdicao: '-',
  tipoPolo: 'Polo oficial',
  gestao: 'Parceira',
}

const propsPaginacaoPadrao = {
  paginaAtual: 1,
  totalPaginas: 1,
  itensPorPagina: 10,
  onMudarPagina: vi.fn(),
  onMudarItensPorPagina: vi.fn(),
}

type WrapperProps = {
  polos?: DefinicaoPolo[]
  onVisualizarPolo?: (idPolo: string) => void
  onAlterarEdicaoPolo?: (idsPolos: string[]) => void
  onAlterarTipoPolo?: (idsPolos: string[]) => void
}

function TabelaComSelecao({
  polos = [poloDireta, poloParceira],
  onVisualizarPolo = vi.fn(),
  onAlterarEdicaoPolo = vi.fn(),
  onAlterarTipoPolo = vi.fn(),
}: Readonly<WrapperProps>) {
  const [selecionados, setSelecionados] = useState<Set<string>>(() => new Set())

  return (
    <TabelaDefinicaoPolos
      polos={polos}
      {...propsPaginacaoPadrao}
      polosSelecionados={selecionados}
      onMudarSelecao={setSelecionados}
      onVisualizarPolo={onVisualizarPolo}
      onAlterarEdicaoPolo={onAlterarEdicaoPolo}
      onAlterarTipoPolo={onAlterarTipoPolo}
    />
  )
}

describe('TabelaDefinicaoPolos', () => {
  it('exibe mensagem de listagem vazia', () => {
    render(
      <TabelaDefinicaoPolos
        polos={[]}
        {...propsPaginacaoPadrao}
        polosSelecionados={new Set()}
        onMudarSelecao={vi.fn()}
        onVisualizarPolo={vi.fn()}
        onAlterarEdicaoPolo={vi.fn()}
        onAlterarTipoPolo={vi.fn()}
      />,
    )

    expect(screen.getByText(/resultados da pesquisa/i)).toBeInTheDocument()
    expect(screen.getByText(/sem dados/i)).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  it('renderiza tabela com colunas incluindo Gestão', () => {
    render(<TabelaComSelecao />)

    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /ordenar por dre/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /ordenar por gestão/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/cei diret aloysio/i)).toBeInTheDocument()
    expect(screen.getByText(/^direta$/i)).toBeInTheDocument()
    expect(screen.getByText(/^parceira$/i)).toBeInTheDocument()
  })

  it('exibe barra de ações com contagem ao selecionar um polo', async () => {
    const usuario = userEvent.setup()

    render(<TabelaComSelecao />)

    await usuario.click(
      screen.getByRole('checkbox', {
        name: /selecionar polo cei diret aloysio/i,
      }),
    )

    expect(screen.getByText('1 UE selecionada')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /^alterar edição$/i }),
    ).toBeInTheDocument()
  })

  it('seleciona todos os polos da página', async () => {
    const usuario = userEvent.setup()

    render(<TabelaComSelecao />)

    await usuario.click(
      screen.getByRole('checkbox', {
        name: /selecionar todos os polos da página/i,
      }),
    )

    expect(screen.getByText('2 UEs selecionadas')).toBeInTheDocument()
  })

  it('desmarca todos os polos ao desmarcar o checkbox do cabeçalho', async () => {
    const usuario = userEvent.setup()

    render(<TabelaComSelecao />)

    const selecionarTodos = screen.getByRole('checkbox', {
      name: /selecionar todos os polos da página/i,
    })

    await usuario.click(selecionarTodos)
    expect(screen.getByText('2 UEs selecionadas')).toBeInTheDocument()

    await usuario.click(selecionarTodos)
    expect(screen.queryByText(/ue selecionada/i)).not.toBeInTheDocument()
  })

  it('desmarca um polo da seleção parcial', async () => {
    const usuario = userEvent.setup()

    render(<TabelaComSelecao />)

    await usuario.click(
      screen.getByRole('checkbox', {
        name: /selecionar polo cei diret aloysio/i,
      }),
    )
    expect(screen.getByText('1 UE selecionada')).toBeInTheDocument()

    await usuario.click(
      screen.getByRole('checkbox', {
        name: /selecionar polo cei diret aloysio/i,
      }),
    )
    expect(screen.queryByText(/ue selecionada/i)).not.toBeInTheDocument()
  })

  it('chama alterar edição, alterar tipo e cancelar a partir da barra', async () => {
    const usuario = userEvent.setup()
    const onAlterarEdicaoPolo = vi.fn()
    const onAlterarTipoPolo = vi.fn()

    render(
      <TabelaComSelecao
        onAlterarEdicaoPolo={onAlterarEdicaoPolo}
        onAlterarTipoPolo={onAlterarTipoPolo}
      />,
    )

    await usuario.click(
      screen.getByRole('checkbox', {
        name: /selecionar polo cei diret aloysio/i,
      }),
    )

    await usuario.click(
      screen.getByRole('button', { name: /^alterar edição$/i }),
    )
    expect(onAlterarEdicaoPolo).toHaveBeenCalledWith(['1'])

    await usuario.click(
      screen.getByRole('button', { name: /^alterar tipo de polo$/i }),
    )
    expect(onAlterarTipoPolo).toHaveBeenCalledWith(['1'])

    await usuario.click(screen.getByRole('button', { name: /^cancelar$/i }))
    expect(screen.queryByText(/ue selecionada/i)).not.toBeInTheDocument()
  })

  it('chama visualizar e alterar edição pelos botões da linha', async () => {
    const usuario = userEvent.setup()
    const onVisualizarPolo = vi.fn()
    const onAlterarEdicaoPolo = vi.fn()

    render(
      <TabelaComSelecao
        onVisualizarPolo={onVisualizarPolo}
        onAlterarEdicaoPolo={onAlterarEdicaoPolo}
      />,
    )

    await usuario.click(
      screen.getByRole('button', {
        name: /visualizar polo cei diret aloysio/i,
      }),
    )
    expect(onVisualizarPolo).toHaveBeenCalledWith('1')

    await usuario.click(
      screen.getByRole('button', {
        name: /alterar edição do polo cei diret aloysio/i,
      }),
    )
    expect(onAlterarEdicaoPolo).toHaveBeenCalledWith(['1'])
  })

  it('ordena por Gestão em ordem descendente ao clicar duas vezes', async () => {
    const usuario = userEvent.setup()

    render(<TabelaComSelecao />)

    const botaoGestao = screen.getByRole('button', {
      name: /ordenar por gestão/i,
    })

    await usuario.click(botaoGestao)
    await usuario.click(botaoGestao)

    const linhas = screen.getAllByRole('row').slice(1)
    const primeiroGestao = within(linhas[0]).getByText(/parceira|direta/i)
    const segundoGestao = within(linhas[1]).getByText(/parceira|direta/i)

    expect(primeiroGestao).toHaveTextContent(/parceira/i)
    expect(segundoGestao).toHaveTextContent(/direta/i)
  })

  it('mantém empate estável quando os valores da coluna são iguais', async () => {
    const usuario = userEvent.setup()
    const polosIguais: DefinicaoPolo[] = [
      { ...poloDireta, id: 'a', gestao: 'Direta' },
      { ...poloParceira, id: 'b', gestao: 'Direta', nomeUe: 'EMEF IGUAL' },
    ]

    render(<TabelaComSelecao polos={polosIguais} />)

    await usuario.click(
      screen.getByRole('button', { name: /ordenar por gestão/i }),
    )

    const linhas = screen.getAllByRole('row').slice(1)
    expect(linhas).toHaveLength(2)
    expect(within(linhas[0]).getByText(/^direta$/i)).toBeInTheDocument()
    expect(within(linhas[1]).getByText(/^direta$/i)).toBeInTheDocument()
  })
})
