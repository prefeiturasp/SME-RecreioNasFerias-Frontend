import type { DefinicaoPoloDetalhe } from '@/services/definicaoPolo/types'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DefinicaoPoloForm } from './index'

const {
  obterDefinicaoPoloMock,
  atualizarDefinicaoPoloMock,
  toastMock,
  dismissToastMock,
} = vi.hoisted(() => ({
  obterDefinicaoPoloMock: vi.fn(),
  atualizarDefinicaoPoloMock: vi.fn(),
  toastMock: vi.fn(),
  dismissToastMock: vi.fn(),
}))

vi.mock('@/services/definicaoPolo/obterDefinicaoPolo', async (importOriginal) => {
  const actual =
    await importOriginal<
      typeof import('@/services/definicaoPolo/obterDefinicaoPolo')
    >()

  return {
    ...actual,
    obterDefinicaoPolo: obterDefinicaoPoloMock,
  }
})

vi.mock(
  '@/services/definicaoPolo/atualizarDefinicaoPolo',
  async (importOriginal) => {
    const actual =
      await importOriginal<
        typeof import('@/services/definicaoPolo/atualizarDefinicaoPolo')
      >()

    return {
      ...actual,
      atualizarDefinicaoPolo: atualizarDefinicaoPoloMock,
    }
  },
)

vi.mock('@/hooks/useToast', () => ({
  useToast: () => ({
    showToast: toastMock,
    dismissToast: dismissToastMock,
  }),
}))

const idDefinicao = '11c43c20-dfcb-4a26-a677-30703b7de766'

const definicaoCarregada: DefinicaoPoloDetalhe = {
  uuid: idDefinicao,
  polo: {
    uuid: 'f05bc2c0-4728-4907-a10e-4971d06103fe',
    codigo_eol: '400496',
    nome_polo: '13 DE MAIO',
    nome_osc: '',
    dre_nome: 'DIRETORIA REGIONAL DE EDUCACAO IPIRANGA',
    dre_codigo_eol: '108600',
    tipo: 'pendente',
    status: 'ativo',
    gestao: 'direta',
    tipo_ue: 'CEI DIRET',
    quantidade_maxima_alunos: 100,
    cep: '04201000',
    tipo_logradouro: 'Rua',
    logradouro: 'Treze de Maio',
    bairro: 'Ipiranga',
    numero: '100',
    complemento: '',
    nome_gestor: 'Diretor Exemplo',
    email: 'polo@exemplo.com',
    telefone: '1133334444',
    observacoes_gerais: '',
    ativo: true,
    endereco_completo: 'Rua Treze de Maio, 100 - Ipiranga',
  },
  edicao: {
    uuid: '2da0f4f1-ef50-4346-b482-c06a237a7a8b',
    nome: 'edicao de fevereiro 2',
  },
  tipo: 'reserva',
  projecao_inscritos: 10,
  total_inscritos: 13,
  ponto_focal_nome: '',
  ponto_focal_telefone: '',
  ponto_focal_email: '',
  ativo: true,
  resultado_final_de_inscritos: 8,
}

function criarUsuario() {
  return userEvent.setup({ delay: null })
}

function ListagemStub() {
  const location = useLocation()
  const estado = location.state as { definicaoAtualizada?: boolean } | null

  return (
    <div>
      <p>Listagem de definicoes</p>
      {estado?.definicaoAtualizada ? <p>Definicao atualizada</p> : null}
    </div>
  )
}

function renderFormulario(definicaoUuid = idDefinicao) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/definicoes-polo/${definicaoUuid}`]}>
        <Routes>
          <Route
            path="/definicoes-polo/:idDefinicao"
            element={<DefinicaoPoloForm definicaoUuid={definicaoUuid} />}
          />
          <Route path="/definicoes-polo" element={<ListagemStub />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('DefinicaoPoloForm', () => {
  beforeEach(() => {
    obterDefinicaoPoloMock.mockReset()
    atualizarDefinicaoPoloMock.mockReset()
    toastMock.mockReset()
    dismissToastMock.mockReset()
    obterDefinicaoPoloMock.mockResolvedValue(definicaoCarregada)
    atualizarDefinicaoPoloMock.mockResolvedValue(definicaoCarregada)
  })

  it('exibe indicador de carregamento enquanto busca a definicao', () => {
    obterDefinicaoPoloMock.mockReturnValue(new Promise(() => undefined))
    renderFormulario()

    expect(
      screen.getByText(/carregando defini/i),
    ).toBeInTheDocument()
  })

  it('preenche campos somente leitura e editaveis a partir da API', async () => {
    renderFormulario()

    expect(await screen.findByLabelText(/tipo de gest/i)).toHaveValue('Direta')
    expect(screen.getByLabelText(/c.digo eol/i)).toHaveValue('400496')
    expect(screen.getByLabelText(/nome da unidade/i)).toHaveValue('13 DE MAIO')
    expect(screen.getByLabelText(/tipo de unidade/i)).toHaveValue('CEI DIRET')
    expect(screen.getByLabelText(/^dre$/i)).toHaveValue(
      'DIRETORIA REGIONAL DE EDUCACAO IPIRANGA',
    )
    expect(screen.getByLabelText(/^cep$/i)).toHaveValue('04201-000')
    expect(screen.getByRole('textbox', { name: /^endere/i })).toHaveValue(
      'Rua Treze de Maio, 100 - Ipiranga',
    )
    expect(screen.getByLabelText(/nome do diretor\/gestor/i)).toHaveValue(
      'Diretor Exemplo',
    )
    expect(screen.getByLabelText(/e-mail do polo/i)).toHaveValue(
      'polo@exemplo.com',
    )
    expect(screen.getByLabelText(/telefone do polo/i)).toHaveValue(
      '1133334444',
    )

    expect(screen.getByLabelText(/^nome$/i)).toHaveValue('')
    expect(screen.getByLabelText(/^telefone$/i)).toHaveValue('')
    expect(screen.getByLabelText(/^email$/i)).toHaveValue('')
    expect(screen.getByLabelText(/proje.*de inscritos/i)).toHaveValue(10)
    expect(screen.getByLabelText(/total de inscritos/i)).toHaveValue('13')
    expect(
      screen.getByLabelText(/resultado final de inscritos/i),
    ).toHaveValue('8')
  })

  it('mantem campos institucionais somente leitura', async () => {
    renderFormulario()

    expect(await screen.findByLabelText(/tipo de gest/i)).toHaveAttribute(
      'readonly',
    )
    expect(screen.getByLabelText(/c.digo eol/i)).toHaveAttribute('readonly')
    expect(screen.getByLabelText(/nome da unidade/i)).toHaveAttribute(
      'readonly',
    )
    expect(screen.getByLabelText(/total de inscritos/i)).toHaveAttribute(
      'readonly',
    )
    expect(
      screen.getByLabelText(/resultado final de inscritos/i),
    ).toHaveAttribute('readonly')
  })

  it('recalcula o total de inscritos ao alterar a projecao', async () => {
    const usuario = criarUsuario()
    renderFormulario()

    const campoProjecao = await screen.findByLabelText(/proje.*de inscritos/i)
    await usuario.clear(campoProjecao)
    await usuario.type(campoProjecao, '11')

    expect(screen.getByLabelText(/total de inscritos/i)).toHaveValue('14')
  })

  it('exibe erros de validacao quando a projecao fica vazia', async () => {
    const usuario = criarUsuario()
    renderFormulario()

    const campoProjecao = await screen.findByLabelText(/proje.*de inscritos/i)
    await usuario.clear(campoProjecao)
    await usuario.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(
      await screen.findByText(/proje.*de inscritos .*obrigat/i),
    ).toBeInTheDocument()
    expect(atualizarDefinicaoPoloMock).not.toHaveBeenCalled()
  })

  it('salva ponto focal e projecao via PUT e navega com toast de sucesso', async () => {
    const usuario = criarUsuario()
    renderFormulario()

    await screen.findByLabelText(/proje.*de inscritos/i)
    await usuario.type(screen.getByLabelText(/^nome$/i), 'Ponto Focal')
    await usuario.type(screen.getByLabelText(/^telefone$/i), '11999998888')
    await usuario.type(
      screen.getByLabelText(/^email$/i),
      'ponto.focal@teste.com',
    )
    await usuario.clear(screen.getByLabelText(/proje.*de inscritos/i))
    await usuario.type(screen.getByLabelText(/proje.*de inscritos/i), '20')
    await usuario.click(screen.getByRole('button', { name: 'Salvar' }))

    await waitFor(() => {
      expect(atualizarDefinicaoPoloMock).toHaveBeenCalledWith(idDefinicao, {
        polo: definicaoCarregada.polo.uuid,
        edicao: definicaoCarregada.edicao.uuid,
        tipo: definicaoCarregada.tipo,
        projecao_inscritos: 20,
        ponto_focal_nome: 'Ponto Focal',
        ponto_focal_telefone: '11999998888',
        ponto_focal_email: 'ponto.focal@teste.com',
      })
    })

    expect(toastMock).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'sucesso-atualizacao-definicao-polo',
        variant: 'success',
      }),
    )
    expect(
      await screen.findByText('Definicao atualizada'),
    ).toBeInTheDocument()
  })

  it('exibe toast de erro quando o GET falha', async () => {
    obterDefinicaoPoloMock.mockRejectedValue({
      response: {
        data: { detalhe: 'Definicao do polo nao encontrada.' },
      },
    })

    renderFormulario()

    await waitFor(() => {
      expect(toastMock).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'erro-carregamento-definicao-polo',
          variant: 'destructive',
          description: 'Definicao do polo nao encontrada.',
        }),
      )
    })
  })

  it('exibe toast de erro quando o PUT falha', async () => {
    const usuario = criarUsuario()
    atualizarDefinicaoPoloMock.mockRejectedValue({
      response: {
        data: { detalhe: 'Nao foi possivel salvar a definicao do polo.' },
      },
    })

    renderFormulario()
    await screen.findByLabelText(/proje.*de inscritos/i)
    await usuario.click(screen.getByRole('button', { name: 'Salvar' }))

    await waitFor(() => {
      expect(toastMock).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'erro-atualizacao-definicao-polo',
          variant: 'destructive',
          description: 'Nao foi possivel salvar a definicao do polo.',
        }),
      )
    })
    expect(
      screen.queryByText('Listagem de definicoes'),
    ).not.toBeInTheDocument()
  })

  it('cancela e volta para a listagem', async () => {
    const usuario = criarUsuario()
    renderFormulario()

    await screen.findByLabelText(/proje.*de inscritos/i)
    await usuario.click(screen.getByRole('button', { name: 'Cancelar' }))

    expect(
      await screen.findByText('Listagem de definicoes'),
    ).toBeInTheDocument()
  })
})
