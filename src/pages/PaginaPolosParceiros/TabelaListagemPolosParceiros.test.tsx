import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import type { PoloParceiro } from '../../services/poloParceiro/types'

import { TabelaListagemPolosParceiros } from './TabelaListagemPolosParceiros'

const poloExemplo: PoloParceiro = {
  id: '1',
  dre: 'BUTANTA',
  tipoUe: 'CEI',
  nomePolo: 'CEI DIRET ALOYSIO DE MENEZES PINTO NETO',
  nomeOsc: 'Cantinho Feliz',
}

const propsPaginacaoPadrao = {
  paginaAtual: 1,
  totalPaginas: 20,
  itensPorPagina: 10,
  onMudarPagina: vi.fn(),
  onMudarItensPorPagina: vi.fn(),
  onEditarPolo: vi.fn(),
}

describe('TabelaListagemPolosParceiros', () => {
  it('exibe mensagem de listagem vazia', () => {
    render(
      <TabelaListagemPolosParceiros
        polos={[]}
        {...propsPaginacaoPadrao}
      />,
    )

    expect(screen.getByText(/resultados da pesquisa/i)).toBeInTheDocument()
    expect(screen.getByText(/sem dados/i)).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  it('renderiza tabela com colunas, checkbox e ação de editar', async () => {
    const usuario = userEvent.setup()
    const onEditarPolo = vi.fn()

    render(
      <TabelaListagemPolosParceiros
        polos={[poloExemplo]}
        {...propsPaginacaoPadrao}
        onEditarPolo={onEditarPolo}
      />,
    )

    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(
      screen.getByRole('columnheader', { name: /nome do polo/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('columnheader', { name: /nome da osc/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('checkbox', {
        name: /selecionar todos os polos da página/i,
      }),
    ).toBeInTheDocument()
    expect(screen.getByText(/cantinho feliz/i)).toBeInTheDocument()

    await usuario.click(
      screen.getByRole('button', {
        name: /editar polo cei diret aloysio de menezes pinto neto/i,
      }),
    )

    expect(onEditarPolo).toHaveBeenCalledWith('1')
  })
})
