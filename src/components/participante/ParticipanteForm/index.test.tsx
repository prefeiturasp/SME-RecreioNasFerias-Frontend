class ObservadorTamanho {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver ??=
  ObservadorTamanho as unknown as typeof ResizeObserver
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type {
  InscricaoDetalheApi,
  ParticipanteEol,
  ValoresChoicesInscricao,
} from '@/services/inscricao/types'
import { TIPO_ESTUDANTE_REDE } from './constantes'
import { ParticipanteForm } from './index'

const ROTULO_ESTUDANTE_REDE = 'Estudante da rede'
const ROTULO_ESTUDANTE_EXTERNO = 'Estudante externo'
const ROTULO_QUATRO_A_14 = '4 a 14 anos'

const valoresChoicesExemplo: ValoresChoicesInscricao = {
  grupo_inscricao: [
    { value: 'BERCARIO_I', label: 'Berçário I' },
    { value: 'BERCARIO_II', label: 'Berçário II' },
    { value: 'MINI_GRUPO_I', label: 'Mini Grupo I' },
    { value: 'MINI_GRUPO_II', label: 'Mini Grupo II' },
    { value: 'QUATRO_A_14_ANOS', label: ROTULO_QUATRO_A_14 },
  ],
  tipo_estudante: [
    { value: 'ESTUDANTE_DA_REDE', label: ROTULO_ESTUDANTE_REDE },
    { value: 'ESTUDANTE_EXTERNO', label: ROTULO_ESTUDANTE_EXTERNO },
  ],
  status_inscricao: [
    { value: 'RASCUNHO', label: 'Rascunho' },
    { value: 'COMPLETA', label: 'Completa' },
    { value: 'CANCELADA', label: 'Cancelada' },
  ],
}

const participanteEolVazio: ParticipanteEol = {
  codigo_eol: '',
  nome_participante: '',
  data_nascimento: '',
  responsavel_nome: '',
  responsavel_nome_social: '',
  cep: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  telefone_contato_1: '',
  telefone_contato_2: '',
  email: '',
}

const participanteEolExemplo: ParticipanteEol = {
  codigo_eol: '123456',
  nome_participante: 'ANNA JULIA ARAUJO SA',
  data_nascimento: '2013-10-16',
  responsavel_nome: 'SAMARA LIMA ARAUJO',
  responsavel_nome_social: '',
  cep: '08411-010',
  logradouro: 'DA PASSAGEM FUNDA',
  numero: '72',
  complemento: '',
  bairro: 'VILA SANTA CRUZ ZONA LESTE',
  cidade: 'SAO PAULO',
  telefone_contato_1: '11988887777',
  telefone_contato_2: '',
  email: 'ana@email.com',
}

const {
  listarDresMock,
  listarPolosElegiveisMock,
  listarValoresChoicesMock,
  cadastrarInscricaoMock,
  obterInscricaoMock,
  atualizarInscricaoMock,
  obterParticipanteEolMock,
  obterParticipanteCpfMock,
  showToastMock,
} = vi.hoisted(() => ({
  listarDresMock: vi.fn(),
  listarPolosElegiveisMock: vi.fn(),
  listarValoresChoicesMock: vi.fn(),
  cadastrarInscricaoMock: vi.fn(),
  obterInscricaoMock: vi.fn(),
  atualizarInscricaoMock: vi.fn(),
  obterParticipanteEolMock: vi.fn(),
  obterParticipanteCpfMock: vi.fn(),
  showToastMock: vi.fn(),
}))

vi.mock('@/services/dre/listarDres', () => ({
  listarDres: listarDresMock,
}))

vi.mock('@/services/inscricao/listarPolosElegiveis', () => ({
  listarPolosElegiveis: listarPolosElegiveisMock,
}))

vi.mock('@/services/inscricao/listarValoresChoices', () => ({
  listarValoresChoices: listarValoresChoicesMock,
}))

vi.mock('@/services/inscricao/cadastrarInscricao', () => ({
  cadastrarInscricao: cadastrarInscricaoMock,
}))

vi.mock('@/services/inscricao/obterInscricao', () => ({
  obterInscricao: obterInscricaoMock,
}))

vi.mock('@/services/inscricao/atualizarInscricao', () => ({
  atualizarInscricao: atualizarInscricaoMock,
}))

vi.mock('@/services/inscricao/obterParticipanteEol', () => ({
  obterParticipanteEol: obterParticipanteEolMock,
}))

vi.mock('@/services/inscricao/obterParticipanteCpf', () => ({
  obterParticipanteCpf: obterParticipanteCpfMock,
}))

vi.mock('@/hooks/useToast', () => ({
  useToast: () => ({ showToast: showToastMock, dismissToast: vi.fn() }),
}))

function renderFormulario(
  rotaInicial = '/inscricoes-participantes/cadastro',
) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[rotaInicial]}>
        <Routes>
          <Route
            path="/inscricoes-participantes/cadastro"
            element={<ParticipanteForm />}
          />
          <Route
            path="/inscricoes-participantes/editar/:inscricaoUuid"
            element={<ParticipanteForm inscricaoUuid="inscricao-1" />}
          />
          <Route
            path="/inscricoes-participantes"
            element={<div>Inscrições de Participantes</div>}
          />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

async function escolherGrupo(
  usuario: ReturnType<typeof userEvent.setup>,
  rotulo: string,
) {
  await usuario.click(await screen.findByLabelText(/agrupamento/i))
  await usuario.click(
    await screen.findByRole('option', { name: new RegExp(`^${rotulo}$`) }),
  )
}

describe('ParticipanteForm', () => {
  beforeEach(() => {
    listarDresMock.mockReset()
    listarPolosElegiveisMock.mockReset()
    listarValoresChoicesMock.mockReset()
    cadastrarInscricaoMock.mockReset()
    obterInscricaoMock.mockReset()
    atualizarInscricaoMock.mockReset()
    obterParticipanteEolMock.mockReset()
    obterParticipanteCpfMock.mockReset()
    showToastMock.mockReset()
    listarDresMock.mockResolvedValue([])
    listarPolosElegiveisMock.mockResolvedValue([])
    listarValoresChoicesMock.mockResolvedValue(valoresChoicesExemplo)
    obterParticipanteEolMock.mockResolvedValue(participanteEolVazio)
    obterParticipanteCpfMock.mockResolvedValue(participanteEolVazio)
    cadastrarInscricaoMock.mockResolvedValue({
      status: 'RASCUNHO',
      status_label: 'Rascunho',
    })
  })

  it('renderiza alerta, seção de informações básicas e ações do rodapé', () => {
    renderFormulario()

    expect(
      screen.getByRole('form', {
        name: /formulário de cadastro de participante/i,
      }),
    ).toBeInTheDocument()
    const alerta = screen.getByRole('alert')
    expect(alerta).toHaveClass('h-36', 'max-h-36', 'overflow-y-auto')
    expect(alerta).toHaveTextContent(
      /usuário deve visualizar texto com orientações que precisa compartilhar com familiares e responsáveis/i,
    )

    const basicas = screen.getByRole('button', {
      name: /informações básicas/i,
    })

    expect(basicas).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByLabelText(/agrupamento/i)).toBeInTheDocument()
    expect(
      screen.queryByLabelText(/tipo de estudante/i),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('textbox', { name: /código eol/i }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /informações por grupo/i }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /informações de saúde/i }),
    ).not.toBeInTheDocument()
    expect(screen.getAllByText(/campos obrigatórios/i)).toHaveLength(1)

    expect(
      screen.getByRole('button', { name: /cancelar/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /salvar rascunho/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /^salvar$/i }),
    ).toBeInTheDocument()
  })

  it('carrega e atualiza uma inscrição no modo de edição', async () => {
    const inscricao: InscricaoDetalheApi = {
      uuid: 'inscricao-1',
      edicao: null,
      polo: { uuid: 'polo-1', nome_polo: 'Polo Central' },
      tipo_estudante: 'ESTUDANTE_DA_REDE',
      tipo_estudante_label: ROTULO_ESTUDANTE_REDE,
      grupo: 'QUATRO_A_14_ANOS',
      grupo_label: ROTULO_QUATRO_A_14,
      codigo_eol: '123456',
      cpf: '12345678901',
      nome_participante: 'ANA JULIA ARAUJO SA',
      data_nascimento: '2013-10-16',
      responsavel_nome: 'SAMARA LIMA ARAUJO',
      responsavel_nome_social: 'SAMARA',
      cep: '08411-010',
      tipo_logradouro: '',
      logradouro: 'DA PASSAGEM FUNDA',
      numero: '72',
      complemento: 'CASA 2',
      bairro: 'VILA SANTA CRUZ',
      cidade: 'SAO PAULO',
      telefone_contato_1: '11988887777',
      telefone_contato_2: '11977776666',
      email: 'ana@email.com',
      dre_codigo_eol: 'DRE-1',
      dre_nome: 'DRE LESTE 1',
      status: 'RASCUNHO',
      status_label: 'Rascunho',
      ativo: true,
      polo_nome: 'Polo Central',
    }
    obterInscricaoMock.mockResolvedValue(inscricao)
    atualizarInscricaoMock.mockResolvedValue(inscricao)
    const usuario = userEvent.setup()

    renderFormulario('/inscricoes-participantes/editar/inscricao-1')

    expect(
      await screen.findByRole('form', {
        name: /formulário de edição de participante/i,
      }),
    ).toBeInTheDocument()
    expect(screen.getByLabelText(/agrupamento/i)).toHaveValue(ROTULO_QUATRO_A_14)
    expect(screen.getByLabelText(/tipo de estudante/i)).toHaveValue(
      ROTULO_ESTUDANTE_REDE,
    )
    expect(screen.queryByRole('combobox', { name: /agrupamento/i })).toBeNull()
    expect(
      screen.queryByRole('combobox', { name: /tipo de estudante/i }),
    ).toBeNull()
    expect(screen.getByLabelText(/polo de inscrição/i)).toHaveValue(
      'Polo Central',
    )
    expect(screen.getByLabelText(/polo de inscrição/i)).toHaveAttribute(
      'readonly',
    )
    expect(
      screen.queryByRole('combobox', { name: /polo de inscrição/i }),
    ).toBeNull()
    expect(screen.getByLabelText(/nome completo do\(a\) participante/i)).toHaveValue(
      'ANA JULIA ARAUJO SA',
    )
    expect(screen.getByLabelText(/código eol/i)).toHaveValue('123456')
    expect(screen.getByLabelText(/cpf do responsável/i)).toHaveValue(
      '123.456.789-01',
    )
    expect(screen.getByLabelText(/telefone de contato\/emergência 1/i)).toHaveValue(
      '11988887777',
    )

    await usuario.click(screen.getByRole('button', { name: /^salvar$/i }))

    await waitFor(() => {
      expect(atualizarInscricaoMock).toHaveBeenCalledWith(
        'inscricao-1',
        expect.objectContaining({
          grupo: 'QUATRO_A_14_ANOS',
          codigoEol: '123456',
          cpf: '12345678901',
          nomeCompleto: 'ANA JULIA ARAUJO SA',
          telefone1: '11988887777',
          polo: 'polo-1',
        }),
      )
    })
  })

  it('navega para a listagem ao clicar em Cancelar', async () => {
    const usuario = userEvent.setup()
    renderFormulario()

    await usuario.click(screen.getByRole('button', { name: /cancelar/i }))

    expect(screen.getByText(/inscrições de participantes/i)).toBeInTheDocument()
  })

  it('mostra o restante das informações básicas depois do grupo e do tipo', async () => {
    const usuario = userEvent.setup()
    renderFormulario()

    await escolherGrupo(usuario, 'Berçário I')

    const codigoEol = screen.getByRole('textbox', { name: /código eol/i })
    expect(codigoEol).not.toHaveAttribute('readonly')
    expect(codigoEol).toHaveAttribute('placeholder', 'Código EOL')
    expect(codigoEol).not.toHaveClass('pl-9')
    expect(codigoEol.parentElement).toHaveClass(
      'overflow-hidden',
      'rounded-sm',
      'border',
    )
    expect(
      screen.getByRole('button', { name: /consultar código eol/i }),
    ).toBeEnabled()
    await usuario.click(
      screen.getByRole('button', { name: /consultar código eol/i }),
    )

    const cpf = screen.getByRole('textbox', { name: /cpf do responsável/i })
    expect(cpf).not.toHaveAttribute('readonly')
    expect(cpf).toHaveAttribute('placeholder', 'Digite o CPF')
    expect(cpf).not.toHaveClass('pl-9')
    expect(cpf.parentElement).toHaveClass(
      'overflow-hidden',
      'rounded-sm',
      'border',
    )
    expect(
      screen.getByRole('button', { name: /consultar cpf do responsável/i }),
    ).toBeEnabled()
    await usuario.type(cpf, '12345678901')
    expect(cpf).toHaveValue('123.456.789-01')
    expect(
      screen.getByLabelText(/nome completo do\(a\) participante/i),
    ).toHaveAttribute('readonly')
    expect(screen.getByLabelText(/data de nascimento/i)).toHaveAttribute(
      'readonly',
    )
    expect(
      screen.getByLabelText(/nome completo do responsável/i),
    ).toHaveAttribute('readonly')
    expect(
      screen.getByLabelText(/nome social do\(a\) responsável/i),
    ).toHaveAttribute('readonly')
    expect(screen.getByLabelText(/\bcep\b/i)).toHaveAttribute('readonly')
    expect(screen.getByLabelText(/\blogradouro\b/i)).toHaveAttribute('readonly')
    expect(screen.getByLabelText(/\bnúmero\b/i)).toHaveAttribute('readonly')
    expect(screen.getByLabelText(/^complemento$/i)).toHaveAttribute('readonly')
    expect(screen.getByLabelText(/\bbairro\b/i)).toHaveAttribute('readonly')
    expect(screen.getByLabelText(/\bcidade\b/i)).toHaveAttribute('readonly')
    expect(
      screen.getByLabelText(/telefone de contato\/emergência 1/i),
    ).not.toHaveAttribute('readonly')
    expect(
      screen.getByLabelText(/telefone de contato\/emergência 2/i),
    ).not.toHaveAttribute('readonly')
    expect(screen.getByLabelText(/\be-mail\b/i)).not.toHaveAttribute('readonly')
    expect(screen.getByLabelText(/\bdre\b/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/polo de inscrição/i)).toBeDisabled()
  })

  it('lista os polos da DRE e limpa o polo ao trocar a DRE', async () => {
    const usuario = userEvent.setup()
    listarDresMock.mockResolvedValue([
      {
        codigo_dre: '108100',
        nome_dre: 'DRE Butantã',
        sigla_dre: 'BT',
      },
      {
        codigo_dre: '108200',
        nome_dre: 'DRE Ipiranga',
        sigla_dre: 'IP',
      },
    ])
    listarPolosElegiveisMock.mockImplementation(
      async (dreCodigoEol: string) => [
        {
          uuid: `polo-${dreCodigoEol}`,
          codigo_eol: '123456',
          nome_polo: `Polo ${dreCodigoEol}`,
          dre_codigo_eol: dreCodigoEol,
          dre_nome: 'DRE',
        },
      ],
    )
    renderFormulario()

    expect(
      screen.queryByLabelText(/polo de inscrição/i),
    ).not.toBeInTheDocument()
    expect(listarPolosElegiveisMock).not.toHaveBeenCalled()

    await escolherGrupo(usuario, 'Berçário I')

    expect(screen.getByLabelText(/polo de inscrição/i)).toBeDisabled()

    await usuario.click(screen.getByLabelText(/\bdre\b/i))
    await usuario.click(
      await screen.findByRole('option', { name: 'DRE Butantã' }),
    )

    expect(listarPolosElegiveisMock).toHaveBeenCalledWith('108100')
    expect(screen.getByLabelText(/polo de inscrição/i)).toBeEnabled()

    await usuario.click(screen.getByLabelText(/polo de inscrição/i))
    await usuario.click(
      await screen.findByRole('option', { name: 'Polo 108100' }),
    )
    expect(screen.getAllByText('Polo 108100').length).toBeGreaterThan(0)

    await usuario.click(screen.getByLabelText(/\bdre\b/i))
    await usuario.click(screen.getByRole('option', { name: 'DRE Ipiranga' }))

    expect(listarPolosElegiveisMock).toHaveBeenLastCalledWith('108200')
    await waitFor(() => {
      expect(screen.queryByText('Polo 108100')).not.toBeInTheDocument()
    })
    expect(screen.getByText('Selecione o Polo')).toBeInTheDocument()

    await usuario.click(screen.getByRole('button', { name: /^salvar$/i }))

    await waitFor(() => {
      expect(cadastrarInscricaoMock).toHaveBeenCalledWith(
        expect.objectContaining({
          grupo: 'BERCARIO_I',
          tipoEstudante: TIPO_ESTUDANTE_REDE,
          dreCodigoEol: '108200',
          dreNome: 'DRE Ipiranga',
          polo: '',
        }),
        expect.anything(),
      )
    })
  })

  it('mostra o erro dos polos e some quando a busca seguinte funciona', async () => {
    const usuario = userEvent.setup()
    listarDresMock.mockResolvedValue([
      {
        codigo_dre: '108100',
        nome_dre: 'DRE Butantã',
        sigla_dre: 'BT',
      },
      {
        codigo_dre: '108200',
        nome_dre: 'DRE Ipiranga',
        sigla_dre: 'IP',
      },
    ])
    listarPolosElegiveisMock.mockRejectedValueOnce({
      response: { data: { detalhe: 'Falha ao carregar polos.' } },
    })
    renderFormulario()

    await escolherGrupo(usuario, 'Berçário I')
    await usuario.click(screen.getByLabelText(/\bdre\b/i))
    await usuario.click(
      await screen.findByRole('option', { name: 'DRE Butantã' }),
    )

    expect(
      await screen.findByText('Falha ao carregar polos.'),
    ).toBeInTheDocument()

    listarPolosElegiveisMock.mockResolvedValue([
      {
        uuid: 'polo-108200',
        codigo_eol: '123456',
        nome_polo: 'Polo 108200',
        dre_codigo_eol: '108200',
        dre_nome: 'DRE Ipiranga',
      },
    ])

    await usuario.click(screen.getByLabelText(/\bdre\b/i))
    await usuario.click(screen.getByRole('option', { name: 'DRE Ipiranga' }))

    await waitFor(() => {
      expect(
        screen.queryByText('Falha ao carregar polos.'),
      ).not.toBeInTheDocument()
    })
  })

  it('preenche os campos com o retorno da consulta EOL', async () => {
    const usuario = userEvent.setup()
    obterParticipanteEolMock.mockResolvedValue(participanteEolExemplo)
    listarDresMock.mockResolvedValue([
      {
        codigo_dre: '108100',
        nome_dre: 'DRE Butantã',
        sigla_dre: 'BT',
      },
    ])
    renderFormulario()

    await escolherGrupo(usuario, 'Berçário I')
    await usuario.click(screen.getByLabelText(/\bdre\b/i))
    await usuario.click(
      await screen.findByRole('option', { name: 'DRE Butantã' }),
    )
    await usuario.type(
      screen.getByRole('textbox', { name: /código eol/i }),
      '123456',
    )
    await usuario.click(
      screen.getByRole('button', { name: /consultar código eol/i }),
    )

    await waitFor(() => {
      expect(obterParticipanteEolMock).toHaveBeenCalledTimes(1)
      expect(obterParticipanteEolMock).toHaveBeenCalledWith('123456')
      expect(
        screen.getByLabelText(/nome completo do\(a\) participante/i),
      ).toHaveValue('ANNA JULIA ARAUJO SA')
    })
    expect(screen.getByLabelText(/data de nascimento/i)).toHaveValue(
      '16/10/2013',
    )
    expect(screen.getByLabelText(/nome completo do responsável/i)).toHaveValue(
      'SAMARA LIMA ARAUJO',
    )
    expect(screen.getByLabelText(/\bcep\b/i)).toHaveValue('08411-010')
    expect(screen.getByLabelText(/\blogradouro\b/i)).toHaveValue(
      'DA PASSAGEM FUNDA',
    )
    expect(screen.getByLabelText(/\bnúmero\b/i)).toHaveValue('72')
    expect(screen.getByLabelText(/\bbairro\b/i)).toHaveValue(
      'VILA SANTA CRUZ ZONA LESTE',
    )
    expect(screen.getByLabelText(/\bcidade\b/i)).toHaveValue('SAO PAULO')
    expect(
      screen.getByLabelText(/telefone de contato\/emergência 1/i),
    ).toHaveValue('11988887777')
    expect(screen.getByLabelText(/\be-mail\b/i)).toHaveValue('ana@email.com')
    expect(
      screen.getByRole('textbox', { name: /cpf do responsável/i }),
    ).toHaveValue('')
    expect(screen.getByLabelText(/\bdre\b/i)).toHaveTextContent('DRE Butantã')
  })

  it('consulta o código EOL ao sair do campo', async () => {
    const usuario = userEvent.setup()
    obterParticipanteEolMock.mockResolvedValue(participanteEolExemplo)
    renderFormulario()

    await escolherGrupo(usuario, 'Berçário I')
    const codigoEol = screen.getByRole('textbox', { name: /código eol/i })
    await usuario.click(codigoEol)
    await usuario.tab()
    expect(obterParticipanteEolMock).not.toHaveBeenCalled()

    await usuario.type(codigoEol, '123456')
    await usuario.tab()

    await waitFor(() => {
      expect(
        screen.getByLabelText(/nome completo do\(a\) participante/i),
      ).toHaveValue('ANNA JULIA ARAUJO SA')
    })
    expect(obterParticipanteEolMock).toHaveBeenCalledTimes(1)
    expect(obterParticipanteEolMock).toHaveBeenCalledWith('123456')
  })

  it('exibe o detalhe quando a consulta do código EOL falha', async () => {
    const usuario = userEvent.setup()
    obterParticipanteEolMock
      .mockResolvedValueOnce(participanteEolExemplo)
      .mockRejectedValueOnce({
        response: {
          data: {
            detalhe:
              'Código EOL não encontrado. Verifique o número digitado e tente novamente.',
          },
        },
      })
    renderFormulario()

    await escolherGrupo(usuario, 'Berçário I')
    const codigoEol = screen.getByRole('textbox', { name: /código eol/i })
    await usuario.type(codigoEol, '123456')
    const consultar = screen.getByRole('button', {
      name: /consultar código eol/i,
    })
    await usuario.click(consultar)

    await waitFor(() => {
      expect(
        screen.getByLabelText(/nome completo do\(a\) participante/i),
      ).toHaveValue('ANNA JULIA ARAUJO SA')
    })

    await usuario.click(consultar)

    expect(
      await screen.findByText(
        'Código EOL não encontrado. Verifique o número digitado e tente novamente.',
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByLabelText(/nome completo do\(a\) participante/i),
    ).toHaveValue('')
    expect(screen.getByLabelText(/data de nascimento/i)).toHaveValue('')
    expect(screen.getByLabelText(/\bcep\b/i)).toHaveValue('')
    expect(codigoEol).toHaveValue('123456')
  })

  it('limpa os dados do participante quando o código EOL deixa de corresponder à consulta', async () => {
    const usuario = userEvent.setup()
    obterParticipanteEolMock.mockResolvedValue(participanteEolExemplo)
    renderFormulario()

    await escolherGrupo(usuario, 'Berçário I')
    const codigoEol = screen.getByRole('textbox', { name: /código eol/i })
    await usuario.type(codigoEol, '123456')
    await usuario.click(
      screen.getByRole('button', { name: /consultar código eol/i }),
    )

    await waitFor(() => {
      expect(
        screen.getByLabelText(/nome completo do\(a\) participante/i),
      ).toHaveValue('ANNA JULIA ARAUJO SA')
    })

    await usuario.type(codigoEol, '7')

    expect(
      screen.getByLabelText(/nome completo do\(a\) participante/i),
    ).toHaveValue('')
    expect(screen.getByLabelText(/data de nascimento/i)).toHaveValue('')
    expect(screen.getByLabelText(/nome completo do responsável/i)).toHaveValue(
      '',
    )
    expect(screen.getByLabelText(/\bcep\b/i)).toHaveValue('')
    expect(screen.getByLabelText(/\be-mail\b/i)).toHaveValue('')
    expect(codigoEol).toHaveValue('1234567')
  })

  it('preenche os campos com o retorno da consulta pelo CPF do responsável', async () => {
    const usuario = userEvent.setup()
    obterParticipanteCpfMock.mockResolvedValue(participanteEolExemplo)
    renderFormulario()

    await escolherGrupo(usuario, 'Berçário I')
    const cpf = screen.getByRole('textbox', { name: /cpf do responsável/i })
    await usuario.type(cpf, '12345678901')
    await usuario.click(
      screen.getByRole('button', { name: /consultar cpf do responsável/i }),
    )

    await waitFor(() => {
      expect(obterParticipanteCpfMock).toHaveBeenCalledWith('12345678901')
      expect(
        screen.getByLabelText(/nome completo do\(a\) participante/i),
      ).toHaveValue('ANNA JULIA ARAUJO SA')
    })
    expect(screen.getByRole('textbox', { name: /código eol/i })).toHaveValue('')
    expect(cpf).toHaveValue('123.456.789-01')
    expect(screen.getByLabelText(/data de nascimento/i)).toHaveValue(
      '16/10/2013',
    )
    expect(screen.getByLabelText(/\be-mail\b/i)).toHaveValue('ana@email.com')
    expect(screen.getByLabelText(/\be-mail\b/i)).not.toHaveAttribute('readonly')
    expect(
      screen.getByLabelText(/telefone de contato\/emergência 1/i),
    ).toHaveValue('11988887777')
    expect(
      screen.getByLabelText(/telefone de contato\/emergência 1/i),
    ).not.toHaveAttribute('readonly')
    expect(
      screen.getByLabelText(/telefone de contato\/emergência 2/i),
    ).not.toHaveAttribute('readonly')
    expect(
      screen.getByLabelText(/nome completo do\(a\) participante/i),
    ).toHaveAttribute('readonly')
    expect(screen.getByLabelText(/\bcep\b/i)).toHaveAttribute('readonly')
    expect(screen.getByLabelText(/\bdre\b/i)).toBeEnabled()
    expect(screen.getByLabelText(/polo de inscrição/i)).toBeDisabled()
  })

  it('salva a inscrição preenchida pela consulta do CPF sem consultar de novo', async () => {
    const usuario = userEvent.setup()
    obterParticipanteCpfMock.mockResolvedValue(participanteEolExemplo)
    renderFormulario()

    await escolherGrupo(usuario, 'Berçário I')
    const cpf = screen.getByRole('textbox', { name: /cpf do responsável/i })
    await usuario.type(cpf, '12345678901')
    await usuario.click(
      screen.getByRole('button', { name: /consultar cpf do responsável/i }),
    )
    await waitFor(() => {
      expect(
        screen.getByLabelText(/nome completo do\(a\) participante/i),
      ).toHaveValue('ANNA JULIA ARAUJO SA')
    })

    obterParticipanteCpfMock.mockClear()
    await usuario.click(screen.getByRole('button', { name: /^salvar$/i }))

    await waitFor(() => {
      expect(cadastrarInscricaoMock).toHaveBeenCalledWith(
        expect.objectContaining({
          cpf: '12345678901',
          codigoEol: '',
          nomeCompleto: 'ANNA JULIA ARAUJO SA',
        }),
        expect.anything(),
      )
      expect(screen.getByText(/inscrições de participantes/i)).toBeInTheDocument()
    })
    expect(obterParticipanteCpfMock).not.toHaveBeenCalled()
  })

  it('mantém o erro de CPF incompleto ao salvar depois da consulta', async () => {
    const usuario = userEvent.setup()
    obterParticipanteCpfMock.mockResolvedValue(participanteEolExemplo)
    renderFormulario()

    await escolherGrupo(usuario, 'Berçário I')
    const cpf = screen.getByRole('textbox', { name: /cpf do responsável/i })
    await usuario.type(cpf, '4642051317')
    await usuario.click(
      screen.getByRole('button', { name: /consultar cpf do responsável/i }),
    )
    await waitFor(() => {
      expect(
        screen.getByLabelText(/nome completo do\(a\) participante/i),
      ).toHaveValue('ANNA JULIA ARAUJO SA')
    })

    obterParticipanteCpfMock.mockClear()
    await usuario.click(screen.getByRole('button', { name: /^salvar$/i }))

    expect(
      await screen.findByText('Informe um CPF válido.'),
    ).toBeInTheDocument()
    expect(cadastrarInscricaoMock).not.toHaveBeenCalled()
    expect(obterParticipanteCpfMock).not.toHaveBeenCalled()
    expect(cpf).toHaveValue('464.205.131-7')
  })

  it('consulta o CPF do responsável ao sair do campo', async () => {
    const usuario = userEvent.setup()
    obterParticipanteCpfMock.mockResolvedValue(participanteEolExemplo)
    renderFormulario()

    await escolherGrupo(usuario, 'Berçário I')
    const cpf = screen.getByRole('textbox', { name: /cpf do responsável/i })
    await usuario.click(cpf)
    await usuario.tab()
    expect(obterParticipanteCpfMock).not.toHaveBeenCalled()

    await usuario.type(cpf, '12345678901')
    await usuario.tab()

    await waitFor(() => {
      expect(
        screen.getByLabelText(/nome completo do\(a\) participante/i),
      ).toHaveValue('ANNA JULIA ARAUJO SA')
    })
    expect(obterParticipanteCpfMock).toHaveBeenCalledTimes(1)
    expect(obterParticipanteCpfMock).toHaveBeenCalledWith('12345678901')
    expect(screen.getByRole('textbox', { name: /código eol/i })).toHaveValue('')
  })

  it('exibe o detalhe quando a consulta do CPF falha e limpa os demais campos', async () => {
    const usuario = userEvent.setup()
    obterParticipanteCpfMock
      .mockResolvedValueOnce(participanteEolExemplo)
      .mockRejectedValueOnce({
        response: {
          data: {
            detalhe:
              'CPF não encontrado. Verifique o número digitado e tente novamente.',
          },
        },
      })
    renderFormulario()

    await escolherGrupo(usuario, 'Berçário I')
    const cpf = screen.getByRole('textbox', { name: /cpf do responsável/i })
    await usuario.type(cpf, '12345678901')
    const consultar = screen.getByRole('button', {
      name: /consultar cpf do responsável/i,
    })
    await usuario.click(consultar)

    await waitFor(() => {
      expect(
        screen.getByLabelText(/nome completo do\(a\) participante/i),
      ).toHaveValue('ANNA JULIA ARAUJO SA')
    })

    await usuario.click(consultar)

    expect(
      await screen.findByText(
        'CPF não encontrado. Verifique o número digitado e tente novamente.',
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByLabelText(/nome completo do\(a\) participante/i),
    ).toHaveValue('')
    expect(screen.getByLabelText(/data de nascimento/i)).toHaveValue('')
    expect(screen.getByLabelText(/\bcep\b/i)).toHaveValue('')
    expect(screen.getByLabelText(/\be-mail\b/i)).toHaveValue('')
    expect(screen.getByRole('textbox', { name: /código eol/i })).toHaveValue('')
    expect(cpf).toHaveValue('123.456.789-01')
  })

  it('limpa os dados do participante quando o CPF deixa de corresponder à consulta', async () => {
    const usuario = userEvent.setup()
    obterParticipanteCpfMock.mockResolvedValue(participanteEolExemplo)
    renderFormulario()

    await escolherGrupo(usuario, 'Berçário I')
    const cpf = screen.getByRole('textbox', { name: /cpf do responsável/i })
    await usuario.type(cpf, '12345678901')
    await usuario.click(
      screen.getByRole('button', { name: /consultar cpf do responsável/i }),
    )

    await waitFor(() => {
      expect(
        screen.getByLabelText(/nome completo do\(a\) participante/i),
      ).toHaveValue('ANNA JULIA ARAUJO SA')
    })

    await usuario.type(cpf, '{Backspace}')

    expect(
      screen.getByLabelText(/nome completo do\(a\) participante/i),
    ).toHaveValue('')
    expect(screen.getByLabelText(/data de nascimento/i)).toHaveValue('')
    expect(screen.getByLabelText(/\be-mail\b/i)).toHaveValue('')
    expect(screen.getByRole('textbox', { name: /código eol/i })).toHaveValue('')
    expect(cpf).toHaveValue('123.456.789-0')
  })

  it('desabilita o CPF ao informar o código EOL', async () => {
    const usuario = userEvent.setup()
    obterParticipanteEolMock.mockResolvedValue(participanteEolExemplo)
    renderFormulario()

    await escolherGrupo(usuario, 'Berçário I')
    const codigoEol = screen.getByRole('textbox', { name: /código eol/i })
    await usuario.type(codigoEol, '123456')

    const cpf = screen.getByRole('textbox', { name: /cpf do responsável/i })
    const consultarCpf = screen.getByRole('button', {
      name: /consultar cpf do responsável/i,
    })
    expect(cpf).toHaveAttribute('readonly')
    expect(consultarCpf).toBeDisabled()

    await usuario.click(
      screen.getByRole('button', { name: /consultar código eol/i }),
    )
    await waitFor(() => {
      expect(
        screen.getByLabelText(/nome completo do\(a\) participante/i),
      ).toHaveValue('ANNA JULIA ARAUJO SA')
    })
    expect(cpf).toHaveAttribute('readonly')
    expect(cpf).toHaveValue('')
    expect(obterParticipanteCpfMock).not.toHaveBeenCalled()

    await usuario.clear(codigoEol)

    expect(cpf).not.toHaveAttribute('readonly')
    expect(consultarCpf).toBeEnabled()
  })

  it('desabilita o código EOL ao informar o CPF do responsável', async () => {
    const usuario = userEvent.setup()
    obterParticipanteCpfMock.mockResolvedValue(participanteEolExemplo)
    renderFormulario()

    await escolherGrupo(usuario, 'Berçário I')
    const cpf = screen.getByRole('textbox', { name: /cpf do responsável/i })
    await usuario.type(cpf, '12345678901')

    const codigoEol = screen.getByRole('textbox', { name: /código eol/i })
    const consultarEol = screen.getByRole('button', {
      name: /consultar código eol/i,
    })
    expect(codigoEol).toHaveAttribute('readonly')
    expect(consultarEol).toBeDisabled()

    await usuario.click(
      screen.getByRole('button', { name: /consultar cpf do responsável/i }),
    )
    await waitFor(() => {
      expect(
        screen.getByLabelText(/nome completo do\(a\) participante/i),
      ).toHaveValue('ANNA JULIA ARAUJO SA')
    })
    expect(codigoEol).toHaveValue('')
    expect(codigoEol).toHaveAttribute('readonly')
    expect(obterParticipanteEolMock).not.toHaveBeenCalled()

    await usuario.clear(cpf)

    expect(codigoEol).not.toHaveAttribute('readonly')
    expect(consultarEol).toBeEnabled()
  })

  it('mantém o código EOL vazio quando a consulta do CPF responde', async () => {
    const usuario = userEvent.setup()
    let concluirCpf: (participante: ParticipanteEol) => void = () => {}
    obterParticipanteCpfMock.mockImplementation(
      () =>
        new Promise((resolve) => {
          concluirCpf = resolve
        }),
    )
    renderFormulario()

    await escolherGrupo(usuario, 'Berçário I')
    await usuario.type(
      screen.getByRole('textbox', { name: /cpf do responsável/i }),
      '12345678901',
    )
    await usuario.click(
      screen.getByRole('button', { name: /consultar cpf do responsável/i }),
    )
    await waitFor(() => {
      expect(obterParticipanteCpfMock).toHaveBeenCalledTimes(1)
    })

    const codigoEol = screen.getByRole('textbox', { name: /código eol/i })
    expect(codigoEol).toHaveAttribute('readonly')
    expect(
      screen.getByRole('button', { name: /consultar código eol/i }),
    ).toBeDisabled()
    expect(obterParticipanteEolMock).not.toHaveBeenCalled()

    await act(async () => {
      concluirCpf({
        ...participanteEolExemplo,
        nome_participante: 'ALUNO DO CPF',
      })
    })

    await waitFor(() => {
      expect(
        screen.getByLabelText(/nome completo do\(a\) participante/i),
      ).toHaveValue('ALUNO DO CPF')
    })
    expect(codigoEol).toHaveValue('')
    expect(codigoEol).toHaveAttribute('readonly')
  })

  it('ignora o retorno do CPF quando o campo já foi alterado', async () => {
    const usuario = userEvent.setup()
    let concluirCpf: (participante: ParticipanteEol) => void = () => {}
    obterParticipanteCpfMock.mockImplementation(
      () =>
        new Promise((resolve) => {
          concluirCpf = resolve
        }),
    )
    renderFormulario()

    await escolherGrupo(usuario, 'Berçário I')
    const cpf = screen.getByRole('textbox', { name: /cpf do responsável/i })
    await usuario.type(cpf, '12345678901')
    await usuario.click(
      screen.getByRole('button', { name: /consultar cpf do responsável/i }),
    )
    await waitFor(() => {
      expect(obterParticipanteCpfMock).toHaveBeenCalledTimes(1)
    })
    await usuario.type(cpf, '{Backspace}')

    await act(async () => {
      concluirCpf(participanteEolExemplo)
    })

    expect(
      screen.getByLabelText(/nome completo do\(a\) participante/i),
    ).toHaveValue('')
    expect(screen.getByRole('textbox', { name: /código eol/i })).toHaveValue('')
    expect(cpf).toHaveValue('123.456.789-0')
  })

  it('recusa CPF incompleto ao salvar', async () => {
    const usuario = userEvent.setup()
    renderFormulario()

    await escolherGrupo(usuario, 'Berçário I')
    const cpf = screen.getByRole('textbox', { name: /cpf do responsável/i })
    await usuario.type(cpf, '123')
    await usuario.tab()
    await waitFor(() => {
      expect(obterParticipanteCpfMock).toHaveBeenCalledWith('123')
    })
    await usuario.click(screen.getByRole('button', { name: /^salvar$/i }))

    expect(
      await screen.findByText('Informe um CPF válido.'),
    ).toBeInTheDocument()
    expect(cadastrarInscricaoMock).not.toHaveBeenCalled()
  })

  it.each(['Berçário I', 'Berçário II', 'Mini Grupo I', 'Mini Grupo II'])(
    'trava Estudante da Rede e libera o restante ao escolher %s',
    async (rotulo) => {
      const usuario = userEvent.setup()
      renderFormulario()

      await escolherGrupo(usuario, rotulo)

      const tipo = await screen.findByLabelText(/tipo de estudante/i)
      expect(tipo).toHaveValue(ROTULO_ESTUDANTE_REDE)
      expect(tipo).toHaveAttribute('readonly')
      expect(
        screen.getByRole('textbox', { name: /código eol/i }),
      ).toBeInTheDocument()
      expect(
        screen.queryByRole('button', { name: /informações por grupo/i }),
      ).not.toBeInTheDocument()
      expect(
        screen.queryByRole('button', { name: /informações de saúde/i }),
      ).not.toBeInTheDocument()
    },
  )

  it('libera o tipo e só então o restante em 4 a 14 anos', async () => {
    const usuario = userEvent.setup()
    renderFormulario()

    await escolherGrupo(usuario, ROTULO_QUATRO_A_14)

    expect(screen.getByLabelText(/tipo de estudante/i)).toHaveTextContent(
      'Selecione o tipo de estudante',
    )
    expect(
      screen.queryByRole('textbox', { name: /código eol/i }),
    ).not.toBeInTheDocument()

    await usuario.click(screen.getByLabelText(/tipo de estudante/i))
    await usuario.click(
      screen.getByRole('option', { name: ROTULO_ESTUDANTE_EXTERNO }),
    )

    expect(
      screen.getByRole('textbox', { name: /código eol/i }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /informações por grupo/i }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /informações de saúde/i }),
    ).not.toBeInTheDocument()
  })

  it('limpa o tipo e oculta o restante ao sair de um grupo da rede', async () => {
    const usuario = userEvent.setup()
    renderFormulario()

    await escolherGrupo(usuario, ROTULO_QUATRO_A_14)
    await usuario.click(screen.getByLabelText(/tipo de estudante/i))
    await usuario.click(
      screen.getByRole('option', { name: ROTULO_ESTUDANTE_EXTERNO }),
    )
    expect(
      screen.getByRole('textbox', { name: /código eol/i }),
    ).toBeInTheDocument()

    await escolherGrupo(usuario, 'Berçário I')

    const tipo = await screen.findByLabelText(/tipo de estudante/i)
    expect(tipo).toHaveValue(ROTULO_ESTUDANTE_REDE)
    expect(tipo).toHaveAttribute('readonly')

    await escolherGrupo(usuario, ROTULO_QUATRO_A_14)

    expect(screen.getByLabelText(/tipo de estudante/i)).toHaveTextContent(
      'Selecione o tipo de estudante',
    )
    expect(
      screen.queryByRole('textbox', { name: /código eol/i }),
    ).not.toBeInTheDocument()
  })

  it('salva o rascunho incompleto e recusa e-mail inválido', async () => {
    const usuario = userEvent.setup()
    const primeiraRenderizacao = renderFormulario()

    await usuario.click(
      screen.getByRole('button', { name: /salvar rascunho/i }),
    )
    await waitFor(() => {
      expect(cadastrarInscricaoMock).toHaveBeenCalledWith(
        expect.objectContaining({
          grupo: '',
          polo: '',
          tipoEstudante: '',
          codigoEol: '',
          cpf: '',
          nomeCompleto: '',
          dataNascimento: '',
          email: '',
          dreCodigoEol: '',
          dreNome: '',
        }),
        expect.anything(),
      )
      expect(screen.getByText(/inscrições de participantes/i)).toBeInTheDocument()
    })
    expect(showToastMock).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'inscricao-salva',
        description: 'Rascunho',
      }),
    )

    primeiraRenderizacao.unmount()
    showToastMock.mockClear()
    cadastrarInscricaoMock.mockResolvedValueOnce({
      status: 'COMPLETA',
      status_label: 'Completa',
    })
    const segundaRenderizacao = renderFormulario()
    await usuario.click(screen.getByRole('button', { name: /^salvar$/i }))
    await waitFor(() => {
      expect(showToastMock).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'inscricao-salva',
          description: 'Completa',
        }),
      )
      expect(screen.getByText(/inscrições de participantes/i)).toBeInTheDocument()
    })
    expect(cadastrarInscricaoMock).toHaveBeenCalledTimes(2)

    segundaRenderizacao.unmount()
    showToastMock.mockClear()
    renderFormulario()
    await escolherGrupo(usuario, 'Berçário I')
    await usuario.type(screen.getByLabelText(/\be-mail\b/i), 'ana')
    await usuario.click(screen.getByRole('button', { name: /^salvar$/i }))
    expect(
      await screen.findByText(/digite um e-mail válido/i),
    ).toBeInTheDocument()
    expect(showToastMock).not.toHaveBeenCalled()
    expect(cadastrarInscricaoMock).toHaveBeenCalledTimes(2)
  })

  it('mostra o detalhe quando o cadastro falha', async () => {
    const usuario = userEvent.setup()
    cadastrarInscricaoMock.mockRejectedValue({
      response: {
        data: {
          detalhe:
            'Já existe inscrição com o identificador informado neste polo.',
        },
      },
    })
    renderFormulario()

    await usuario.click(
      screen.getByRole('button', { name: /salvar rascunho/i }),
    )

    expect(
      await screen.findByText(
        'Já existe inscrição com o identificador informado neste polo.',
      ),
    ).toBeInTheDocument()
    expect(showToastMock).not.toHaveBeenCalled()
  })

  it('envia o grupo escolhido nas informações básicas', async () => {
    const usuario = userEvent.setup()
    listarDresMock.mockResolvedValue([
      {
        codigo_dre: '108100',
        nome_dre: 'DRE Butantã',
        sigla_dre: 'BT',
      },
    ])
    listarPolosElegiveisMock.mockImplementation(
      async (dreCodigoEol: string) => [
        {
          uuid: `polo-${dreCodigoEol}`,
          codigo_eol: '123456',
          nome_polo: `Polo ${dreCodigoEol}`,
          dre_codigo_eol: dreCodigoEol,
          dre_nome: 'DRE Butantã',
        },
      ],
    )
    renderFormulario()

    await escolherGrupo(usuario, 'Berçário I')
    await usuario.click(screen.getByLabelText(/\bdre\b/i))
    await usuario.click(
      await screen.findByRole('option', { name: 'DRE Butantã' }),
    )
    await usuario.click(screen.getByLabelText(/polo de inscrição/i))
    await usuario.click(
      await screen.findByRole('option', { name: 'Polo 108100' }),
    )
    await usuario.type(screen.getByLabelText(/\be-mail\b/i), 'Ana@Email.com')

    await usuario.click(screen.getByRole('button', { name: /^salvar$/i }))

    await waitFor(() => {
      expect(cadastrarInscricaoMock).toHaveBeenCalledWith(
        expect.objectContaining({
          polo: 'polo-108100',
          tipoEstudante: TIPO_ESTUDANTE_REDE,
          grupo: 'BERCARIO_I',
          email: 'ana@email.com',
          dreCodigoEol: '108100',
          dreNome: 'DRE Butantã',
        }),
        expect.anything(),
      )
    })
  }, 15_000)
})
