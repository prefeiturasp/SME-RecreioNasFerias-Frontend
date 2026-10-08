import type { PoloDetalhado } from '@/services/polo/types'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PontoFocalPoloForm } from './index'

const { obterPoloMock, atualizarPontoFocalMock, toastMock, dismissToastMock } =
  vi.hoisted(() => ({
    obterPoloMock: vi.fn(),
    atualizarPontoFocalMock: vi.fn(),
    toastMock: vi.fn(),
    dismissToastMock: vi.fn(),
  }))

vi.mock('@/hooks/useGetPolo', () => ({
  useGetPolo: (poloUuid: string) => {
    const result = obterPoloMock(poloUuid)
    return result
  },
}))

vi.mock('@/hooks/usePatchPontoFocalPolo', () => ({
  usePatchPontoFocalPolo: (poloUuid: string) =>
    atualizarPontoFocalMock(poloUuid),
}))

vi.mock('@/hooks/useToast', () => ({
  useToast: () => ({
    showToast: toastMock,
    dismissToast: dismissToastMock,
  }),
}))

const mockPoloData = {
  uuid: 'polo-uuid-123',
  codigo_eol: 'EOL123',
  nome_polo: 'Polo de Teste',
  gestao: 'direta',
  tipo_ue: 'Escola',
  dre_nome: 'DRE Centro',
  cep: '01310100',
  endereco_completo: 'Rua Teste, 123',
  email: 'polo@example.com',
  telefone: '(11) 3333-3333',
  nome_gestor: 'João Silva',
  ponto_focal_nome: 'Maria Santos',
  ponto_focal_telefone: '11988887777',
  ponto_focal_email: 'maria@example.com',
} as PoloDetalhado

const createMockPoloQuery = (overrides = {}) => ({
  data: mockPoloData,
  isLoading: false,
  isPending: false,
  isError: false,
  error: null,
  ...overrides,
})

const createMockMutation = (overrides = {}) => ({
  mutate: vi.fn(),
  isError: false,
  error: null,
  reset: vi.fn(),
  isPending: false,
  ...overrides,
})

const criarMutacaoComSucesso = () =>
  vi.fn((...args: unknown[]) => {
    const options = args[1] as { onSuccess?: () => void } | undefined
    options?.onSuccess?.()
  })

const renderWithRouter = (component: React.ReactNode) => {
  const queryClient = new QueryClient()

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter
        initialEntries={['/ponto-focal-polo/polo-uuid-123']}
        initialIndex={0}
      >
        <Routes>
          <Route path="/ponto-focal-polo/:poloUuid" element={component} />
          <Route path="/definicoes-polo" element={<div>Definições</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('PontoFocalPoloForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Estados de carregamento e erro', () => {
    it('deve exibir o indicador de carregamento enquanto o polo está sendo carregado', () => {
      obterPoloMock.mockReturnValue(createMockPoloQuery({ isPending: true }))
      atualizarPontoFocalMock.mockReturnValue(createMockMutation())

      renderWithRouter(<PontoFocalPoloForm poloUuid="polo-uuid-123" />)

      expect(screen.getByText('Carregando polo...')).toBeInTheDocument()
    })

    it('deve retornar nulo quando os dados do polo não estiverem disponíveis e não estiver carregando', () => {
      obterPoloMock.mockReturnValue(createMockPoloQuery({ data: null }))
      atualizarPontoFocalMock.mockReturnValue(createMockMutation())

      const { container } = renderWithRouter(
        <PontoFocalPoloForm poloUuid="polo-uuid-123" />,
      )

      expect(container.firstChild).toBeNull()
    })

    it('deve exibir uma notificação de erro quando falhar o carregamento do polo', async () => {
      const errorResponse = {
        response: { data: { detalhe: 'Polo não encontrado' } },
      }

      obterPoloMock.mockReturnValue(
        createMockPoloQuery({
          isError: true,
          error: errorResponse,
        }),
      )
      atualizarPontoFocalMock.mockReturnValue(createMockMutation())

      renderWithRouter(<PontoFocalPoloForm poloUuid="polo-uuid-123" />)

      await waitFor(() => {
        expect(toastMock).toHaveBeenCalledWith(
          expect.objectContaining({
            id: 'erro-carregamento-polo-sem-definicao',
            variant: 'destructive',
            title: 'Erro ao carregar polo',
            description: 'Polo não encontrado',
          }),
        )
      })
    })
  })

  describe('Exibição do formulário', () => {
    beforeEach(() => {
      obterPoloMock.mockReturnValue(createMockPoloQuery())
      atualizarPontoFocalMock.mockReturnValue(createMockMutation())
    })

    it('deve exibir o formulário com todas as seções', () => {
      renderWithRouter(<PontoFocalPoloForm poloUuid="polo-uuid-123" />)

      expect(
        screen.getByLabelText('Formulário de ponto focal do polo'),
      ).toBeInTheDocument()
      expect(screen.getByText('Informações Gerais')).toBeInTheDocument()
      expect(screen.getByText('Informações de contato')).toBeInTheDocument()
      expect(screen.getByText('Ponto focal')).toBeInTheDocument()

      // Verifica os títulos das seções pelos respectivos IDs
      expect(document.querySelector('#secao-endereco-polo')).toHaveTextContent(
        'Endereço',
      )
    })

    it('deve exibir os campos somente para leitura com os dados do polo', () => {
      renderWithRouter(<PontoFocalPoloForm poloUuid="polo-uuid-123" />)

      expect(screen.getByDisplayValue('Direta')).toBeInTheDocument()
      expect(screen.getByDisplayValue('EOL123')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Polo de Teste')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Escola')).toBeInTheDocument()
      expect(screen.getByDisplayValue('DRE Centro')).toBeInTheDocument()
    })

    it('deve exibir os campos do formulário do ponto focal', () => {
      renderWithRouter(<PontoFocalPoloForm poloUuid="polo-uuid-123" />)

      expect(screen.getByDisplayValue('Maria Santos')).toBeInTheDocument()
      expect(screen.getByDisplayValue('maria@example.com')).toBeInTheDocument()
    })

    it('deve formatar o CEP corretamente', () => {
      renderWithRouter(<PontoFocalPoloForm poloUuid="polo-uuid-123" />)

      expect(screen.getByDisplayValue('01310-100')).toBeInTheDocument()
    })

    it('deve exibir a gestão como Parceira quando aplicável', () => {
      obterPoloMock.mockReturnValue(
        createMockPoloQuery({
          data: { ...mockPoloData, gestao: 'parceira' },
        }),
      )

      renderWithRouter(<PontoFocalPoloForm poloUuid="polo-uuid-123" />)

      expect(screen.getByDisplayValue('Parceira')).toBeInTheDocument()
    })

    it('deve formatar o telefone com parênteses', async () => {
      renderWithRouter(<PontoFocalPoloForm poloUuid="polo-uuid-123" />)

      await waitFor(() => {
        const phoneInputs = screen.getAllByDisplayValue(/^\(11\)/)
        expect(phoneInputs.length).toBeGreaterThan(0)
      })
    })

    it('deve exibir os botões Cancelar e Salvar', () => {
      renderWithRouter(<PontoFocalPoloForm poloUuid="polo-uuid-123" />)

      expect(
        screen.getByRole('button', { name: 'Cancelar' }),
      ).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument()
    })
  })

  describe('Envio do formulário', () => {
    beforeEach(() => {
      obterPoloMock.mockReturnValue(createMockPoloQuery())
    })

    it('deve enviar o formulário com dados válidos', async () => {
      const mutateFn = vi.fn()
      atualizarPontoFocalMock.mockReturnValue(
        createMockMutation({ mutate: mutateFn }),
      )

      const user = userEvent.setup()
      renderWithRouter(<PontoFocalPoloForm poloUuid="polo-uuid-123" />)

      const saveButton = screen.getByRole('button', { name: 'Salvar' })
      await user.click(saveButton)

      await waitFor(() => {
        expect(mutateFn).toHaveBeenCalledWith(
          expect.objectContaining({
            ponto_focal_nome: 'Maria Santos',
            ponto_focal_email: 'maria@example.com',
          }),
          expect.any(Object),
        )
      })
    })

    it('deve permitir alterar os valores dos campos do formulário', async () => {
      const mutateFn = vi.fn()
      atualizarPontoFocalMock.mockReturnValue(
        createMockMutation({ mutate: mutateFn }),
      )

      const user = userEvent.setup()
      renderWithRouter(<PontoFocalPoloForm poloUuid="polo-uuid-123" />)

      const nomeInputs = screen.getAllByPlaceholderText('Adicionar nome')
      await user.clear(nomeInputs[0])
      await user.type(nomeInputs[0], 'Novo Nome')

      const saveButton = screen.getByRole('button', { name: 'Salvar' })
      await user.click(saveButton)

      await waitFor(() => {
        expect(mutateFn).toHaveBeenCalledWith(
          expect.objectContaining({
            ponto_focal_nome: 'Novo Nome',
          }),
          expect.any(Object),
        )
      })
    })

    it('deve remover espaços excedentes do telefone antes do envio', async () => {
      const mutateFn = vi.fn()
      atualizarPontoFocalMock.mockReturnValue(
        createMockMutation({ mutate: mutateFn }),
      )

      const user = userEvent.setup()
      renderWithRouter(<PontoFocalPoloForm poloUuid="polo-uuid-123" />)

      const phoneInputs = screen.getAllByPlaceholderText('(00) 0000-0000')
      await user.clear(phoneInputs[0])
      await user.type(phoneInputs[0], '  (11) 98888-7777  ')

      const saveButton = screen.getByRole('button', { name: 'Salvar' })
      await user.click(saveButton)

      await waitFor(() => {
        expect(mutateFn).toHaveBeenCalledWith(
          expect.objectContaining({
            ponto_focal_telefone: '(11) 98888-7777',
          }),
          expect.any(Object),
        )
      })
    })

    it('deve converter o e-mail para minúsculas e remover espaços excedentes antes do envio', async () => {
      const mutateFn = vi.fn()
      atualizarPontoFocalMock.mockReturnValue(
        createMockMutation({ mutate: mutateFn }),
      )

      const user = userEvent.setup()
      renderWithRouter(<PontoFocalPoloForm poloUuid="polo-uuid-123" />)

      const emailInputs = screen.getAllByPlaceholderText('e-mail@e-mail.com')
      await user.clear(emailInputs[0])
      await user.type(emailInputs[0], '  MARIA@EXAMPLE.COM  ')

      const saveButton = screen.getByRole('button', { name: 'Salvar' })
      await user.click(saveButton)

      await waitFor(() => {
        expect(mutateFn).toHaveBeenCalledWith(
          expect.objectContaining({
            ponto_focal_email: 'maria@example.com',
          }),
          expect.any(Object),
        )
      })
    })

    it('deve tratar o sucesso da atualização e navegar para a listagem', async () => {
      const mutateFn = criarMutacaoComSucesso()
      atualizarPontoFocalMock.mockReturnValue(
        createMockMutation({ mutate: mutateFn }),
      )

      const user = userEvent.setup()
      renderWithRouter(<PontoFocalPoloForm poloUuid="polo-uuid-123" />)

      const saveButton = screen.getByRole('button', { name: 'Salvar' })
      await user.click(saveButton)

      await waitFor(() => {
        expect(toastMock).toHaveBeenCalledWith(
          expect.objectContaining({
            id: 'sucesso-atualizacao-ponto-focal-polo',
            variant: 'success',
            description: 'Ponto focal do polo atualizado com sucesso!',
            duration: 3000,
          }),
        )
      })

      await waitFor(() => {
        expect(screen.getByText('Definições')).toBeInTheDocument()
      })
    })

    it('deve desabilitar o botão Salvar enquanto a atualização estiver em andamento', async () => {
      atualizarPontoFocalMock.mockReturnValue(
        createMockMutation({ isPending: true }),
      )

      renderWithRouter(<PontoFocalPoloForm poloUuid="polo-uuid-123" />)

      const saveButton = screen.getByRole('button', { name: 'Salvando...' })
      expect(saveButton).toBeDisabled()
    })
  })

  describe('Tratamento de erros', () => {
    beforeEach(() => {
      obterPoloMock.mockReturnValue(createMockPoloQuery())
    })

    it('deve exibir uma notificação de erro quando a atualização falhar', async () => {
      const errorResponse = {
        response: { data: { detalhe: 'Erro ao atualizar ponto focal' } },
      }

      const mutateFn = vi.fn((options) => {
        options.onSuccess?.()
      })

      atualizarPontoFocalMock.mockReturnValue(
        createMockMutation({
          mutate: mutateFn,
          isError: true,
          error: errorResponse,
        }),
      )

      renderWithRouter(<PontoFocalPoloForm poloUuid="polo-uuid-123" />)

      await waitFor(() => {
        expect(toastMock).toHaveBeenCalledWith(
          expect.objectContaining({
            id: 'erro-atualizacao-ponto-focal-polo',
            variant: 'destructive',
            title: 'Erro ao salvar ponto focal',
            description: 'Erro ao atualizar ponto focal',
          }),
        )
      })
    })

    it('deve limpar e dispensar o erro ao tentar novamente após uma falha no envio', async () => {
      const resetFn = vi.fn()
      const mutateFn = vi.fn()

      atualizarPontoFocalMock.mockReturnValue(
        createMockMutation({
          mutate: mutateFn,
          isError: true,
          error: { response: { data: { detalhe: 'Erro' } } },
          reset: resetFn,
        }),
      )

      const user = userEvent.setup()
      renderWithRouter(<PontoFocalPoloForm poloUuid="polo-uuid-123" />)

      const saveButton = screen.getByRole('button', { name: 'Salvar' })
      await user.click(saveButton)

      await waitFor(() => {
        expect(dismissToastMock).toHaveBeenCalledWith(
          'erro-atualizacao-ponto-focal-polo',
        )
        expect(resetFn).toHaveBeenCalled()
      })
    })
  })

  describe('Navegação', () => {
    beforeEach(() => {
      obterPoloMock.mockReturnValue(createMockPoloQuery())
      atualizarPontoFocalMock.mockReturnValue(createMockMutation())
    })

    it('deve navegar para /definicoes-polo ao clicar no botão Cancelar', async () => {
      const user = userEvent.setup()
      renderWithRouter(<PontoFocalPoloForm poloUuid="polo-uuid-123" />)

      const cancelButton = screen.getByRole('button', { name: 'Cancelar' })
      await user.click(cancelButton)

      await waitFor(() => {
        expect(screen.getByText('Definições')).toBeInTheDocument()
      })
    })

    it('deve navegar para /definicoes-polo com o estado após atualizar com sucesso', async () => {
      const mutateFn = criarMutacaoComSucesso()
      atualizarPontoFocalMock.mockReturnValue(
        createMockMutation({ mutate: mutateFn }),
      )

      const user = userEvent.setup()
      renderWithRouter(<PontoFocalPoloForm poloUuid="polo-uuid-123" />)

      const saveButton = screen.getByRole('button', { name: 'Salvar' })
      await user.click(saveButton)

      await waitFor(() => {
        expect(screen.getByText('Definições')).toBeInTheDocument()
      })
    })
  })

  describe('Inicialização do formulário', () => {
    it('deve inicializar o formulário com valores vazios por padrão', () => {
      obterPoloMock.mockReturnValue(createMockPoloQuery({ data: null }))
      atualizarPontoFocalMock.mockReturnValue(createMockMutation())

      renderWithRouter(<PontoFocalPoloForm poloUuid="polo-uuid-123" />)

      expect(screen.queryByDisplayValue('Maria Santos')).not.toBeInTheDocument()
    })

    it('deve preencher os campos do formulário quando os dados do polo forem carregados', () => {
      obterPoloMock.mockReturnValue(createMockPoloQuery())
      atualizarPontoFocalMock.mockReturnValue(createMockMutation())

      renderWithRouter(<PontoFocalPoloForm poloUuid="polo-uuid-123" />)

      expect(screen.getByDisplayValue('Maria Santos')).toBeInTheDocument()
      expect(screen.getByDisplayValue('maria@example.com')).toBeInTheDocument()
    })

    it('deve tratar um telefone nulo nos dados iniciais', () => {
      obterPoloMock.mockReturnValue(
        createMockPoloQuery({
          data: { ...mockPoloData, ponto_focal_telefone: null },
        }),
      )
      atualizarPontoFocalMock.mockReturnValue(createMockMutation())

      renderWithRouter(<PontoFocalPoloForm poloUuid="polo-uuid-123" />)

      const phoneInputs = screen.getAllByPlaceholderText('(00) 0000-0000')
      expect(phoneInputs[0]).toHaveValue('')
    })

    it('deve tratar um telefone vazio nos dados iniciais', () => {
      obterPoloMock.mockReturnValue(
        createMockPoloQuery({
          data: { ...mockPoloData, ponto_focal_telefone: '' },
        }),
      )
      atualizarPontoFocalMock.mockReturnValue(createMockMutation())

      renderWithRouter(<PontoFocalPoloForm poloUuid="polo-uuid-123" />)

      const phoneInputs = screen.getAllByPlaceholderText('(00) 0000-0000')
      expect(phoneInputs[0]).toHaveValue('')
    })

    it('deve redefinir o formulário quando os dados do polo forem atualizados', async () => {
      const { rerender } = renderWithRouter(
        <PontoFocalPoloForm poloUuid="polo-uuid-123" />,
      )

      obterPoloMock.mockReturnValue(
        createMockPoloQuery({
          data: { ...mockPoloData, ponto_focal_nome: 'Nome atualizado' },
        }),
      )
      atualizarPontoFocalMock.mockReturnValue(createMockMutation())

      rerender(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter
            initialEntries={['/ponto-focal-polo/polo-uuid-123']}
            initialIndex={0}
          >
            <Routes>
              <Route
                path="/ponto-focal-polo/:poloUuid"
                element={<PontoFocalPoloForm poloUuid="polo-uuid-123" />}
              />
              <Route path="/definicoes-polo" element={<div>Definições</div>} />
            </Routes>
          </MemoryRouter>
        </QueryClientProvider>,
      )

      await waitFor(() => {
        expect(screen.getByDisplayValue('Nome atualizado')).toBeInTheDocument()
      })
    })
  })
})
