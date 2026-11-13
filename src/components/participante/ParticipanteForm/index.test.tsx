class ObservadorTamanho {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver ??=
  ObservadorTamanho as unknown as typeof ResizeObserver
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type {
  InscricaoDetalhe,
  ParticipanteEol,
  ValoresChoicesInscricao,
} from '@/services/inscricao/types'
import {
  MENSAGEM_DUPLICIDADE_CPF_PARTICIPANTE,
  TIPO_ESTUDANTE_EXTERNO,
  TIPO_ESTUDANTE_REDE,
} from './constantes'
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
  deficiencias: [
    { value: 'DEFICIENCIA_A', label: 'Deficiência A' },
    { value: 'DEFICIENCIA_B', label: 'Deficiência B' },
    { value: 'OUTRO', label: 'Outro' },
  ],
  problemas_saude: [
    { value: 'PROBLEMA_SAUDE_A', label: 'Problema de Saúde A' },
    { value: 'PROBLEMA_SAUDE_B', label: 'Problema de Saúde B' },
    { value: 'OUTRO', label: 'Outro' },
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
  tipo_logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  telefone_contato_1: '',
  telefone_contato_2: '',
  email: '',
  nome_turma: '',
  ano: '',
  unidade_educacional: '',
  unidade_educacional_codigo_eol: '',
  unidade_educacional_tipo: '',
  idade: null,
}

const participanteEolExemplo: ParticipanteEol = {
  codigo_eol: '123456',
  nome_participante: 'ANNA JULIA ARAUJO SA',
  data_nascimento: '2013-10-16',
  responsavel_nome: 'SAMARA LIMA ARAUJO',
  responsavel_nome_social: '',
  cep: '08411-010',
  tipo_logradouro: 'Rua',
  logradouro: 'DA PASSAGEM FUNDA',
  numero: '72',
  complemento: '',
  bairro: 'VILA SANTA CRUZ ZONA LESTE',
  cidade: 'SAO PAULO',
  telefone_contato_1: '11988887777',
  telefone_contato_2: '',
  email: 'ana@email.com',
  nome_turma: '7C',
  ano: '7',
  unidade_educacional: 'EMEF - EMEF Professora Teste',
  unidade_educacional_codigo_eol: '094633',
  unidade_educacional_tipo: 'EMEF',
  idade: 13,
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
  checarDuplicidadeInscricaoEstudanteExternoMock,
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
  checarDuplicidadeInscricaoEstudanteExternoMock: vi.fn(),
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

vi.mock(
  '@/services/inscricao/checarDuplicidadeInscricaoEstudanteExterno',
  () => ({
    checarDuplicidadeInscricaoEstudanteExterno:
      checarDuplicidadeInscricaoEstudanteExternoMock,
  }),
)

vi.mock('@/hooks/useToast', () => ({
  useToast: () => ({ showToast: showToastMock, dismissToast: vi.fn() }),
}))

const inscricaoDetalheExemplo: InscricaoDetalhe = {
  uuid: 'inscricao-1',
  edicao: { uuid: 'edicao-1', nome: '2026' },
  polo: { uuid: 'polo-1', nome_polo: 'Polo Cidade de Genebra' },
  tipo_estudante: 'ESTUDANTE_DA_REDE',
  tipo_estudante_label: 'Estudante da rede',
  grupo: 'QUATRO_A_14_ANOS',
  grupo_label: '4 a 14 anos',
  codigo_eol: '1234567',
  cpf: '12345678901',
  cpf_participante: '',
  nome_participante: 'Kauan José Santos da Silva',
  data_nascimento: '2019-05-16',
  responsavel_nome: 'Maria Fernanda Santos',
  responsavel_nome_social: '',
  cep: '11111111',
  tipo_logradouro: 'Rua',
  logradouro: 'das Flores',
  numero: '25',
  complemento: '',
  bairro: 'Jardim das Rosas',
  cidade: 'São Paulo',
  telefone_contato_1: '11911111111',
  telefone_contato_2: '',
  email: 'mariafernanda@gmail.com',
  dre_codigo_eol: '108100',
  dre_nome: 'DIRETORIA REGIONAL DE EDUCACAO BUTANTA',
  status: 'COMPLETA',
  status_label: 'Completa',
  ativo: true,
  possui_deficiencia: false,
  deficiencias: [],
  outra_deficiencia: '',
  possui_problema_saude: false,
  problemas_saude: [],
  outro_problema_saude: '',
  usuario_medicacao_ou_tratamento_continuo: false,
  medicacao_ou_tratamento_continuo: '',
  possui_restricao_medicamento_pronto_atendimento: false,
  restricao_medicamento_pronto_atendimento: '',
  possui_convenio_medico: false,
  convenio_medico: '',
  tipo_escola: '',
  tipo_escola_label: '',
  unidade_educacional: 'EMEF Teste',
  unidade_educacional_codigo_eol: '094633',
  unidade_educacional_tipo: 'EMEF',
  nome_turma: '7C',
  ano: '7',
  pode_ir_embora_sozinho: false,
  responsavel_retirada: 'Maria Fernanda Santos',
  autoriza_uso_piscina: true,
  idade_detalhada: '7 anos, 0 meses e 0 dias',
}

function renderFormulario() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/cadastrar-participante']}>
        <Routes>
          <Route
            path="/cadastrar-participante"
            element={<ParticipanteForm />}
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

function renderFormularioEdicao() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/editar-participante/inscricao-1']}>
        <Routes>
          <Route
            path="/editar-participante/:idInscricao"
            element={<ParticipanteForm inscricaoId="inscricao-1" />}
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

async function liberarInformacoesSaude(
  usuario: ReturnType<typeof userEvent.setup>,
) {
  if (screen.queryByRole('button', { name: /informações de saúde/i })) return

  await escolherGrupo(usuario, 'Berçário I')
}

async function responderPerguntasSaudeComoNao(
  usuario: ReturnType<typeof userEvent.setup>,
): Promise<void> {
  await liberarInformacoesSaude(usuario)
  const secaoSaude = screen.getByRole('button', {
    name: /informações de saúde/i,
  })
  if (secaoSaude.getAttribute('aria-expanded') !== 'true') {
    await usuario.click(secaoSaude)
  }

  for (let indice = 0; indice < 5; indice += 1) {
    await usuario.click(screen.getAllByRole('radio', { name: 'Não' })[indice])
  }
}

function nascimentoComUmAno() {
  const hoje = new Date()
  const mes = String(hoje.getMonth() + 1).padStart(2, '0')
  return `${hoje.getFullYear() - 1}-${mes}-01`
}

async function escolherEstudanteExterno(
  usuario: ReturnType<typeof userEvent.setup>,
) {
  await escolherGrupo(usuario, ROTULO_QUATRO_A_14)
  await usuario.click(screen.getByLabelText(/tipo de estudante/i))
  await usuario.click(
    screen.getByRole('option', { name: ROTULO_ESTUDANTE_EXTERNO }),
  )
}

async function responderInformacoesPorGrupo(
  usuario: ReturnType<typeof userEvent.setup>,
) {
  const secao = screen.getByRole('button', {
    name: /informações por grupo/i,
  })
  if (secao.getAttribute('aria-expanded') !== 'true') {
    await usuario.click(secao)
  }

  const podeIrEmbora = screen.getByRole('radiogroup', {
    name: /pode ir embora sozinho/i,
  })
  await usuario.click(within(podeIrEmbora).getByRole('radio', { name: 'Não' }))

  const piscina = screen.getByRole('radiogroup', {
    name: /autoriza uso da piscina/i,
  })
  await usuario.click(within(piscina).getByRole('radio', { name: 'Não' }))

  await usuario.type(
    screen.getByRole('textbox', {
      name: /responsável por retirar na saída/i,
    }),
    'Maria Fernanda Santos',
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
    checarDuplicidadeInscricaoEstudanteExternoMock.mockReset()
    showToastMock.mockReset()
    listarDresMock.mockResolvedValue([])
    listarPolosElegiveisMock.mockResolvedValue([])
    listarValoresChoicesMock.mockResolvedValue(valoresChoicesExemplo)
    obterParticipanteEolMock.mockResolvedValue(participanteEolVazio)
    obterParticipanteCpfMock.mockResolvedValue(participanteEolVazio)
    checarDuplicidadeInscricaoEstudanteExternoMock.mockResolvedValue({})
    cadastrarInscricaoMock.mockResolvedValue({
      status: 'RASCUNHO',
      status_label: 'Rascunho',
    })
    obterInscricaoMock.mockResolvedValue(inscricaoDetalheExemplo)
    atualizarInscricaoMock.mockResolvedValue({
      status: 'COMPLETA',
      status_label: 'Completa',
    })
  })

  it('renderiza alerta, seção de informações básicas e ações do rodapé', async () => {
    const usuario = userEvent.setup()
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

    await escolherGrupo(usuario, ROTULO_QUATRO_A_14)
    expect(
      screen.queryByRole('button', { name: /informações de saúde/i }),
    ).not.toBeInTheDocument()
    await usuario.click(screen.getByLabelText(/tipo de estudante/i))
    await usuario.click(
      screen.getByRole('option', { name: ROTULO_ESTUDANTE_EXTERNO }),
    )

    const saude = screen.getByRole('button', {
      name: /informações de saúde/i,
    })
    expect(saude).toHaveAttribute('aria-expanded', 'false')
    await usuario.click(saude)
    expect(saude).toHaveAttribute('aria-expanded', 'true')
    for (const radio of screen.getAllByRole('radio')) {
      expect(radio).not.toBeChecked()
    }
    expect(screen.getAllByRole('combobox', { name: /qual/i })[0]).toBeDisabled()
    expect(screen.getAllByText(/campos obrigatórios/i)).toHaveLength(3)

    expect(
      screen.getByRole('button', { name: /cancelar/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /salvar rascunho/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /^finalizar inscrição$/i }),
    ).toBeInTheDocument()
  }, 30_000)

  it('abre informações de saúde quando a finalização falha por campos de saúde', async () => {
    const usuario = userEvent.setup()
    renderFormulario()
    await liberarInformacoesSaude(usuario)

    await usuario.click(
      screen.getByRole('button', { name: /^finalizar inscrição$/i }),
    )

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /informações de saúde/i }),
      ).toHaveAttribute('aria-expanded', 'true')
    })
  })

  it('avisa e impede finalizar com idade igual ou superior a 15 anos', async () => {
    const usuario = userEvent.setup()
    renderFormulario()

    await escolherGrupo(usuario, ROTULO_QUATRO_A_14)
    await usuario.click(screen.getByLabelText(/tipo de estudante/i))
    await usuario.click(
      screen.getByRole('option', { name: ROTULO_ESTUDANTE_EXTERNO }),
    )
    await usuario.type(
      screen.getByRole('textbox', {
        name: /data de nascimento do\(a\) participante/i,
      }),
      `01/01/${new Date().getFullYear() - 16}`,
    )

    expect(showToastMock).toHaveBeenCalledWith(
      expect.objectContaining({
        variant: 'destructive',
        description:
          'A data de nascimento informada excede a faixa etária permitida para participação no Recreio nas Férias.',
      }),
    )

    await usuario.click(
      screen.getByRole('button', { name: /^finalizar inscrição$/i }),
    )

    expect(
      screen.getByText(
        'A data de nascimento informada excede a faixa etária permitida para participação no Recreio nas Férias.',
      ),
    ).toBeInTheDocument()
    expect(cadastrarInscricaoMock).not.toHaveBeenCalled()
  })

  it('envia o CPF do participante ao salvar rascunho de estudante externo', async () => {
    const usuario = userEvent.setup()
    renderFormulario()

    await escolherGrupo(usuario, ROTULO_QUATRO_A_14)
    await usuario.click(screen.getByLabelText(/tipo de estudante/i))
    await usuario.click(
      screen.getByRole('option', { name: ROTULO_ESTUDANTE_EXTERNO }),
    )
    await usuario.type(
      screen.getByRole('textbox', { name: /cpf do\(a\) participante/i }),
      '12345678909',
    )
    await usuario.type(
      screen.getByRole('textbox', { name: /cpf do\(a\) responsável/i }),
      '10987654321',
    )
    await usuario.click(
      screen.getByRole('button', { name: /salvar rascunho/i }),
    )

    await waitFor(() => {
      expect(cadastrarInscricaoMock).toHaveBeenCalledWith(
        expect.objectContaining({
          tipoEstudante: 'ESTUDANTE_EXTERNO',
          cpf_participante: '12345678909',
          cpf: '10987654321',
        }),
        expect.anything(),
      )
    })
  })

  it('consulta duplicidade quando o CPF do estudante externo está completo', async () => {
    const usuario = userEvent.setup()
    renderFormulario()

    await escolherGrupo(usuario, ROTULO_QUATRO_A_14)
    await usuario.click(screen.getByLabelText(/tipo de estudante/i))
    await usuario.click(
      screen.getByRole('option', { name: ROTULO_ESTUDANTE_EXTERNO }),
    )

    await usuario.type(
      screen.getByRole('textbox', { name: /cpf do\(a\) participante/i }),
      '1234567890',
    )
    expect(
      checarDuplicidadeInscricaoEstudanteExternoMock,
    ).not.toHaveBeenCalled()

    await usuario.type(
      screen.getByRole('textbox', { name: /cpf do\(a\) participante/i }),
      '9',
    )

    await waitFor(() => {
      expect(
        checarDuplicidadeInscricaoEstudanteExternoMock,
      ).toHaveBeenCalledWith('12345678909')
    })
  })

  it('exibe toast e erro no campo quando o CPF já possui inscrição', async () => {
    checarDuplicidadeInscricaoEstudanteExternoMock.mockResolvedValueOnce({
      possui_inscricao: true,
    })
    const usuario = userEvent.setup()
    renderFormulario()

    await escolherGrupo(usuario, ROTULO_QUATRO_A_14)
    await usuario.click(screen.getByLabelText(/tipo de estudante/i))
    await usuario.click(
      screen.getByRole('option', { name: ROTULO_ESTUDANTE_EXTERNO }),
    )
    await usuario.type(
      screen.getByRole('textbox', { name: /cpf do\(a\) participante/i }),
      '12345678909',
    )

    await waitFor(() => {
      expect(showToastMock).toHaveBeenCalledWith(
        expect.objectContaining({
          description: MENSAGEM_DUPLICIDADE_CPF_PARTICIPANTE,
          variant: 'destructive',
        }),
      )
    })

    await usuario.click(
      screen.getByRole('button', { name: /^finalizar inscrição$/i }),
    )

    expect(
      await screen.findByText(MENSAGEM_DUPLICIDADE_CPF_PARTICIPANTE),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('textbox', { name: /cpf do\(a\) participante/i }),
    ).toHaveAttribute('aria-invalid', 'true')
    expect(cadastrarInscricaoMock).not.toHaveBeenCalled()
  })

  it('envia CPF do participante vazio para estudante da rede', async () => {
    const usuario = userEvent.setup()
    renderFormulario()

    await escolherGrupo(usuario, ROTULO_QUATRO_A_14)
    await usuario.click(screen.getByLabelText(/tipo de estudante/i))
    await usuario.click(
      screen.getByRole('option', { name: ROTULO_ESTUDANTE_EXTERNO }),
    )
    await usuario.type(
      screen.getByRole('textbox', { name: /cpf do\(a\) participante/i }),
      '12345678909',
    )
    await usuario.type(
      screen.getByRole('textbox', { name: /cpf do\(a\) responsável/i }),
      '10987654321',
    )
    await escolherGrupo(usuario, 'Berçário I')
    await usuario.click(
      screen.getByRole('button', { name: /salvar rascunho/i }),
    )

    await waitFor(() => {
      expect(cadastrarInscricaoMock).toHaveBeenCalledWith(
        expect.objectContaining({
          tipoEstudante: TIPO_ESTUDANTE_REDE,
          cpf_participante: '',
          cpf: '10987654321',
        }),
        expect.anything(),
      )
    })
  })

  it('destaca CPF e código EOL quando nenhum identificador válido foi informado', async () => {
    const usuario = userEvent.setup()
    renderFormulario()

    await escolherGrupo(usuario, 'Berçário I')
    await usuario.click(
      screen.getByRole('button', { name: /^finalizar inscrição$/i }),
    )

    await waitFor(() => {
      expect(
        screen.getByRole('textbox', { name: /código eol/i }),
      ).toHaveAttribute('aria-invalid', 'true')
      expect(
        screen.getByRole('textbox', { name: /cpf do responsável/i }),
      ).toHaveAttribute('aria-invalid', 'true')
    })
    expect(cadastrarInscricaoMock).not.toHaveBeenCalled()
  })

  it('habilita o campo Qual somente quando Sim é selecionado', async () => {
    const usuario = userEvent.setup()
    renderFormulario()
    await liberarInformacoesSaude(usuario)
    await usuario.click(
      screen.getByRole('button', { name: /informações de saúde/i }),
    )

    const camposQual = screen.getAllByRole('combobox', { name: /qual/i })
    const campoQual = camposQual[0]
    expect(campoQual).toBeDisabled()
    expect(campoQual).toHaveClass('placeholder:text-muted-foreground')
    expect(camposQual[1]).toHaveClass('placeholder:text-muted-foreground')
    expect(campoQual.closest('[data-slot="combobox-chips"]')).toHaveClass(
      'opacity-50',
    )

    await usuario.click(screen.getAllByRole('radio', { name: 'Sim' })[0])
    expect(campoQual).toBeEnabled()
    expect(campoQual).toHaveClass('placeholder:text-muted-foreground')
    expect(camposQual[1]).toHaveClass('placeholder:text-muted-foreground')
    expect(campoQual.closest('[data-slot="combobox-chips"]')).not.toHaveClass(
      'opacity-50',
    )

    await usuario.click(screen.getAllByRole('radio', { name: 'Não' })[0])
    expect(campoQual).toBeDisabled()
    expect(campoQual.closest('[data-slot="combobox-chips"]')).toHaveClass(
      'opacity-50',
    )
  })

  it('quebra linha na descrição da medicação e só permite edição ao selecionar Sim', async () => {
    const usuario = userEvent.setup()
    renderFormulario()
    await liberarInformacoesSaude(usuario)
    await usuario.click(
      screen.getByRole('button', { name: /informações de saúde/i }),
    )

    const campoMedicacao = screen.getByPlaceholderText(
      /informe a medicação\/tratamento contínuo/i,
    )
    expect(campoMedicacao.tagName).toBe('TEXTAREA')
    expect(campoMedicacao).toHaveAttribute('rows', '1')
    expect(campoMedicacao).toHaveAttribute('maxlength', '300')
    expect(campoMedicacao).toHaveClass('min-h-10')
    expect(campoMedicacao).toHaveAttribute('readonly')

    await usuario.click(screen.getAllByRole('radio', { name: 'Sim' })[2])
    expect(campoMedicacao).not.toHaveAttribute('readonly')
    Object.defineProperty(campoMedicacao, 'scrollHeight', {
      configurable: true,
      value: 60,
    })
    await usuario.type(campoMedicacao, 'texto que ocupa mais de uma linha')
    expect(campoMedicacao).toHaveStyle({ height: '60px' })

    await usuario.click(screen.getAllByRole('radio', { name: 'Não' })[2])
    expect(campoMedicacao).toHaveValue('')
    expect(campoMedicacao).not.toHaveStyle({ height: '60px' })
  })

  it('exibe o campo de texto ao selecionar Outro tipo de deficiência', async () => {
    const usuario = userEvent.setup()
    renderFormulario()
    await liberarInformacoesSaude(usuario)
    await usuario.click(
      screen.getByRole('button', { name: /informações de saúde/i }),
    )

    await usuario.click(screen.getAllByRole('radio', { name: 'Sim' })[0])
    const seletorDeficiencia = screen.getAllByRole('combobox', {
      name: /qual/i,
    })[0]
    await usuario.click(seletorDeficiencia)
    await usuario.click(screen.getByRole('option', { name: 'Outro' }))

    expect(
      screen.getByRole('textbox', {
        name: /qual ou quais outros tipos de deficiência/i,
      }),
    ).toBeInTheDocument()
  })

  it('limpa os valores condicionais ao selecionar Não nas perguntas de saúde', async () => {
    const usuario = userEvent.setup()
    renderFormulario()
    await liberarInformacoesSaude(usuario)
    await usuario.click(
      screen.getByRole('button', { name: /informações de saúde/i }),
    )

    const respostasSim = screen.getAllByRole('radio', { name: 'Sim' })
    const respostasNao = screen.getAllByRole('radio', { name: 'Não' })
    const seletoresQual = screen.getAllByRole('combobox', { name: /qual/i })

    await usuario.click(respostasSim[0])
    await usuario.click(seletoresQual[0])
    await usuario.click(screen.getByRole('option', { name: 'Outro' }))
    const outraDeficiencia = screen.getByRole('textbox', {
      name: /qual ou quais outros tipos de deficiência/i,
    })
    await usuario.type(outraDeficiencia, 'Descrição')
    await usuario.click(respostasNao[0])
    expect(
      screen.queryByRole('textbox', {
        name: /qual ou quais outros tipos de deficiência/i,
      }),
    ).not.toBeInTheDocument()
    expect(seletoresQual[0]).toHaveAttribute(
      'placeholder',
      'Selecione as deficiências',
    )

    await usuario.click(respostasSim[1])
    await usuario.click(seletoresQual[1])
    await usuario.click(
      screen.getByRole('option', { name: 'Problema de Saúde A' }),
    )
    await usuario.click(respostasNao[1])
    expect(seletoresQual[1]).toHaveAttribute(
      'placeholder',
      'Selecione o(s) problema(s) de saúde',
    )

    const camposTexto = [
      'Informe a medicação/tratamento contínuo',
      'Informe a restrição a medicamento em pronto atendimento',
      'Informe o convênio médico',
    ]

    for (const [indice, placeholder] of camposTexto.entries()) {
      await usuario.click(respostasSim[indice + 2])
      const campo = screen.getByPlaceholderText(placeholder)
      await usuario.type(campo, 'Valor preenchido')
      await usuario.click(respostasNao[indice + 2])
      expect(campo).toHaveValue('')
    }
  }, 30_000)

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
      screen.getByLabelText(/nome completo do\(a\) responsável/i),
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
    expect(cadastrarInscricaoMock).not.toHaveBeenCalled()
  }, 30_000)

  it('mostra erro dos polos em toast quando a busca seguinte funciona', async () => {
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

    await waitFor(() => {
      expect(showToastMock).toHaveBeenCalledWith({
        id: 'erro-api',
        title: 'Erro ao processar a inscrição',
        description: 'Falha ao carregar polos.',
        variant: 'destructive',
      })
    })

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

    expect(showToastMock).toHaveBeenCalledTimes(1)
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
    expect(
      screen.getByLabelText(/nome completo do\(a\) responsável/i),
    ).toHaveValue('SAMARA LIMA ARAUJO')
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

  it('exibe o detalhe da consulta do código EOL em toast', async () => {
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

    await waitFor(() => {
      expect(showToastMock).toHaveBeenCalledWith({
        id: 'erro-api',
        title: 'Erro ao processar a inscrição',
        description:
          'Código EOL não encontrado. Verifique o número digitado e tente novamente.',
        variant: 'destructive',
      })
    })
    expect(
      screen.getByLabelText(/nome completo do\(a\) participante/i),
    ).toHaveValue('')
    expect(screen.getByLabelText(/data de nascimento/i)).toHaveValue('')
    expect(screen.getByLabelText(/\bcep\b/i)).toHaveValue('')
    expect(codigoEol).toHaveValue('123456')

    await usuario.type(codigoEol, '7')

    expect(codigoEol).toHaveValue('1234567')
    expect(obterParticipanteEolMock).toHaveBeenCalledTimes(2)
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
    expect(
      screen.getByLabelText(/nome completo do\(a\) responsável/i),
    ).toHaveValue('')
    expect(screen.getByLabelText(/\bcep\b/i)).toHaveValue('')
    expect(screen.getByLabelText(/\be-mail\b/i)).toHaveValue('')
    expect(codigoEol).toHaveValue('1234567')
  })

  it('preenche os campos com o retorno da consulta pelo CPF do responsável', async () => {
    const usuario = userEvent.setup()
    obterParticipanteCpfMock.mockResolvedValue(participanteEolExemplo)
    renderFormulario()

    await escolherGrupo(usuario, 'Berçário I')
    await responderPerguntasSaudeComoNao(usuario)
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
    expect(screen.getByRole('textbox', { name: /código eol/i })).toHaveValue(
      '123456',
    )
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
  }, 30_000)

  it('salva a inscrição preenchida pela consulta do CPF sem consultar de novo', async () => {
    const usuario = userEvent.setup()
    obterParticipanteCpfMock.mockResolvedValue(participanteEolExemplo)
    listarDresMock.mockResolvedValue([
      {
        codigo_dre: '108100',
        nome_dre: 'DRE Butantã',
        sigla_dre: 'BT',
      },
    ])
    listarPolosElegiveisMock.mockResolvedValue([
      {
        uuid: 'polo-108100',
        codigo_eol: '123456',
        nome_polo: 'Polo Butantã',
        dre_codigo_eol: '108100',
        dre_nome: 'DRE Butantã',
      },
    ])
    renderFormulario()

    await escolherGrupo(usuario, 'Berçário I')
    await responderPerguntasSaudeComoNao(usuario)
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

    await usuario.click(screen.getByLabelText(/\bdre\b/i))
    await usuario.click(
      await screen.findByRole('option', { name: 'DRE Butantã' }),
    )
    await usuario.click(screen.getByLabelText(/polo de inscrição/i))
    await usuario.click(
      await screen.findByRole('option', { name: 'Polo Butantã' }),
    )

    obterParticipanteCpfMock.mockClear()
    await responderInformacoesPorGrupo(usuario)
    await usuario.click(
      screen.getByRole('button', { name: /^finalizar inscrição$/i }),
    )

    await waitFor(() => {
      expect(cadastrarInscricaoMock).toHaveBeenCalledWith(
        expect.objectContaining({
          cpf: '12345678901',
          codigoEol: '123456',
          nomeCompleto: 'ANNA JULIA ARAUJO SA',
          unidadeEducacional: 'EMEF - EMEF Professora Teste',
          unidadeEducacionalCodigoEol: '094633',
          unidadeEducacionalTipo: 'EMEF',
          nomeTurma: '7C',
          ano: '7',
          podeIrEmboraSozinho: 'nao',
          responsavelRetirada: 'Maria Fernanda Santos',
          autorizaUsoPiscina: 'nao',
        }),
        expect.anything(),
      )
      expect(
        screen.getByText(/inscrições de participantes/i),
      ).toBeInTheDocument()
    })
    expect(obterParticipanteCpfMock).not.toHaveBeenCalled()
  }, 30_000)

  it('impede finalizar após consulta por CPF com campos obrigatórios vazios', async () => {
    const usuario = userEvent.setup()
    obterParticipanteCpfMock.mockResolvedValue({
      ...participanteEolExemplo,
      telefone_contato_1: '',
      email: '',
    })
    renderFormulario()

    await escolherGrupo(usuario, 'Berçário I')
    await responderPerguntasSaudeComoNao(usuario)
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

    await usuario.click(
      screen.getByRole('button', { name: /^finalizar inscrição$/i }),
    )

    expect(cadastrarInscricaoMock).not.toHaveBeenCalled()
  }, 30_000)

  it('mantém o erro de CPF incompleto ao salvar depois da consulta', async () => {
    const usuario = userEvent.setup()
    obterParticipanteCpfMock.mockResolvedValue(participanteEolExemplo)
    renderFormulario()

    await escolherGrupo(usuario, 'Berçário I')
    await responderPerguntasSaudeComoNao(usuario)
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
    await usuario.click(
      screen.getByRole('button', { name: /^finalizar inscrição$/i }),
    )

    expect(
      await screen.findByText('Informe um CPF válido.'),
    ).toBeInTheDocument()
    expect(cadastrarInscricaoMock).not.toHaveBeenCalled()
    expect(obterParticipanteCpfMock).not.toHaveBeenCalled()
    expect(cpf).toHaveValue('464.205.131-7')
  }, 30_000)

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
    expect(screen.getByRole('textbox', { name: /código eol/i })).toHaveValue(
      '123456',
    )
  })

  it('exibe o detalhe da consulta do CPF em toast e limpa os demais campos', async () => {
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

    await waitFor(() => {
      expect(showToastMock).toHaveBeenCalledWith({
        id: 'erro-api',
        title: 'Erro ao processar a inscrição',
        description:
          'CPF não encontrado. Verifique o número digitado e tente novamente.',
        variant: 'destructive',
      })
    })
    expect(
      screen.getByLabelText(/nome completo do\(a\) participante/i),
    ).toHaveValue('')
    expect(screen.getByLabelText(/data de nascimento/i)).toHaveValue('')
    expect(screen.getByLabelText(/\bcep\b/i)).toHaveValue('')
    expect(screen.getByLabelText(/\be-mail\b/i)).toHaveValue('')
    expect(screen.getByRole('textbox', { name: /código eol/i })).toHaveValue('')
    expect(cpf).toHaveValue('123.456.789-01')

    await usuario.type(cpf, '{Backspace}')

    expect(cpf).toHaveValue('123.456.789-0')
    expect(obterParticipanteCpfMock).toHaveBeenCalledTimes(2)
  })

  it('limpa os dados do participante quando o CPF deixa de corresponder à consulta', async () => {
    const usuario = userEvent.setup()
    obterParticipanteCpfMock.mockResolvedValue(participanteEolExemplo)
    listarDresMock.mockResolvedValue([
      {
        codigo_dre: '108100',
        nome_dre: 'DRE Butantã',
        sigla_dre: 'BT',
      },
    ])
    listarPolosElegiveisMock.mockResolvedValue([
      {
        uuid: 'polo-108100',
        codigo_eol: '123456',
        nome_polo: 'Polo 108100',
        dre_codigo_eol: '108100',
        dre_nome: 'DRE Butantã',
      },
    ])
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

    await usuario.click(screen.getByLabelText(/\bdre\b/i))
    await usuario.click(
      await screen.findByRole('option', { name: 'DRE Butantã' }),
    )
    await usuario.click(screen.getByLabelText(/polo de inscrição/i))
    await usuario.click(
      await screen.findByRole('option', { name: 'Polo 108100' }),
    )

    await usuario.type(cpf, '{Backspace}')

    expect(
      screen.getByLabelText(/nome completo do\(a\) participante/i),
    ).toHaveValue('')
    expect(screen.getByLabelText(/data de nascimento/i)).toHaveValue('')
    expect(screen.getByLabelText(/\be-mail\b/i)).toHaveValue('')
    expect(screen.getByRole('textbox', { name: /código eol/i })).toHaveValue('')
    expect(cpf).toHaveValue('123.456.789-0')
    expect(screen.getByText('Selecione a DRE')).toBeInTheDocument()
    expect(
      screen.getByText('É necessário selecionar o DRE primeiro'),
    ).toBeInTheDocument()
  }, 30_000)

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

  it('preenche automaticamente o código EOL ao informar o CPF do responsável', async () => {
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
    expect(codigoEol).toHaveValue('123456')
    expect(codigoEol).toHaveAttribute('readonly')
    expect(obterParticipanteEolMock).not.toHaveBeenCalled()

    await usuario.clear(cpf)

    expect(codigoEol).not.toHaveAttribute('readonly')
    expect(consultarEol).toBeEnabled()
  })

  it('preenche o código EOL vazio quando a consulta do CPF responde', async () => {
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
    expect(codigoEol).toHaveValue('123456')
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
    await responderPerguntasSaudeComoNao(usuario)
    await usuario.click(
      screen.getByRole('button', { name: /^finalizar inscrição$/i }),
    )

    expect(
      await screen.findByText('Informe um CPF válido.'),
    ).toBeInTheDocument()
    expect(cadastrarInscricaoMock).not.toHaveBeenCalled()
  }, 30_000)

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
        screen.getByRole('button', { name: /informações por grupo/i }),
      ).toHaveAttribute('aria-expanded', 'false')
      expect(
        screen.getByRole('button', { name: /informações de saúde/i }),
      ).toBeInTheDocument()
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
    expect(
      screen.queryByRole('button', { name: /informações de saúde/i }),
    ).not.toBeInTheDocument()

    await usuario.click(screen.getByLabelText(/tipo de estudante/i))
    await usuario.click(
      screen.getByRole('option', { name: ROTULO_ESTUDANTE_EXTERNO }),
    )

    const cpfParticipante = screen.getByRole('textbox', {
      name: /cpf do\(a\) participante/i,
    })
    expect(cpfParticipante).toBeInTheDocument()
    await usuario.type(cpfParticipante, '12345678909')
    expect(cpfParticipante).toHaveValue('123.456.789-09')
    expect(
      screen.queryByRole('textbox', { name: /cpf do responsável/i }),
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /informações por grupo/i }),
    ).toHaveAttribute('aria-expanded', 'false')
    expect(
      screen.getByRole('button', { name: /informações de saúde/i }),
    ).toBeInTheDocument()
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
      screen.getByRole('textbox', { name: /cpf do\(a\) participante/i }),
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
    expect(
      screen.queryByRole('button', { name: /informações de saúde/i }),
    ).not.toBeInTheDocument()
  }, 30_000)

  it('salva o rascunho incompleto', async () => {
    const usuario = userEvent.setup()
    renderFormulario()

    await liberarInformacoesSaude(usuario)
    await usuario.click(
      screen.getByRole('button', { name: /salvar rascunho/i }),
    )
    await waitFor(() => {
      expect(cadastrarInscricaoMock).toHaveBeenCalledWith(
        expect.objectContaining({
          grupo: 'BERCARIO_I',
          polo: '',
          tipoEstudante: TIPO_ESTUDANTE_REDE,
          codigoEol: '',
          cpf: '',
          cpf_participante: '',
          nomeCompleto: '',
          dataNascimento: '',
          email: '',
          dreCodigoEol: '',
          dreNome: '',
          possui_deficiencia: false,
          possui_problema_saude: false,
          usuario_medicacao_ou_tratamento_continuo: false,
          possui_restricao_medicamento_pronto_atendimento: false,
          possui_convenio_medico: false,
          unidadeEducacional: '',
          unidadeEducacionalCodigoEol: '',
          unidadeEducacionalTipo: '',
          nomeTurma: '',
          ano: '',
          podeIrEmboraSozinho: '',
          responsavelRetirada: '',
          autorizaUsoPiscina: '',
        }),
        expect.anything(),
      )
      expect(
        screen.getByText(/inscrições de participantes/i),
      ).toBeInTheDocument()
    })
    expect(showToastMock).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'inscricao-salva',
        title: 'Inscrição salva com sucesso',
        description: 'Sua inscrição foi salva com o status: Rascunho',
        variant: 'success',
      }),
    )
  }, 30_000)

  it('finaliza a inscrição completa', async () => {
    const usuario = userEvent.setup()
    cadastrarInscricaoMock.mockResolvedValueOnce({
      status: 'COMPLETA',
      status_label: 'Completa',
    })
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
    await responderPerguntasSaudeComoNao(usuario)
    await usuario.type(
      screen.getByRole('textbox', { name: /cpf do responsável/i }),
      '12345678901',
    )
    await usuario.click(screen.getByLabelText(/\bdre\b/i))
    await usuario.click(
      await screen.findByRole('option', { name: 'DRE Butantã' }),
    )
    await usuario.click(screen.getByLabelText(/polo de inscrição/i))
    await usuario.click(
      await screen.findByRole('option', { name: 'Polo 108100' }),
    )
    await usuario.type(
      screen.getByLabelText(/telefone de contato\/emergência 1/i),
      '11988887777',
    )
    await usuario.type(screen.getByLabelText(/\be-mail\b/i), 'ana@email.com')
    await responderInformacoesPorGrupo(usuario)
    await usuario.click(
      screen.getByRole('button', { name: /^finalizar inscrição$/i }),
    )
    await waitFor(() => {
      expect(showToastMock).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'inscricao-salva',
          title: 'Inscrição salva com sucesso',
          description: 'Sua inscrição foi salva com o status: Completa',
          variant: 'success',
        }),
      )
      expect(
        screen.getByText(/inscrições de participantes/i),
      ).toBeInTheDocument()
    })
    expect(cadastrarInscricaoMock).toHaveBeenCalledTimes(1)
  }, 30_000)

  it('recusa e-mail inválido ao finalizar', async () => {
    const usuario = userEvent.setup()
    renderFormulario()
    await escolherGrupo(usuario, 'Berçário I')
    await usuario.type(screen.getByLabelText(/\be-mail\b/i), 'ana')
    await responderPerguntasSaudeComoNao(usuario)
    await usuario.click(
      screen.getByRole('button', { name: /^finalizar inscrição$/i }),
    )
    expect(
      await screen.findByText(/digite um e-mail válido/i),
    ).toBeInTheDocument()
    expect(showToastMock).not.toHaveBeenCalled()
    expect(cadastrarInscricaoMock).not.toHaveBeenCalled()
  }, 30_000)

  it('mostra o detalhe do erro de cadastro em toast', async () => {
    const usuario = userEvent.setup()
    cadastrarInscricaoMock.mockRejectedValueOnce({
      response: {
        data: {
          detalhe:
            'Já existe inscrição com o identificador informado neste polo.',
        },
      },
    })
    renderFormulario()

    await responderPerguntasSaudeComoNao(usuario)
    await usuario.click(
      screen.getByRole('button', { name: /salvar rascunho/i }),
    )

    await waitFor(() => {
      expect(showToastMock).toHaveBeenCalledWith({
        id: 'erro-api',
        title: 'Erro ao processar a inscrição',
        description:
          'Já existe inscrição com o identificador informado neste polo.',
        variant: 'destructive',
      })
    })

    cadastrarInscricaoMock.mockResolvedValueOnce({
      status: 'RASCUNHO',
      status_label: 'Rascunho',
    })
    showToastMock.mockClear()
    await usuario.click(
      screen.getByRole('button', { name: /salvar rascunho/i }),
    )

    await waitFor(() => {
      expect(cadastrarInscricaoMock).toHaveBeenCalledTimes(2)
      expect(
        screen.getByText(/inscrições de participantes/i),
      ).toBeInTheDocument()
    })
  }, 30_000)

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
    await usuario.type(
      screen.getByRole('textbox', { name: /cpf do responsável/i }),
      '12345678901',
    )
    await usuario.click(screen.getByLabelText(/\bdre\b/i))
    await usuario.click(
      await screen.findByRole('option', { name: 'DRE Butantã' }),
    )
    await usuario.click(screen.getByLabelText(/polo de inscrição/i))
    await usuario.click(
      await screen.findByRole('option', { name: 'Polo 108100' }),
    )
    await usuario.type(
      screen.getByLabelText(/telefone de contato\/emergência 1/i),
      '11988887777',
    )
    await usuario.type(screen.getByLabelText(/\be-mail\b/i), 'Ana@Email.com')

    await responderPerguntasSaudeComoNao(usuario)
    await responderInformacoesPorGrupo(usuario)
    await usuario.click(
      screen.getByRole('button', { name: /finalizar inscrição/i }),
    )

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
  }, 30_000)

  it('envia as informações de saúde no formato esperado pela API', async () => {
    const usuario = userEvent.setup()
    renderFormulario()
    await liberarInformacoesSaude(usuario)
    await usuario.click(
      screen.getByRole('button', { name: /informações de saúde/i }),
    )

    const respostasSim = screen.getAllByRole('radio', { name: 'Sim' })
    const seletoresQual = screen.getAllByRole('combobox', { name: /qual/i })

    await usuario.click(respostasSim[0])
    await usuario.click(seletoresQual[0])
    await usuario.click(screen.getByRole('option', { name: 'Deficiência A' }))
    await usuario.click(seletoresQual[0])
    await usuario.click(screen.getByRole('option', { name: 'Outro' }))
    await usuario.type(
      screen.getByRole('textbox', {
        name: /qual ou quais outros tipos de deficiência/i,
      }),
      'Deficiência informada pela família',
    )

    await usuario.click(respostasSim[1])
    await usuario.click(seletoresQual[1])
    await usuario.click(
      screen.getByRole('option', { name: 'Problema de Saúde A' }),
    )

    await usuario.click(respostasSim[2])
    await usuario.type(
      screen.getByPlaceholderText('Informe a medicação/tratamento contínuo'),
      'Medicamento A',
    )

    await usuario.click(respostasSim[3])
    await usuario.type(
      screen.getByPlaceholderText(
        'Informe a restrição a medicamento em pronto atendimento',
      ),
      'Restrição A',
    )

    await usuario.click(respostasSim[4])
    await usuario.type(
      screen.getByPlaceholderText('Informe o convênio médico'),
      'Convênio A',
    )

    await usuario.click(
      screen.getByRole('button', { name: /salvar rascunho/i }),
    )

    await waitFor(() => {
      expect(cadastrarInscricaoMock).toHaveBeenCalledWith(
        expect.objectContaining({
          possui_deficiencia: true,
          deficiencias: ['DEFICIENCIA_A', 'OUTRO'],
          outra_deficiencia: 'Deficiência informada pela família',
          possui_problema_saude: true,
          problemas_saude: ['PROBLEMA_SAUDE_A'],
          outro_problema_saude: '',
          usuario_medicacao_ou_tratamento_continuo: true,
          medicacao_ou_tratamento_continuo: 'Medicamento A',
          possui_restricao_medicamento_pronto_atendimento: true,
          restricao_medicamento_pronto_atendimento: 'Restrição A',
          possui_convenio_medico: true,
          convenio_medico: 'Convênio A',
        }),
        expect.anything(),
      )
    })
  }, 30_000)

  it('mostra os campos da rede, a idade em um ano e limpa ao sair da consulta', async () => {
    const usuario = userEvent.setup()
    obterParticipanteEolMock.mockResolvedValue({
      ...participanteEolExemplo,
      data_nascimento: nascimentoComUmAno(),
    })
    renderFormulario()

    await escolherGrupo(usuario, 'Berçário I')
    const secao = screen.getByRole('button', {
      name: /informações por grupo/i,
    })
    expect(secao).toHaveAttribute('aria-expanded', 'false')
    await usuario.click(secao)

    expect(screen.getByLabelText(/\bidade\b/i)).toHaveValue('')
    expect(screen.getByLabelText(/grupo do participante/i)).toBeDisabled()
    expect(screen.getByLabelText(/grupo do participante/i)).toHaveTextContent(
      'Berçário I',
    )
    const alunoRede = screen.getByRole('radiogroup', {
      name: /é aluno da rede municipal/i,
    })
    expect(within(alunoRede).getByRole('radio', { name: 'Sim' })).toBeChecked()
    expect(within(alunoRede).getByRole('radio', { name: 'Sim' })).toBeDisabled()
    expect(within(alunoRede).getByRole('radio', { name: 'Não' })).toBeDisabled()
    expect(
      screen.queryByRole('radiogroup', { name: /tipo de escola/i }),
    ).not.toBeInTheDocument()
    expect(
      screen.getByLabelText(/unidade educacional do participante/i),
    ).toHaveValue('')
    expect(screen.getByLabelText(/turma \/ ano/i)).toHaveValue('')

    const codigoEol = screen.getByRole('textbox', { name: /código eol/i })
    await usuario.type(codigoEol, '123456')
    await usuario.click(
      screen.getByRole('button', { name: /consultar código eol/i }),
    )

    await waitFor(() => {
      expect(screen.getByLabelText(/\bidade\b/i)).toHaveValue('1 ano')
    })
    expect(
      screen.getByLabelText(/unidade educacional do participante/i),
    ).toHaveValue('EMEF - EMEF Professora Teste')
    expect(
      screen.getByLabelText(/unidade educacional do participante/i),
    ).toHaveAttribute('readonly')
    expect(screen.getByLabelText(/turma \/ ano/i)).toHaveValue('7C / 7')
    expect(screen.getByLabelText(/turma \/ ano/i)).toHaveAttribute('readonly')

    await usuario.type(
      screen.getByRole('textbox', {
        name: /responsável por retirar na saída/i,
      }),
      'Maria Fernanda Santos',
    )
    await usuario.type(codigoEol, '7')

    expect(screen.getByLabelText(/\bidade\b/i)).toHaveValue('')
    expect(
      screen.getByLabelText(/unidade educacional do participante/i),
    ).toHaveValue('')
    expect(screen.getByLabelText(/turma \/ ano/i)).toHaveValue('')
    expect(
      screen.getByRole('textbox', {
        name: /responsável por retirar na saída/i,
      }),
    ).toHaveValue('')
  }, 30_000)

  it('abre a seção e impede finalizar sem as respostas da rede', async () => {
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

    await responderPerguntasSaudeComoNao(usuario)
    await usuario.type(
      screen.getByRole('textbox', { name: /cpf do responsável/i }),
      '12345678901',
    )
    await usuario.click(screen.getByLabelText(/\bdre\b/i))
    await usuario.click(
      await screen.findByRole('option', { name: 'DRE Butantã' }),
    )
    await usuario.click(screen.getByLabelText(/polo de inscrição/i))
    await usuario.click(
      await screen.findByRole('option', { name: 'Polo 108100' }),
    )
    await usuario.type(
      screen.getByLabelText(/telefone de contato\/emergência 1/i),
      '11988887777',
    )
    await usuario.type(screen.getByLabelText(/\be-mail\b/i), 'ana@email.com')
    await usuario.click(
      screen.getByRole('button', { name: /^finalizar inscrição$/i }),
    )

    const secao = screen.getByRole('button', {
      name: /informações por grupo/i,
    })
    await waitFor(() => {
      expect(secao).toHaveAttribute('aria-expanded', 'true')
    })
    expect(screen.getAllByText('Este campo é obrigatório.')).toHaveLength(3)
    expect(cadastrarInscricaoMock).not.toHaveBeenCalled()
  }, 30_000)

  it('exibe tipo de escola para o estudante externo e aceita a escolha', async () => {
    const usuario = userEvent.setup()
    renderFormulario()

    await escolherEstudanteExterno(usuario)
    await usuario.click(
      screen.getByRole('button', { name: /informações por grupo/i }),
    )

    expect(
      screen.queryByRole('radiogroup', { name: /é aluno da rede municipal/i }),
    ).not.toBeInTheDocument()
    const tipoEscola = screen.getByRole('radiogroup', {
      name: /tipo de escola/i,
    })
    const estadual = within(tipoEscola).getByRole('radio', { name: 'Estadual' })
    const particular = within(tipoEscola).getByRole('radio', {
      name: 'Particular',
    })

    await usuario.click(estadual)
    expect(estadual).toBeChecked()
    expect(particular).not.toBeChecked()

    await usuario.click(particular)
    expect(particular).toBeChecked()
    expect(estadual).not.toBeChecked()

    await usuario.click(
      screen.getByRole('button', { name: /salvar rascunho/i }),
    )
    await waitFor(() => {
      expect(cadastrarInscricaoMock).toHaveBeenCalledWith(
        expect.objectContaining({
          tipoEstudante: TIPO_ESTUDANTE_EXTERNO,
          tipoEscola: 'PARTICULAR',
        }),
        expect.anything(),
      )
    })
  }, 30_000)

  it('impede finalizar o estudante externo sem tipo de escola', async () => {
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

    await escolherEstudanteExterno(usuario)
    await responderPerguntasSaudeComoNao(usuario)
    await usuario.type(
      screen.getByRole('textbox', { name: /cpf do\(a\) participante/i }),
      '12345678901',
    )
    await usuario.type(
      screen.getByRole('textbox', {
        name: /nome completo do\(a\) participante/i,
      }),
      'Ana Souza',
    )
    await usuario.type(
      screen.getByRole('textbox', {
        name: /data de nascimento do\(a\) participante/i,
      }),
      `01/01/${new Date().getFullYear() - 8}`,
    )
    await usuario.type(
      screen.getByRole('textbox', { name: /cpf do\(a\) responsável/i }),
      '10987654321',
    )
    await usuario.type(
      screen.getByRole('textbox', {
        name: /nome completo do\(a\) responsável/i,
      }),
      'Maria Souza',
    )
    await usuario.type(screen.getByLabelText(/\bcep\b/i), '01310100')
    await usuario.type(screen.getByLabelText(/\blogradouro\b/i), 'Rua A')
    await usuario.type(screen.getByLabelText(/\bnúmero\b/i), '10')
    await usuario.type(screen.getByLabelText(/\bbairro\b/i), 'Centro')
    await usuario.type(screen.getByLabelText(/\bcidade\b/i), 'São Paulo')
    await usuario.click(screen.getByLabelText(/\bdre\b/i))
    await usuario.click(
      await screen.findByRole('option', { name: 'DRE Butantã' }),
    )
    await usuario.click(screen.getByLabelText(/polo de inscrição/i))
    await usuario.click(
      await screen.findByRole('option', { name: 'Polo 108100' }),
    )
    await usuario.type(
      screen.getByLabelText(/telefone de contato\/emergência 1/i),
      '11988887777',
    )
    await usuario.type(screen.getByLabelText(/\be-mail\b/i), 'ana@email.com')
    await usuario.click(
      screen.getByRole('button', { name: /^finalizar inscrição$/i }),
    )

    const secao = screen.getByRole('button', {
      name: /informações por grupo/i,
    })
    await waitFor(() => {
      expect(secao).toHaveAttribute('aria-expanded', 'true')
    })
    expect(screen.getAllByText('Este campo é obrigatório.')).toHaveLength(4)
    expect(
      screen.getByRole('radiogroup', { name: /tipo de escola/i }),
    ).toBeInTheDocument()
    for (const nome of [
      /unidade educacional do participante/i,
      '* Turma / Ano',
      '* Ano',
    ]) {
      expect(
        screen
          .getByRole('textbox', { name: nome })
          .closest('[data-slot="field"]'),
      ).toHaveTextContent('Este campo é obrigatório.')
    }
    expect(cadastrarInscricaoMock).not.toHaveBeenCalled()
  }, 30_000)

  it('envia unidade, turma e ano digitados no estudante externo', async () => {
    const usuario = userEvent.setup()
    renderFormulario()

    await escolherEstudanteExterno(usuario)
    await usuario.click(
      screen.getByRole('button', { name: /informações por grupo/i }),
    )

    expect(screen.getByLabelText(/agrupamento do participante/i)).toBeDisabled()

    const unidade = screen.getByRole('textbox', {
      name: /unidade educacional do participante/i,
    })
    const turma = screen.getByRole('textbox', { name: '* Turma / Ano' })
    const ano = screen.getByRole('textbox', { name: '* Ano' })

    expect(unidade).not.toHaveAttribute('readonly')
    expect(turma).not.toHaveAttribute('readonly')
    expect(ano).not.toHaveAttribute('readonly')

    await usuario.type(unidade, 'Escola Estadual Modelo')
    await usuario.type(turma, '7A')
    await usuario.type(ano, '7')
    await usuario.click(
      screen.getByRole('button', { name: /salvar rascunho/i }),
    )

    await waitFor(() => {
      expect(cadastrarInscricaoMock).toHaveBeenCalledWith(
        expect.objectContaining({
          tipoEstudante: TIPO_ESTUDANTE_EXTERNO,
          unidadeEducacional: 'Escola Estadual Modelo',
          nomeTurma: '7A',
          ano: '7',
        }),
        expect.anything(),
      )
    })
  }, 30_000)

  it('salva o rascunho do estudante externo sem tipo de escola', async () => {
    const usuario = userEvent.setup()
    renderFormulario()

    await escolherEstudanteExterno(usuario)
    await usuario.click(
      screen.getByRole('button', { name: /salvar rascunho/i }),
    )

    await waitFor(() => {
      expect(cadastrarInscricaoMock).toHaveBeenCalledWith(
        expect.objectContaining({
          tipoEstudante: TIPO_ESTUDANTE_EXTERNO,
          grupo: 'QUATRO_A_14_ANOS',
          tipoEscola: '',
        }),
        expect.anything(),
      )
    })
  }, 30_000)

  it('preenche a edição e bloqueia agrupamento, tipo, EOL e CPF', async () => {
    renderFormularioEdicao()

    expect(
      await screen.findByRole('form', {
        name: /formulário de edição de participante/i,
      }),
    ).toBeInTheDocument()
    expect(screen.getByLabelText(/agrupamento/i)).toHaveValue('4 a 14 anos')
    expect(screen.getByLabelText(/agrupamento/i)).toHaveAttribute('readonly')
    expect(screen.getByLabelText(/tipo de estudante/i)).toHaveValue(
      'Estudante da rede',
    )
    expect(screen.getByLabelText(/tipo de estudante/i)).toHaveAttribute(
      'readonly',
    )
    expect(
      screen.getByRole('textbox', { name: /consultar por código eol/i }),
    ).toHaveValue('1234567')
    expect(
      screen.getByRole('textbox', { name: /consultar por código eol/i }),
    ).toHaveAttribute('readonly')
    expect(
      screen.getByRole('button', { name: /consultar código eol/i }),
    ).toBeDisabled()
    expect(
      screen.getByRole('textbox', {
        name: /consultar por cpf do responsável/i,
      }),
    ).toHaveAttribute('readonly')
    expect(
      screen.getByRole('button', { name: /consultar cpf do responsável/i }),
    ).toBeDisabled()
    expect(
      screen.getByRole('textbox', {
        name: /nome completo do\(a\) participante/i,
      }),
    ).toHaveValue('Kauan José Santos da Silva')
    expect(screen.getByLabelText(/\be-mail\b/i)).toHaveValue(
      'mariafernanda@gmail.com',
    )
    expect(
      screen.getByRole('button', { name: /informações por grupo/i }),
    ).toHaveAttribute('aria-expanded', 'false')
    expect(
      screen.getByRole('button', { name: /informações de saúde/i }),
    ).toHaveAttribute('aria-expanded', 'false')
    expect(
      screen.queryByRole('button', { name: /salvar rascunho/i }),
    ).not.toBeInTheDocument()
    expect(obterParticipanteEolMock).not.toHaveBeenCalled()
    expect(obterParticipanteCpfMock).not.toHaveBeenCalled()
  })

  it('mantém o CPF do estudante externo somente leitura e não acusa duplicidade', async () => {
    checarDuplicidadeInscricaoEstudanteExternoMock.mockResolvedValue({
      possui_inscricao: true,
    })
    obterInscricaoMock.mockResolvedValue({
      ...inscricaoDetalheExemplo,
      tipo_estudante: 'ESTUDANTE_EXTERNO',
      tipo_estudante_label: 'Estudante externo',
      codigo_eol: '',
      cpf_participante: '39200791085',
    })

    renderFormularioEdicao()

    const cpf = await screen.findByRole('textbox', {
      name: /cpf do\(a\) participante/i,
    })
    expect(cpf).toHaveValue('392.007.910-85')
    expect(cpf).toHaveAttribute('readonly')
    expect(
      checarDuplicidadeInscricaoEstudanteExternoMock,
    ).not.toHaveBeenCalled()
    expect(showToastMock).not.toHaveBeenCalledWith(
      expect.objectContaining({
        description: MENSAGEM_DUPLICIDADE_CPF_PARTICIPANTE,
      }),
    )
  })

  it('impede finalizar a edição quando um campo obrigatório está vazio', async () => {
    const usuario = userEvent.setup()
    renderFormularioEdicao()

    const email = await screen.findByLabelText(/\be-mail\b/i)
    await usuario.clear(email)
    await usuario.click(
      screen.getByRole('button', { name: /^finalizar inscrição$/i }),
    )

    expect(
      await screen.findByText('Este campo é obrigatório.'),
    ).toBeInTheDocument()
    expect(atualizarInscricaoMock).not.toHaveBeenCalled()
    expect(cadastrarInscricaoMock).not.toHaveBeenCalled()
  })

  it('cancela a edição sem gravar e volta para a consulta', async () => {
    const usuario = userEvent.setup()
    renderFormularioEdicao()

    await screen.findByLabelText(/\be-mail\b/i)
    await usuario.click(screen.getByRole('button', { name: /cancelar/i }))

    expect(screen.getByText(/inscrições de participantes/i)).toBeInTheDocument()
    expect(atualizarInscricaoMock).not.toHaveBeenCalled()
  })

  it('grava a edição e confirma o status retornado', async () => {
    const usuario = userEvent.setup()
    renderFormularioEdicao()

    await screen.findByLabelText(/\be-mail\b/i)
    await usuario.click(
      screen.getByRole('button', { name: /^finalizar inscrição$/i }),
    )

    await waitFor(() => {
      expect(atualizarInscricaoMock).toHaveBeenCalledWith(
        'inscricao-1',
        expect.objectContaining({
          codigoEol: '1234567',
          cpf: '12345678901',
          polo: 'polo-1',
          unidadeEducacional: 'EMEF Teste',
          unidadeEducacionalCodigoEol: '094633',
          unidadeEducacionalTipo: 'EMEF',
          email: 'mariafernanda@gmail.com',
        }),
      )
      expect(
        screen.getByText(/inscrições de participantes/i),
      ).toBeInTheDocument()
    })
    expect(showToastMock).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'inscricao-salva',
        title: 'Inscrição salva com sucesso',
        description: 'Sua inscrição foi salva com o status: Completa',
        variant: 'success',
      }),
    )
    expect(cadastrarInscricaoMock).not.toHaveBeenCalled()
  })
})
