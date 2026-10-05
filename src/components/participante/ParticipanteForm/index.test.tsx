import type { ComponentProps } from 'react'

class ObservadorTamanho {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver ??=
  ObservadorTamanho as unknown as typeof ResizeObserver
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type {
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
  obterParticipanteEolMock,
  showToastMock,
} = vi.hoisted(() => ({
  listarDresMock: vi.fn(),
  listarPolosElegiveisMock: vi.fn(),
  listarValoresChoicesMock: vi.fn(),
  cadastrarInscricaoMock: vi.fn(),
  obterParticipanteEolMock: vi.fn(),
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

vi.mock('@/services/inscricao/obterParticipanteEol', () => ({
  obterParticipanteEol: obterParticipanteEolMock,
}))

vi.mock('@/hooks/useToast', () => ({
  useToast: () => ({ showToast: showToastMock, dismissToast: vi.fn() }),
}))

function renderFormulario(props?: ComponentProps<typeof ParticipanteForm>) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/inscricoes-participantes']}>
        <Routes>
          <Route
            path="/inscricoes-participantes"
            element={<ParticipanteForm {...props} />}
          />
          <Route path="/inicio" element={<div>Página Início</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

async function escolherGrupo(
  usuario: ReturnType<typeof userEvent.setup>,
  rotulo: string,
) {
  await usuario.click(await screen.findByLabelText(/grupo/i))
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
    obterParticipanteEolMock.mockReset()
    showToastMock.mockReset()
    listarDresMock.mockResolvedValue([])
    listarPolosElegiveisMock.mockResolvedValue([])
    listarValoresChoicesMock.mockResolvedValue(valoresChoicesExemplo)
    obterParticipanteEolMock.mockResolvedValue(participanteEolVazio)
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
    expect(screen.getByLabelText(/grupo/i)).toBeInTheDocument()
    expect(
      screen.queryByLabelText(/tipo de estudante/i),
    ).not.toBeInTheDocument()
    expect(screen.queryByRole('textbox', { name: /código eol/i })).not.toBeInTheDocument()
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

  it('navega para o início ao clicar em Cancelar', async () => {
    const usuario = userEvent.setup()
    renderFormulario()

    await usuario.click(screen.getByRole('button', { name: /cancelar/i }))

    expect(screen.getByText(/página início/i)).toBeInTheDocument()
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

    const cpf = screen.getByRole('textbox', { name: /\bcpf\b/i })
    expect(cpf).not.toHaveAttribute('readonly')
    expect(cpf).toHaveAttribute('placeholder', 'Digite o CPF')
    expect(cpf).toHaveClass('pl-9')
    expect(screen.getByRole('button', { name: /consultar cpf/i })).toBeEnabled()
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
    await usuario.type(screen.getByRole('textbox', { name: /\bcpf\b/i }), '123')
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
      expect(obterParticipanteEolMock).toHaveBeenCalledWith(
        '123456',
        expect.anything(),
      )
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
    expect(screen.getByRole('textbox', { name: /\bcpf\b/i })).toHaveValue('123')
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
    expect(obterParticipanteEolMock).toHaveBeenCalledWith(
      '123456',
      expect.anything(),
    )
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

  it('repassa o CPF digitado para a busca informada', async () => {
    const usuario = userEvent.setup()
    const onBuscarCpf = vi.fn()
    renderFormulario({ onBuscarCpf })

    await escolherGrupo(usuario, 'Berçário I')
    await usuario.type(screen.getByRole('textbox', { name: /\bcpf\b/i }), '123')
    await usuario.click(screen.getByRole('button', { name: /consultar cpf/i }))
    expect(onBuscarCpf).toHaveBeenCalledWith('123')
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
    expect(screen.queryByRole('textbox', { name: /código eol/i })).not.toBeInTheDocument()

    await usuario.click(screen.getByLabelText(/tipo de estudante/i))
    await usuario.click(
      screen.getByRole('option', { name: ROTULO_ESTUDANTE_EXTERNO }),
    )

    expect(screen.getByRole('textbox', { name: /código eol/i })).toBeInTheDocument()
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
    expect(screen.getByRole('textbox', { name: /código eol/i })).toBeInTheDocument()

    await escolherGrupo(usuario, 'Berçário I')

    const tipo = await screen.findByLabelText(/tipo de estudante/i)
    expect(tipo).toHaveValue(ROTULO_ESTUDANTE_REDE)
    expect(tipo).toHaveAttribute('readonly')

    await escolherGrupo(usuario, ROTULO_QUATRO_A_14)

    expect(screen.getByLabelText(/tipo de estudante/i)).toHaveTextContent(
      'Selecione o tipo de estudante',
    )
    expect(screen.queryByRole('textbox', { name: /código eol/i })).not.toBeInTheDocument()
  })

  it('salva o rascunho incompleto e recusa e-mail inválido', async () => {
    const usuario = userEvent.setup()
    renderFormulario()

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
    })
    expect(showToastMock).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'inscricao-salva',
        description: 'Rascunho',
      }),
    )

    showToastMock.mockClear()
    cadastrarInscricaoMock.mockResolvedValueOnce({
      status: 'COMPLETA',
      status_label: 'Completa',
    })
    await usuario.click(screen.getByRole('button', { name: /^salvar$/i }))
    await waitFor(() => {
      expect(showToastMock).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'inscricao-salva',
          description: 'Completa',
        }),
      )
    })
    expect(cadastrarInscricaoMock).toHaveBeenCalledTimes(2)

    showToastMock.mockClear()
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
