import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { FILTROS_LISTAGEM_DEFINICAO_POLOS_INICIAIS } from '../../services/definicaoPolo/types'

import { FiltrosDefinicaoPolos } from './FiltrosDefinicaoPolos'

const { useOpcoesFiltroDefinicaoPolosMock } = vi.hoisted(() => ({
  useOpcoesFiltroDefinicaoPolosMock: vi.fn(),
}))

vi.mock('../../services/definicaoPolo/useOpcoesFiltroDefinicaoPolos', () => ({
  useOpcoesFiltroDefinicaoPolos: () => useOpcoesFiltroDefinicaoPolosMock(),
}))

const opcoesPadrao = {
  opcoesDre: ['DIRETORIA REGIONAL DE EDUCACAO BUTANTA'],
  opcoesTipoUe: ['CEI DIRET', 'EMEF'],
  opcoesGestao: ['Parceira', 'Direta'],
  opcoesNomeEdicao: ['Janeiro 2025', '-'],
  opcoesTipoPolo: ['Pendente', 'Polo oficial'],
  estaCarregando: false,
}

describe('FiltrosDefinicaoPolos', () => {
  beforeEach(() => {
    useOpcoesFiltroDefinicaoPolosMock.mockReturnValue(opcoesPadrao)
  })

  it('expande e recolhe os filtros via aria-expanded', async () => {
    const usuario = userEvent.setup()

    render(
      <FiltrosDefinicaoPolos
        valores={FILTROS_LISTAGEM_DEFINICAO_POLOS_INICIAIS}
        onChange={vi.fn()}
        onLimpar={vi.fn()}
        onFiltrar={vi.fn()}
      />,
    )

    const botaoCabecalho = screen.getByRole('button', {
      name: /filtrar polos/i,
    })

    expect(botaoCabecalho).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByLabelText(/filtrar por dre/i)).toBeInTheDocument()

    await usuario.click(botaoCabecalho)

    expect(botaoCabecalho).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByLabelText(/filtrar por dre/i)).not.toBeInTheDocument()

    await usuario.click(botaoCabecalho)

    expect(botaoCabecalho).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByLabelText(/filtrar por dre/i)).toBeInTheDocument()
  })

  it('exibe mensagem de carregamento quando estaCarregando é true', () => {
    useOpcoesFiltroDefinicaoPolosMock.mockReturnValue({
      ...opcoesPadrao,
      estaCarregando: true,
    })

    render(
      <FiltrosDefinicaoPolos
        valores={FILTROS_LISTAGEM_DEFINICAO_POLOS_INICIAIS}
        onChange={vi.fn()}
        onLimpar={vi.fn()}
        onFiltrar={vi.fn()}
      />,
    )

    expect(
      screen.getByText(/carregando opções dos filtros/i),
    ).toBeInTheDocument()
    expect(screen.queryByLabelText(/gestão/i)).not.toBeInTheDocument()
  })

  it('chama onChange ao selecionar gestão Parceira', async () => {
    const usuario = userEvent.setup()
    const onChange = vi.fn()

    render(
      <FiltrosDefinicaoPolos
        valores={FILTROS_LISTAGEM_DEFINICAO_POLOS_INICIAIS}
        onChange={onChange}
        onLimpar={vi.fn()}
        onFiltrar={vi.fn()}
      />,
    )

    await usuario.selectOptions(screen.getByLabelText(/^gestão$/i), 'Parceira')

    expect(onChange).toHaveBeenCalledWith({
      ...FILTROS_LISTAGEM_DEFINICAO_POLOS_INICIAIS,
      gestao: 'Parceira',
    })
  })

  it('chama onChange ao alterar DRE, Tipo de UE, nome/EOL, edição e tipo', async () => {
    const usuario = userEvent.setup()
    const onChange = vi.fn()

    render(
      <FiltrosDefinicaoPolos
        valores={FILTROS_LISTAGEM_DEFINICAO_POLOS_INICIAIS}
        onChange={onChange}
        onLimpar={vi.fn()}
        onFiltrar={vi.fn()}
      />,
    )

    await usuario.selectOptions(
      screen.getByLabelText(/filtrar por dre/i),
      'DIRETORIA REGIONAL DE EDUCACAO BUTANTA',
    )
    await usuario.selectOptions(
      screen.getByLabelText(/filtrar por tipo de ue/i),
      'EMEF',
    )
    fireEvent.change(
      screen.getByLabelText(/filtrar por nome da ue ou código eol/i),
      { target: { value: '019241' } },
    )
    await usuario.selectOptions(
      screen.getByLabelText(/filtrar por nome da edição/i),
      'Janeiro 2025',
    )
    await usuario.selectOptions(
      screen.getByLabelText(/^tipo de polo$/i),
      'Pendente',
    )

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        dre: 'DIRETORIA REGIONAL DE EDUCACAO BUTANTA',
      }),
    )
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ tipoUe: 'EMEF' }),
    )
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ nomeUeOuCodigoEol: '019241' }),
    )
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ nomeEdicao: 'Janeiro 2025' }),
    )
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ tipoPolo: 'Pendente' }),
    )
  })

  it('chama onFiltrar e onLimpar pelos botões', async () => {
    const usuario = userEvent.setup()
    const onFiltrar = vi.fn()
    const onLimpar = vi.fn()

    render(
      <FiltrosDefinicaoPolos
        valores={FILTROS_LISTAGEM_DEFINICAO_POLOS_INICIAIS}
        onChange={vi.fn()}
        onLimpar={onLimpar}
        onFiltrar={onFiltrar}
      />,
    )

    await usuario.click(screen.getByRole('button', { name: /^filtrar$/i }))
    await usuario.click(screen.getByRole('button', { name: /limpar filtros/i }))

    expect(onFiltrar).toHaveBeenCalledTimes(1)
    expect(onLimpar).toHaveBeenCalledTimes(1)
  })

  it('exibe opções de DRE, Tipo de UE, Gestão, Nome da Edição e Tipo de Polo', () => {
    render(
      <FiltrosDefinicaoPolos
        valores={FILTROS_LISTAGEM_DEFINICAO_POLOS_INICIAIS}
        onChange={vi.fn()}
        onLimpar={vi.fn()}
        onFiltrar={vi.fn()}
      />,
    )

    expect(
      screen.getByRole('option', {
        name: /diretoria regional de educacao butanta/i,
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('option', { name: /cei diret/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('option', { name: /^parceira$/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('option', { name: /^direta$/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('option', { name: /janeiro 2025/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('option', { name: /polo oficial/i }),
    ).toBeInTheDocument()
  })
})
