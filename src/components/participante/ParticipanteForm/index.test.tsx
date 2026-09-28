import type { ComponentProps } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  AGRUPAMENTO_BERCARIO,
  AGRUPAMENTO_MINI_GRUPO,
  AGRUPAMENTO_QUATRO_A_QUATORZE,
  TIPO_ESTUDANTE_FORA_DA_REDE,
  TIPO_ESTUDANTE_REDE,
} from './constantes'
import { ParticipanteForm } from './index'

const { listarDresMock, listarPolosMock } = vi.hoisted(() => ({
  listarDresMock: vi.fn(),
  listarPolosMock: vi.fn(),
}))

vi.mock('@/services/dre/listarDres', () => ({
  listarDres: listarDresMock,
}))

vi.mock('@/services/polo/listarPolos', () => ({
  listarPolos: listarPolosMock,
}))

function renderFormulario(props?: ComponentProps<typeof ParticipanteForm>) {
  return render(
    <MemoryRouter initialEntries={['/inscricoes-participantes']}>
      <Routes>
        <Route
          path="/inscricoes-participantes"
          element={<ParticipanteForm {...props} />}
        />
        <Route path="/inicio" element={<div>Página Início</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ParticipanteForm', () => {
  beforeEach(() => {
    listarDresMock.mockReset()
    listarPolosMock.mockReset()
    listarDresMock.mockResolvedValue([])
    listarPolosMock.mockResolvedValue({
      count: 0,
      next: null,
      previous: null,
      results: [],
    })
  })

  it('renderiza alerta, seções do accordion e ações do rodapé', () => {
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
    expect(
      screen.getByLabelText(/tipo de agrupamento/i),
    ).toBeInTheDocument()
    expect(
      screen.queryByLabelText(/tipo de estudante/i),
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
    expect(screen.getByRole('button', { name: /^salvar$/i })).toBeInTheDocument()
  })

  it('navega para o início ao clicar em Cancelar', async () => {
    const usuario = userEvent.setup()
    renderFormulario()

    await usuario.click(screen.getByRole('button', { name: /cancelar/i }))

    expect(screen.getByText(/página início/i)).toBeInTheDocument()
  })

  it('mostra os campos de informações básicas, com EOL só no layout', async () => {
    const usuario = userEvent.setup()
    renderFormulario()

    const codigoEol = screen.getByRole('textbox', { name: /código eol/i })
    expect(codigoEol).not.toHaveAttribute('readonly')
    expect(codigoEol).toHaveAttribute('placeholder', 'Código EOL')
    expect(codigoEol).toHaveClass('pl-9')
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
    expect(
      screen.getByRole('button', { name: /consultar cpf/i }),
    ).toBeEnabled()
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
    listarPolosMock.mockImplementation(
      async (_busca: string | undefined, dreCodigoEol: string) => ({
        count: 1,
        next: null,
        previous: null,
        results: [
          {
            uuid: `polo-${dreCodigoEol}`,
            nome_polo: `Polo ${dreCodigoEol}`,
          },
        ],
      }),
    )
    renderFormulario()

    expect(screen.getByLabelText(/polo de inscrição/i)).toBeDisabled()

    await usuario.click(screen.getByLabelText(/\bdre\b/i))
    await usuario.click(
      await screen.findByRole('option', { name: 'DRE Butantã' }),
    )

    expect(listarPolosMock).toHaveBeenCalledWith(
      undefined,
      '108100',
      undefined,
      1,
      50,
    )
    expect(screen.getByLabelText(/polo de inscrição/i)).toBeEnabled()

    await usuario.click(screen.getByLabelText(/polo de inscrição/i))
    await usuario.click(
      await screen.findByRole('option', { name: 'Polo 108100' }),
    )
    expect(screen.getAllByText('Polo 108100').length).toBeGreaterThan(0)

    await usuario.click(screen.getByLabelText(/\bdre\b/i))
    await usuario.click(screen.getByRole('option', { name: 'DRE Ipiranga' }))

    expect(listarPolosMock).toHaveBeenLastCalledWith(
      undefined,
      '108200',
      undefined,
      1,
      50,
    )
    await waitFor(() => {
      expect(screen.queryByText('Polo 108100')).not.toBeInTheDocument()
    })
    expect(screen.getByText('Selecione o Polo')).toBeInTheDocument()
  })

  it('repassa o valor digitado para a busca informada', async () => {
    const usuario = userEvent.setup()
    const onBuscarCodigoEol = vi.fn()
    const onBuscarCpf = vi.fn()
    renderFormulario({ onBuscarCodigoEol, onBuscarCpf })

    await usuario.type(
      screen.getByRole('textbox', { name: /código eol/i }),
      '1234567',
    )
    await usuario.click(
      screen.getByRole('button', { name: /consultar código eol/i }),
    )
    expect(onBuscarCodigoEol).toHaveBeenCalledWith('1234567')

    await usuario.type(screen.getByRole('textbox', { name: /\bcpf\b/i }), '123')
    await usuario.click(screen.getByRole('button', { name: /consultar cpf/i }))
    expect(onBuscarCpf).toHaveBeenCalledWith('123')
  })

  it('trava Estudante da Rede e libera as seções ao escolher Berçário', async () => {
    const usuario = userEvent.setup()
    renderFormulario()

    await usuario.click(screen.getByLabelText(/tipo de agrupamento/i))
    await usuario.click(
      await screen.findByRole('option', { name: AGRUPAMENTO_BERCARIO }),
    )

    const tipo = await screen.findByLabelText(/tipo de estudante/i)
    expect(tipo).toHaveValue(TIPO_ESTUDANTE_REDE)
    expect(tipo).toHaveAttribute('readonly')
    expect(
      screen.getByRole('button', { name: /informações por grupo/i }),
    ).toHaveAttribute('aria-expanded', 'false')
    expect(
      screen.getByRole('button', { name: /informações de saúde/i }),
    ).toHaveAttribute('aria-expanded', 'false')

    await usuario.click(
      screen.getByRole('button', { name: /informações por grupo/i }),
    )

    expect(screen.getByLabelText(/grupo do participante/i)).toHaveValue(
      AGRUPAMENTO_BERCARIO,
    )
    const estaNaRede = screen.getByLabelText(/está na rede/i)
    expect(estaNaRede).toHaveValue('Sim')
    expect(estaNaRede).toHaveAttribute('readonly')
    expect(screen.getByLabelText(/unidade educacional/i)).toHaveAttribute(
      'readonly',
    )
  })

  it('limpa os campos do grupo ao trocar o agrupamento', async () => {
    const usuario = userEvent.setup()
    renderFormulario()

    await usuario.click(screen.getByLabelText(/tipo de agrupamento/i))
    await usuario.click(
      await screen.findByRole('option', {
        name: AGRUPAMENTO_QUATRO_A_QUATORZE,
      }),
    )
    await usuario.click(screen.getByLabelText(/tipo de estudante/i))
    await usuario.click(
      screen.getByRole('option', { name: TIPO_ESTUDANTE_FORA_DA_REDE }),
    )

    await usuario.click(
      screen.getByRole('button', { name: /informações por grupo/i }),
    )
    await usuario.click(screen.getByLabelText(/tipo de vaga/i))
    await usuario.click(screen.getByRole('option', { name: 'Integral' }))

    await usuario.click(screen.getByLabelText(/tipo de agrupamento/i))
    await usuario.click(
      screen.getByRole('option', { name: AGRUPAMENTO_BERCARIO }),
    )

    expect(screen.getByLabelText(/tipo de vaga/i)).toHaveTextContent(
      'Selecione o tipo de vaga',
    )
  })

  it('limpa Está na Rede ao sair de Estudante da Rede', async () => {
    const usuario = userEvent.setup()
    renderFormulario()

    await usuario.click(screen.getByLabelText(/tipo de agrupamento/i))
    await usuario.click(
      await screen.findByRole('option', { name: AGRUPAMENTO_BERCARIO }),
    )
    await usuario.click(
      screen.getByRole('button', { name: /informações por grupo/i }),
    )
    expect(screen.getByLabelText(/está na rede/i)).toHaveValue('Sim')

    await usuario.click(screen.getByLabelText(/tipo de agrupamento/i))
    await usuario.click(
      screen.getByRole('option', { name: AGRUPAMENTO_QUATRO_A_QUATORZE }),
    )
    await usuario.click(screen.getByLabelText(/tipo de estudante/i))
    await usuario.click(
      screen.getByRole('option', { name: TIPO_ESTUDANTE_FORA_DA_REDE }),
    )
    await usuario.click(
      screen.getByRole('button', { name: /informações por grupo/i }),
    )

    expect(screen.getByLabelText(/está na rede/i)).toHaveTextContent(
      'Selecione',
    )
  })

  it('trava Estudante da Rede ao escolher Mini Grupo', async () => {
    const usuario = userEvent.setup()
    renderFormulario()

    await usuario.click(screen.getByLabelText(/tipo de agrupamento/i))
    await usuario.click(
      await screen.findByRole('option', { name: AGRUPAMENTO_MINI_GRUPO }),
    )

    const tipo = await screen.findByLabelText(/tipo de estudante/i)
    expect(tipo).toHaveValue(TIPO_ESTUDANTE_REDE)
    expect(tipo).toHaveAttribute('readonly')
  })

  it('libera o tipo e só então as seções em 4 a 14 anos', async () => {
    const usuario = userEvent.setup()
    renderFormulario()

    await usuario.click(screen.getByLabelText(/tipo de agrupamento/i))
    await usuario.click(
      await screen.findByRole('option', {
        name: AGRUPAMENTO_QUATRO_A_QUATORZE,
      }),
    )

    expect(
      screen.queryByRole('button', { name: /informações por grupo/i }),
    ).not.toBeInTheDocument()

    await usuario.click(screen.getByLabelText(/tipo de estudante/i))
    expect(
      screen.getByRole('option', { name: TIPO_ESTUDANTE_REDE }),
    ).toBeInTheDocument()
    await usuario.click(
      screen.getByRole('option', { name: TIPO_ESTUDANTE_FORA_DA_REDE }),
    )

    expect(
      screen.getByRole('button', { name: /informações por grupo/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /informações de saúde/i }),
    ).toBeInTheDocument()
  })

  it('limpa o tipo e oculta as seções ao trocar o agrupamento', async () => {
    const usuario = userEvent.setup()
    renderFormulario()

    await usuario.click(screen.getByLabelText(/tipo de agrupamento/i))
    await usuario.click(
      await screen.findByRole('option', {
        name: AGRUPAMENTO_QUATRO_A_QUATORZE,
      }),
    )
    await usuario.click(screen.getByLabelText(/tipo de estudante/i))
    await usuario.click(
      screen.getByRole('option', { name: TIPO_ESTUDANTE_FORA_DA_REDE }),
    )

    await usuario.click(screen.getByLabelText(/tipo de agrupamento/i))
    await usuario.click(
      screen.getByRole('option', { name: AGRUPAMENTO_BERCARIO }),
    )

    const tipo = await screen.findByLabelText(/tipo de estudante/i)
    expect(tipo).toHaveValue(TIPO_ESTUDANTE_REDE)
    expect(tipo).toHaveAttribute('readonly')

    await usuario.click(screen.getByLabelText(/tipo de agrupamento/i))
    await usuario.click(
      screen.getByRole('option', { name: AGRUPAMENTO_QUATRO_A_QUATORZE }),
    )

    expect(screen.getByLabelText(/tipo de estudante/i)).not.toHaveValue(
      TIPO_ESTUDANTE_FORA_DA_REDE,
    )
    expect(
      screen.queryByRole('button', { name: /informações por grupo/i }),
    ).not.toBeInTheDocument()
  })
})
