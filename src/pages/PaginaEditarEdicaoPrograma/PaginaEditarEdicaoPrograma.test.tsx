import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  ErroAtualizacaoEdicaoPrograma,
  ErroObterEdicaoPrograma,
} from '../../services/edicaoPrograma/api'
import PaginaEditarEdicaoPrograma from './index'

vi.mock('@/components/shared/menu-lateral', () => ({
  MenuLateral: () => <aside aria-label="menu lateral">Menu lateral</aside>,
}))

vi.mock('@/components/shared/cabecalho-pagina', () => ({
  CabecalhoPagina: () => <header>Header principal</header>,
}))

vi.mock('@/components/shared/mapa-visual', () => ({
  MapaVisual: () => <nav aria-label="Mapa do site">Mapa visual</nav>,
}))

const { obterEdicaoProgramaMock, atualizarEdicaoProgramaMock, navegarMock } =
  vi.hoisted(() => ({
    obterEdicaoProgramaMock: vi.fn(),
    atualizarEdicaoProgramaMock: vi.fn(),
    navegarMock: vi.fn(),
  }))

vi.mock('../../services/edicaoPrograma/api', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('../../services/edicaoPrograma/api')>()

  return {
    ...actual,
    obterEdicaoPrograma: obterEdicaoProgramaMock,
    atualizarEdicaoPrograma: atualizarEdicaoProgramaMock,
  }
})

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()

  return {
    ...actual,
    useNavigate: () => navegarMock,
  }
})

const edicaoCarregada = {
  id: '11111111-1111-1111-1111-111111111111',
  nome: 'Edição Teste',
  dataInicioEdicao: '2026-06-10',
  dataFimEdicao: '2026-06-20',
  dataInicioInscricoes: '2026-05-01',
  dataFimInscricoes: '2026-05-31',
  quantidadeInscritos: 50,
  quantidadeAtendimentoEfetivo: 40,
  quantidadePasseios: 5,
  quantidadeApresentacoes: 2,
}

function renderizarPagina(idEdicao = edicaoCarregada.id) {
  return render(
    <MemoryRouter initialEntries={[`/editar-edicao-programa/${idEdicao}`]}>
      <Routes>
        <Route
          path="/editar-edicao-programa/:idEdicao"
          element={<PaginaEditarEdicaoPrograma />}
        />
      </Routes>
    </MemoryRouter>,
  )
}

async function confirmarSalvamentoNoModal(
  usuario: ReturnType<typeof userEvent.setup>,
) {
  const modal = await screen.findByRole('dialog')
  await usuario.click(within(modal).getByRole('button', { name: /^salvar$/i }))
}

describe('PaginaEditarEdicaoPrograma', () => {
  beforeEach(() => {
    obterEdicaoProgramaMock.mockReset()
    atualizarEdicaoProgramaMock.mockReset()
    navegarMock.mockReset()

    obterEdicaoProgramaMock.mockResolvedValue(edicaoCarregada)
    atualizarEdicaoProgramaMock.mockResolvedValue(edicaoCarregada)
  })

  it('renderiza título e carrega dados da edição', async () => {
    renderizarPagina()

    expect(
      screen.getByRole('heading', { name: /editar edição do programa/i }),
    ).toBeInTheDocument()

    expect(await screen.findByDisplayValue('Edição Teste')).toBeInTheDocument()
    expect(screen.getByLabelText(/data de início da edição/i)).toHaveValue(
      '2026-06-10',
    )
    expect(screen.getByLabelText(/data de fim da edição/i)).toHaveValue(
      '2026-06-20',
    )
    expect(screen.getByLabelText(/data de início das inscrições/i)).toHaveValue(
      '2026-05-01',
    )
    expect(screen.getByLabelText(/data de fim das inscrições/i)).toHaveValue(
      '2026-05-31',
    )

    expect(obterEdicaoProgramaMock).toHaveBeenCalledWith(edicaoCarregada.id)
  })

  it('exibe campos numéricos bloqueados com valores da edição', async () => {
    renderizarPagina()

    expect(
      await screen.findByLabelText(/quantidade de inscritos/i),
    ).toHaveValue(50)
    expect(
      screen.getByLabelText(/quantidade de atendimento efetivo/i),
    ).toHaveValue(40)
    expect(screen.getByLabelText(/quantidade de passeios/i)).toHaveValue(5)
    expect(screen.getByLabelText(/quantidade de apresentações/i)).toHaveValue(2)
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

    const botaoSalvar = await screen.findByRole('button', { name: /salvar/i })
    expect(botaoSalvar).toBeDisabled()

    const campoNome = screen.getByLabelText(/nome da edição/i)
    await usuario.clear(campoNome)
    await usuario.type(campoNome, 'Edição Atualizada')

    expect(botaoSalvar).toBeEnabled()
  })

  it('desabilita o botão salvar ao reverter alterações', async () => {
    const usuario = userEvent.setup()

    renderizarPagina()

    const botaoSalvar = await screen.findByRole('button', { name: /salvar/i })
    const campoNome = screen.getByLabelText(/nome da edição/i)

    await usuario.clear(campoNome)
    await usuario.type(campoNome, 'Edição Atualizada')
    expect(botaoSalvar).toBeEnabled()

    await usuario.clear(campoNome)
    await usuario.type(campoNome, 'Edição Teste')
    expect(botaoSalvar).toBeDisabled()
  })

  it('exibe modal de confirmação ao clicar em salvar', async () => {
    const usuario = userEvent.setup()

    renderizarPagina()

    const campoNome = await screen.findByLabelText(/nome da edição/i)
    await usuario.clear(campoNome)
    await usuario.type(campoNome, 'Edição Atualizada')
    await usuario.click(screen.getByRole('button', { name: /salvar/i }))

    expect(await screen.findByRole('dialog')).toBeInTheDocument()
    expect(
      screen.getByText(
        /deseja salvar as alterações realizadas na edição do programa/i,
      ),
    ).toBeInTheDocument()
    expect(atualizarEdicaoProgramaMock).not.toHaveBeenCalled()
  })

  it('não submete ao cancelar o modal de confirmação', async () => {
    const usuario = userEvent.setup()

    renderizarPagina()

    const campoNome = await screen.findByLabelText(/nome da edição/i)
    await usuario.clear(campoNome)
    await usuario.type(campoNome, 'Edição Atualizada')
    await usuario.click(screen.getByRole('button', { name: /salvar/i }))

    const modal = await screen.findByRole('dialog')
    await usuario.click(
      within(modal).getByRole('button', { name: /^cancelar$/i }),
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(atualizarEdicaoProgramaMock).not.toHaveBeenCalled()
  })

  it('atualiza edição via API e redireciona para a listagem', async () => {
    const usuario = userEvent.setup()

    renderizarPagina()

    const campoNome = await screen.findByLabelText(/nome da edição/i)
    await usuario.clear(campoNome)
    await usuario.type(campoNome, 'Edição Atualizada')
    await usuario.click(screen.getByRole('button', { name: /salvar/i }))
    await confirmarSalvamentoNoModal(usuario)

    await waitFor(() => {
      expect(atualizarEdicaoProgramaMock).toHaveBeenCalledWith(
        edicaoCarregada.id,
        {
          nome: 'Edição Atualizada',
          dataInicioEdicao: '2026-06-10',
          dataFimEdicao: '2026-06-20',
          dataInicioInscricoes: '2026-05-01',
          dataFimInscricoes: '2026-05-31',
        },
        {
          quantidadeInscritos: 50,
          quantidadeAtendimentoEfetivo: 40,
          quantidadePasseios: 5,
          quantidadeApresentacoes: 2,
        },
      )
    })

    expect(navegarMock).toHaveBeenCalledWith('/edicoes-programa')
  })

  it('exibe mensagem de erro quando a consulta falha', async () => {
    obterEdicaoProgramaMock.mockRejectedValue(
      new ErroObterEdicaoPrograma('Edição não encontrada.'),
    )

    renderizarPagina()

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Edição não encontrada.',
    )
    expect(
      screen.queryByRole('button', { name: /salvar/i }),
    ).not.toBeInTheDocument()
  })

  it('exibe mensagem de erro quando a atualização falha', async () => {
    const usuario = userEvent.setup()

    atualizarEdicaoProgramaMock.mockRejectedValue(
      new ErroAtualizacaoEdicaoPrograma('Não foi possível salvar a edição.'),
    )

    renderizarPagina()

    const campoNome = await screen.findByLabelText(/nome da edição/i)
    await usuario.clear(campoNome)
    await usuario.type(campoNome, 'Edição Alterada')
    await usuario.click(screen.getByRole('button', { name: /salvar/i }))
    await confirmarSalvamentoNoModal(usuario)

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Não foi possível salvar a edição.',
    )
    expect(navegarMock).not.toHaveBeenCalled()
  })
})
