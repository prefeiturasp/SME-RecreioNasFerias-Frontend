import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { FiltrosPolo } from '@/constants/filtroPolos'
import { Filtros } from './Filtros'

const { useGetDresMock, useGetTiposEscolaMock } = vi.hoisted(() => ({
  useGetDresMock: vi.fn(),
  useGetTiposEscolaMock: vi.fn(),
}))

const dres = [
  {
    codigo_dre: '108100',
    nome_dre: 'DIRETORIA REGIONAL DE EDUCACAO BUTANTA',
    sigla_dre: 'BT',
  },
]

const tiposEscola = [{ codigo: 1, descricao_sigla: 'EMEF' }]

const valoresIniciais: FiltrosPolo = {
  busca: '',
  dre_codigo_eol: '',
  tipo_ue: '',
}

function renderFiltros(
  sobrescritas: Partial<{
    valores: FiltrosPolo
    onChange: (valores: FiltrosPolo) => void
    onFiltrar: () => void
    onLimpar: () => void
  }> = {},
) {
  return render(
    <Filtros
      valores={valoresIniciais}
      onChange={vi.fn()}
      onFiltrar={vi.fn()}
      onLimpar={vi.fn()}
      {...sobrescritas}
    />,
  )
}

vi.mock('@/hooks/useGetDres', () => ({
  useGetDres: useGetDresMock,
}))

vi.mock('@/hooks/useGetTiposEscola', () => ({
  useGetTiposEscola: useGetTiposEscolaMock,
}))

describe('Filtros de polos', () => {
  beforeEach(() => {
    useGetDresMock.mockReturnValue({
      data: dres,
      isLoading: false,
      isError: false,
    })
    useGetTiposEscolaMock.mockReturnValue({
      data: tiposEscola,
      isLoading: false,
      isError: false,
    })
  })

  it('renderiza os campos e as opções carregadas', async () => {
    const usuario = userEvent.setup()
    renderFiltros()

    expect(screen.getByLabelText(/filtrar por nome/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Filtrar' })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Limpar Filtros' }),
    ).toBeInTheDocument()

    await usuario.click(screen.getByLabelText(/filtrar por dre/i))
    expect(
      await screen.findByRole('option', { name: /butanta/i }),
    ).toBeInTheDocument()
    await usuario.click(await screen.findByRole('option', { name: /butanta/i }))

    await usuario.click(screen.getByLabelText(/filtrar por tipo de ue/i))
    const opcaoTipoUe = await screen.findByRole('option', { name: 'EMEF' })
    expect(opcaoTipoUe).toBeInTheDocument()
    await usuario.click(opcaoTipoUe)
  })

  it('notifica alterações nos campos e os comandos do filtro', async () => {
    const usuario = userEvent.setup()
    const onChange = vi.fn()
    const onFiltrar = vi.fn()
    const onLimpar = vi.fn()
    renderFiltros({ onChange, onFiltrar, onLimpar })

    await usuario.type(screen.getByLabelText(/filtrar por nome/i), 'Polo Teste')
    expect(onChange).toHaveBeenLastCalledWith({
      ...valoresIniciais,
      busca: 'e',
    })

    await usuario.click(screen.getByLabelText(/filtrar por dre/i))
    await usuario.click(await screen.findByRole('option', { name: /butanta/i }))
    expect(onChange).toHaveBeenLastCalledWith({
      ...valoresIniciais,
      dre_codigo_eol: '108100',
    })

    await usuario.click(screen.getByRole('button', { name: 'Filtrar' }))
    await usuario.click(screen.getByRole('button', { name: 'Limpar Filtros' }))

    expect(onFiltrar).toHaveBeenCalledOnce()
    expect(onLimpar).toHaveBeenCalledOnce()
  })

  it('exibe a opção de carregamento das DREs', async () => {
    useGetDresMock.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    })
    const usuario = userEvent.setup()
    renderFiltros()

    await usuario.click(screen.getByLabelText(/filtrar por dre/i))
    expect(
      await screen.findByRole('option', { name: 'Carregando...' }),
    ).toBeInTheDocument()
  })

  it('exibe a opção de carregamento dos tipos de escola', async () => {
    useGetTiposEscolaMock.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    })
    const usuario = userEvent.setup()
    renderFiltros()

    await usuario.click(screen.getByLabelText(/filtrar por tipo de ue/i))
    expect(
      await screen.findByRole('option', { name: 'Carregando...' }),
    ).toBeInTheDocument()
  })

  it('exibe a opção de erro dos tipos de escola', async () => {
    useGetTiposEscolaMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    })
    const usuario = userEvent.setup()
    renderFiltros()

    await usuario.click(screen.getByLabelText(/filtrar por tipo de ue/i))
    expect(
      await screen.findByRole('option', {
        name: 'Erro ao carregar tipos de escola',
      }),
    ).toBeInTheDocument()
  })

  it('exibe a opção de erro das DREs', async () => {
    useGetDresMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    })
    const usuario = userEvent.setup()
    renderFiltros()

    await usuario.click(screen.getByLabelText(/filtrar por dre/i))
    expect(
      await screen.findByRole('option', { name: 'Erro ao carregar DREs' }),
    ).toBeInTheDocument()
  })
})
