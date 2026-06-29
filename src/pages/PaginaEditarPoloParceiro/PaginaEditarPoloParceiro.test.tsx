import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  ErroAtualizacaoPoloParceiro,
  ErroObterPoloParceiro,
} from '../../services/poloParceiro/api'

import PaginaEditarPoloParceiro from './index'

vi.mock('../../components/MenuLateral', () => ({
  MenuLateral: () => <aside aria-label="menu lateral">Menu lateral</aside>,
}))

vi.mock('../../components/Cabecalho', () => ({
  Cabecalho: () => <header>Header principal</header>,
}))

vi.mock('../../components/MapaVisual', () => ({
  MapaVisual: () => <nav aria-label="Mapa do site">Mapa visual</nav>,
}))

const {
  obterPoloParceiroMock,
  atualizarPoloParceiroMock,
  listarDresNomeAbreviacaoMock,
  listarTiposEscolasMock,
  navegarMock,
} = vi.hoisted(() => ({
  obterPoloParceiroMock: vi.fn(),
  atualizarPoloParceiroMock: vi.fn(),
  listarDresNomeAbreviacaoMock: vi.fn(),
  listarTiposEscolasMock: vi.fn(),
  navegarMock: vi.fn(),
}))

vi.mock('../../services/poloParceiro/api', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('../../services/poloParceiro/api')>()

  return {
    ...actual,
    obterPoloParceiro: obterPoloParceiroMock,
    atualizarPoloParceiro: atualizarPoloParceiroMock,
  }
})

vi.mock('../../services/smeIntegracao/api', () => ({
  listarDresNomeAbreviacao: listarDresNomeAbreviacaoMock,
  listarTiposEscolas: listarTiposEscolasMock,
}))

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()

  return {
    ...actual,
    useNavigate: () => navegarMock,
  }
})

const poloCarregado = {
  id: '11111111-1111-1111-1111-111111111111',
  tipo: 'Parceiro',
  nomeOsc: 'OSC Teste',
  nomePolo: 'Polo Teste',
  dre: 'DIRETORIA REGIONAL DE EDUCACAO BUTANTA',
  tipoUe: 'EMEF',
  quantidadeMaximaAlunos: 50,
  cep: '01310100',
  endereco: 'Av. Paulista, 1000',
  nomeGestor: 'Gestor Teste',
  emailPolo: 'polo@teste.com',
  telefonePolo: '11999999999',
  status: 'ativo',
  observacoesGerais: 'Observação inicial',
}

function renderizarPagina(idPolo = poloCarregado.id) {
  return render(
    <MemoryRouter initialEntries={[`/editar-polo-parceiro/${idPolo}`]}>
      <Routes>
        <Route
          path="/editar-polo-parceiro/:idPolo"
          element={<PaginaEditarPoloParceiro />}
        />
      </Routes>
    </MemoryRouter>,
  )
}

async function aguardarFormularioCarregado() {
  await waitFor(() => {
    expect(screen.getByDisplayValue('OSC Teste')).toBeInTheDocument()
  })
}

async function confirmarSalvamentoNoModal(
  usuario: ReturnType<typeof userEvent.setup>,
) {
  const modal = await screen.findByRole('dialog')
  await usuario.click(within(modal).getByRole('button', { name: /^salvar$/i }))
}

describe('PaginaEditarPoloParceiro', () => {
  beforeEach(() => {
    obterPoloParceiroMock.mockReset()
    atualizarPoloParceiroMock.mockReset()
    navegarMock.mockReset()
    listarDresNomeAbreviacaoMock.mockResolvedValue([
      {
        codigo: '108100',
        nome: 'DIRETORIA REGIONAL DE EDUCACAO BUTANTA',
        abreviacao: 'DRE - BT',
      },
    ])
    listarTiposEscolasMock.mockResolvedValue([
      {
        codigo: 1,
        descricaoSigla: 'EMEF',
        dtAtualizacao: '2012-01-13T14:09:23.647',
      },
    ])

    obterPoloParceiroMock.mockResolvedValue(poloCarregado)
    atualizarPoloParceiroMock.mockResolvedValue({
      id: poloCarregado.id,
      dre: poloCarregado.dre,
      tipoUe: poloCarregado.tipoUe,
      nomePolo: 'Polo Atualizado',
      nomeOsc: 'OSC Teste',
    })
  })

  it('renderiza título e carrega dados do polo parceiro', async () => {
    renderizarPagina()

    expect(
      screen.getByRole('heading', { name: /editar polo parceiro/i }),
    ).toBeInTheDocument()

    await aguardarFormularioCarregado()

    expect(screen.getByLabelText(/^tipo$/i)).toHaveValue('Parceiro')
    expect(screen.getByLabelText(/^status$/i)).toHaveValue('ativo')
    expect(screen.getByLabelText(/nome da osc/i)).toHaveValue('OSC Teste')
    expect(screen.getByLabelText(/nome do polo/i)).toHaveValue('Polo Teste')
    expect(obterPoloParceiroMock).toHaveBeenCalledWith(poloCarregado.id)
  })

  it('mantém o botão salvar desabilitado até detectar alteração', async () => {
    renderizarPagina()

    expect(
      await screen.findByRole('button', { name: /salvar/i }),
    ).toBeDisabled()
  })

  it('habilita o botão salvar após alteração no formulário', async () => {
    const usuario = userEvent.setup()

    renderizarPagina()
    await aguardarFormularioCarregado()

    const botaoSalvar = screen.getByRole('button', { name: /salvar/i })
    await usuario.clear(screen.getByLabelText(/nome do polo/i))
    await usuario.type(
      screen.getByLabelText(/nome do polo/i),
      'Polo Atualizado',
    )

    expect(botaoSalvar).toBeEnabled()
  })

  it('habilita o botão salvar ao alterar o status', async () => {
    const usuario = userEvent.setup()

    renderizarPagina()
    await aguardarFormularioCarregado()

    const botaoSalvar = screen.getByRole('button', { name: /salvar/i })
    await usuario.selectOptions(screen.getByLabelText(/^status$/i), 'inativo')

    expect(botaoSalvar).toBeEnabled()
  })

  it('exibe modal de confirmação ao clicar em salvar', async () => {
    const usuario = userEvent.setup()

    renderizarPagina()
    await aguardarFormularioCarregado()

    await usuario.clear(screen.getByLabelText(/nome do polo/i))
    await usuario.type(
      screen.getByLabelText(/nome do polo/i),
      'Polo Atualizado',
    )
    await usuario.click(screen.getByRole('button', { name: /salvar/i }))

    expect(await screen.findByRole('dialog')).toBeInTheDocument()
    expect(
      screen.getByText(
        /deseja salvar as alterações realizadas no polo parceiro/i,
      ),
    ).toBeInTheDocument()
    expect(atualizarPoloParceiroMock).not.toHaveBeenCalled()
  })

  it('não submete ao cancelar o modal de confirmação', async () => {
    const usuario = userEvent.setup()

    renderizarPagina()
    await aguardarFormularioCarregado()

    await usuario.clear(screen.getByLabelText(/nome do polo/i))
    await usuario.type(
      screen.getByLabelText(/nome do polo/i),
      'Polo Atualizado',
    )
    await usuario.click(screen.getByRole('button', { name: /salvar/i }))

    const modal = await screen.findByRole('dialog')
    await usuario.click(
      within(modal).getByRole('button', { name: /^cancelar$/i }),
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(atualizarPoloParceiroMock).not.toHaveBeenCalled()
  })

  it('desabilita o botão salvar ao reverter alterações', async () => {
    const usuario = userEvent.setup()

    renderizarPagina()
    await aguardarFormularioCarregado()

    const botaoSalvar = screen.getByRole('button', { name: /salvar/i })
    const campoNomePolo = screen.getByLabelText(/nome do polo/i)

    await usuario.clear(campoNomePolo)
    await usuario.type(campoNomePolo, 'Polo Atualizado')
    expect(botaoSalvar).toBeEnabled()

    await usuario.clear(campoNomePolo)
    await usuario.type(campoNomePolo, 'Polo Teste')
    expect(botaoSalvar).toBeDisabled()
  })

  it('exibe mensagem de erro quando o id do polo não é informado', async () => {
    render(
      <MemoryRouter initialEntries={['/editar-polo-parceiro/']}>
        <Routes>
          <Route
            path="/editar-polo-parceiro/"
            element={<PaginaEditarPoloParceiro />}
          />
        </Routes>
      </MemoryRouter>,
    )

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Polo parceiro não encontrado.',
    )
    expect(obterPoloParceiroMock).not.toHaveBeenCalled()
  })

  it('exibe mensagem genérica quando a consulta falha inesperadamente', async () => {
    obterPoloParceiroMock.mockRejectedValue(new Error('Falha inesperada'))

    renderizarPagina()

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Não foi possível carregar o polo parceiro.',
    )
  })

  it('exibe mensagem de validação ao tentar salvar com e-mail inválido', async () => {
    const usuario = userEvent.setup()

    renderizarPagina()
    await aguardarFormularioCarregado()

    const campoEmail = screen.getByLabelText(/e-mail do polo/i)
    await usuario.clear(campoEmail)
    await usuario.type(campoEmail, 'email-invalido')
    await usuario.click(screen.getByRole('button', { name: /salvar/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Informe um e-mail válido para o polo.',
    )
    expect(atualizarPoloParceiroMock).not.toHaveBeenCalled()
  })

  it('detecta alteração ao editar campo com máscara de CEP', async () => {
    const usuario = userEvent.setup()

    renderizarPagina()
    await aguardarFormularioCarregado()

    const botaoSalvar = screen.getByRole('button', { name: /salvar/i })
    const campoCep = screen.getByLabelText(/^cep$/i)

    await usuario.clear(campoCep)
    await usuario.type(campoCep, '05508000')

    expect(botaoSalvar).toBeEnabled()
  })

  it('atualiza polo parceiro via API e redireciona para a listagem', async () => {
    const usuario = userEvent.setup()

    renderizarPagina()
    await aguardarFormularioCarregado()

    await usuario.clear(screen.getByLabelText(/nome do polo/i))
    await usuario.type(
      screen.getByLabelText(/nome do polo/i),
      'Polo Atualizado',
    )
    await usuario.click(screen.getByRole('button', { name: /salvar/i }))
    await confirmarSalvamentoNoModal(usuario)

    await waitFor(() => {
      expect(atualizarPoloParceiroMock).toHaveBeenCalledWith(
        poloCarregado.id,
        expect.objectContaining({
          nomePolo: 'Polo Atualizado',
          nomeOsc: 'OSC Teste',
          dre: 'DIRETORIA REGIONAL DE EDUCACAO BUTANTA',
          tipoUe: 'EMEF',
        }),
      )
    })

    expect(navegarMock).toHaveBeenCalledWith('/polos-parceiros')
  })

  it('exibe mensagem de erro quando a consulta falha', async () => {
    obterPoloParceiroMock.mockRejectedValue(
      new ErroObterPoloParceiro('Polo parceiro não encontrado.'),
    )

    renderizarPagina()

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Polo parceiro não encontrado.',
    )
    expect(
      screen.queryByRole('button', { name: /salvar/i }),
    ).not.toBeInTheDocument()
  })

  it('exibe mensagem de erro quando a atualização falha', async () => {
    const usuario = userEvent.setup()

    atualizarPoloParceiroMock.mockRejectedValue(
      new ErroAtualizacaoPoloParceiro(
        'Não foi possível salvar o polo parceiro.',
      ),
    )

    renderizarPagina()
    await aguardarFormularioCarregado()

    await usuario.clear(screen.getByLabelText(/nome do polo/i))
    await usuario.type(
      screen.getByLabelText(/nome do polo/i),
      'Polo Atualizado',
    )
    await usuario.click(screen.getByRole('button', { name: /salvar/i }))
    await confirmarSalvamentoNoModal(usuario)

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Não foi possível salvar o polo parceiro.',
    )
    expect(navegarMock).not.toHaveBeenCalled()
  })
})
