import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { PoloDetalhado } from '@/services/polo/types'
import { PoloListagem } from './index'

const { useGetPolosMock } = vi.hoisted(() => ({
  useGetPolosMock: vi.fn(),
}))

vi.mock('@/hooks/useGetPolos', () => ({
  useGetPolos: useGetPolosMock,
}))

vi.mock('@/hooks/useGetDres', () => ({
  useGetDres: () => ({
    data: [
      {
        codigo_dre: '108100',
        nome_dre: 'DIRETORIA REGIONAL DE EDUCACAO BUTANTA',
        sigla_dre: 'BT',
      },
    ],
    isLoading: false,
    isError: false,
  }),
}))

vi.mock('@/hooks/useGetTiposEscola', () => ({
  useGetTiposEscola: () => ({
    data: [{ codigo: 1, descricao_sigla: 'EMEF' }],
    isLoading: false,
    isError: false,
  }),
}))

const polo: PoloDetalhado = {
  uuid: '11111111-1111-1111-1111-111111111111',
  codigo_eol: '123456',
  nome_polo: 'Polo Teste',
  nome_osc: 'OSC Teste',
  dre_nome: 'DIRETORIA REGIONAL DE EDUCACAO BUTANTA',
  dre_codigo_eol: '108100',
  tipo: 'pendente',
  status: 'ativo',
  gestao: 'parceira',
  tipo_ue: 'EMEF',
  quantidade_maxima_alunos: 50,
  cep: '01310100',
  tipo_logradouro: 'Avenida',
  logradouro: 'Paulista',
  bairro: 'Bela Vista',
  numero: '1000',
  complemento: '',
  nome_gestor: 'Gestor Teste',
  email: 'polo@teste.com',
  telefone: '11999999999',
  observacoes_gerais: '',
  ativo: true,
  criado_em: '2026-08-27T11:28:47.128Z',
  atualizado_em: '2026-08-27T11:28:47.128Z',
}

const segundoPolo: PoloDetalhado = {
  ...polo,
  uuid: '22222222-2222-2222-2222-222222222222',
  nome_polo: 'Outro Polo',
  nome_osc: 'Outra OSC',
  dre_nome: 'DRE Ipiranga',
  tipo_ue: 'CEI',
  gestao: 'parceira',
  status: 'inativo',
}

function renderListagem() {
  return render(
    <MemoryRouter>
      <PoloListagem />
    </MemoryRouter>,
  )
}

describe('PoloListagem', () => {
  beforeEach(() => {
    useGetPolosMock.mockReset()
    useGetPolosMock.mockReturnValue({
      data: [polo],
      isPending: false,
      isError: false,
      error: null,
    })
  })

  it('exibe o carregamento da listagem', () => {
    useGetPolosMock.mockReturnValueOnce({
      data: undefined,
      isPending: true,
      isError: false,
      error: null,
    })
    renderListagem()
    expect(screen.getByText('Carregando polos...')).toBeInTheDocument()
  })

  it('exibe o erro da listagem', () => {
    useGetPolosMock.mockReturnValue({
      data: undefined,
      isPending: false,
      isError: true,
      error: {
        response: { data: { detalhe: 'Falha ao carregar polos.' } },
      },
    })
    renderListagem()
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Falha ao carregar polos.',
    )
  })

  it('renderiza a tabela e o link para edição', async () => {
    renderListagem()

    expect(await screen.findByRole('table')).toBeInTheDocument()
    expect(screen.getByText('Polo Teste')).toBeInTheDocument()
    expect(screen.getByText('OSC Teste')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /editar polo polo teste/i }),
    ).toHaveAttribute('href', `/editar-polo-parceiro/${polo.uuid}`)
  })

  it('ordena por cada coluna e permite alterar itens por página', async () => {
    useGetPolosMock.mockReturnValue({
      data: [polo, segundoPolo],
      isPending: false,
      isError: false,
      error: null,
    })
    const usuario = userEvent.setup()
    renderListagem()

    for (const coluna of [
      'Nome do polo',
      'Nome da OSC',
      'DRE',
      'Tipo de UE',
      'Gestão',
      'Status',
    ]) {
      await usuario.click(
        screen.getByRole('button', {
          name: new RegExp(`ordenar por ${coluna}`, 'i'),
        }),
      )
    }

    await usuario.click(
      screen.getByRole('combobox', { name: /itens por página/i }),
    )
    await usuario.click(await screen.findByRole('option', { name: '20' }))

    expect(screen.getAllByRole('link', { name: /editar polo/i })).toHaveLength(
      2,
    )
  })

  it('exibe mensagens diferentes para listagem vazia com e sem filtros', async () => {
    useGetPolosMock.mockReturnValue({
      data: [],
      isPending: false,
      isError: false,
      error: null,
    })
    renderListagem()
    expect(
      await screen.findByText('Nenhum polo cadastrado'),
    ).toBeInTheDocument()

    const usuario = userEvent.setup()
    await usuario.type(
      screen.getByLabelText(/filtrar por nome/i),
      'Polo inexistente',
    )
    await usuario.click(screen.getByRole('button', { name: 'Filtrar' }))
    expect(
      await screen.findByText('Nenhum resultado para os filtros selecionados'),
    ).toBeInTheDocument()

    await usuario.click(screen.getByRole('button', { name: 'Limpar Filtros' }))
    expect(screen.getByLabelText(/filtrar por nome/i)).toHaveValue('')
  })

  it('aplica os filtros selecionados ao consultar a listagem', async () => {
    useGetPolosMock.mockImplementation(
      (busca?: string, dre?: string, tipoUe?: string) => ({
        data: [polo],
        isPending: false,
        isError: false,
        error: null,
        filtros: [busca, dre, tipoUe],
      }),
    )
    const usuario = userEvent.setup()
    renderListagem()

    await usuario.click(screen.getByLabelText(/filtrar por dre/i))
    await usuario.click(await screen.findByRole('option', { name: /butanta/i }))
    await usuario.click(screen.getByRole('button', { name: 'Filtrar' }))

    await waitFor(() => {
      expect(useGetPolosMock).toHaveBeenLastCalledWith('', '108100', '')
    })
  })
})
