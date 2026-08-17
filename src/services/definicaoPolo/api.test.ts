import { beforeEach, describe, expect, it, vi } from 'vitest'

import { api } from '../api/http'
import {
  ErroListagemDefinicoesPolo,
  ErroSincronizacaoUnidadesDiretas,
  atualizarDefinicoesPoloEmLote,
  listarDefinicoesPolo,
  listarOpcoesFiltroDefinicaoPolos,
  sincronizarUnidadesDiretas,
} from './api'

vi.mock('../api/http', () => ({
  api: { get: vi.fn(), patch: vi.fn() },
}))

const apiGetMock = vi.mocked(api.get)
const apiPatchMock = vi.mocked(api.patch)

describe('definicaoPolo/api', () => {
  beforeEach(() => {
    apiGetMock.mockReset()
    apiPatchMock.mockReset()
  })

  it('lista opções de filtro a partir do endpoint dedicado', async () => {
    apiGetMock.mockResolvedValue({
      data: {
        dres: ['DIRETORIA REGIONAL DE EDUCACAO PENHA'],
        tiposUe: ['CEI DIRET', 'EMEF'],
        gestoes: ['Direta', 'Parceira'],
        nomesEdicao: ['-', 'Janeiro 2025'],
        tiposPolo: ['Pendente', 'Polo oficial', 'Polo reserva'],
      },
    })

    await expect(listarOpcoesFiltroDefinicaoPolos()).resolves.toEqual({
      dres: ['DIRETORIA REGIONAL DE EDUCACAO PENHA'],
      tiposUe: ['CEI DIRET', 'EMEF'],
      gestoes: ['Direta', 'Parceira'],
      nomesEdicao: ['-', 'Janeiro 2025'],
      tiposPolo: ['Pendente', 'Polo oficial', 'Polo reserva'],
    })

    expect(apiGetMock).toHaveBeenCalledWith('/api/polos/opcoes-filtro/')
  })

  it('lança ErroOpcoesFiltroDefinicaoPolos quando o payload não é objeto', async () => {
    apiGetMock.mockResolvedValue({ data: null })

    await expect(listarOpcoesFiltroDefinicaoPolos()).rejects.toMatchObject({
      name: 'ErroOpcoesFiltroDefinicaoPolos',
      mensagemUsuario: 'Resposta de opções de filtro inválida.',
    })
  })

  it('lança ErroOpcoesFiltroDefinicaoPolos com error do corpo quando falha', async () => {
    apiGetMock.mockRejectedValue({
      response: { status: 503, data: { error: 'Filtros indisponíveis' } },
    })

    await expect(listarOpcoesFiltroDefinicaoPolos()).rejects.toMatchObject({
      name: 'ErroOpcoesFiltroDefinicaoPolos',
      mensagemUsuario: 'Filtros indisponíveis',
    })
  })

  it('lança ErroOpcoesFiltroDefinicaoPolos com detail do corpo quando falha', async () => {
    apiGetMock.mockRejectedValue({
      response: { status: 403, data: { detail: 'Acesso negado' } },
    })

    await expect(listarOpcoesFiltroDefinicaoPolos()).rejects.toMatchObject({
      name: 'ErroOpcoesFiltroDefinicaoPolos',
      mensagemUsuario: 'Acesso negado',
    })
  })

  it('lança ErroOpcoesFiltroDefinicaoPolos com detalhe do corpo quando falha', async () => {
    apiGetMock.mockRejectedValue({
      response: { status: 500, data: { detalhe: 'Erro interno' } },
    })

    await expect(listarOpcoesFiltroDefinicaoPolos()).rejects.toMatchObject({
      name: 'ErroOpcoesFiltroDefinicaoPolos',
      mensagemUsuario: 'Erro interno',
    })
  })

  it('lança ErroOpcoesFiltroDefinicaoPolos com fallback quando corpo vazio', async () => {
    apiGetMock.mockRejectedValue({
      response: { status: 500, data: {} },
    })

    await expect(listarOpcoesFiltroDefinicaoPolos()).rejects.toMatchObject({
      name: 'ErroOpcoesFiltroDefinicaoPolos',
      mensagemUsuario: 'Não foi possível carregar as opções dos filtros.',
    })
  })

  it('lança ErroOpcoesFiltroDefinicaoPolos quando payload de opções é inválido', async () => {
    apiGetMock.mockResolvedValue({ data: { dres: 'inválido' } })

    await expect(listarOpcoesFiltroDefinicaoPolos()).rejects.toMatchObject({
      name: 'ErroOpcoesFiltroDefinicaoPolos',
      mensagemUsuario: 'Resposta de opções de filtro inválida.',
    })
  })

  it('sincroniza unidades diretas no endpoint dedicado', async () => {
    apiGetMock.mockResolvedValue({
      data: {
        totalConsultados: 10,
        totalNovos: 2,
        totalJaExistentes: 8,
        unidadesNovas: [],
        executada: true,
        motivoIgnorada: null,
        ultimaExecucaoEm: '2026-07-13T12:00:00+00:00',
      },
    })

    await expect(sincronizarUnidadesDiretas()).resolves.toEqual({
      totalConsultados: 10,
      totalNovos: 2,
      totalJaExistentes: 8,
      executada: true,
      motivoIgnorada: null,
      ultimaExecucaoEm: '2026-07-13T12:00:00+00:00',
    })

    expect(apiGetMock).toHaveBeenCalledWith('/api/polos/unidades-diretas/')
  })

  it('lança ErroSincronizacaoUnidadesDiretas quando resposta de sync é inválida', async () => {
    apiGetMock.mockResolvedValue({ data: { totalConsultados: '10' } })

    await expect(sincronizarUnidadesDiretas()).rejects.toMatchObject({
      name: 'ErroSincronizacaoUnidadesDiretas',
      mensagemUsuario: 'Resposta de sincronização inválida.',
    })
  })

  it('normaliza motivoIgnorada e ultimaExecucaoEm para null quando não são string', async () => {
    apiGetMock.mockResolvedValue({
      data: {
        totalConsultados: 1,
        totalNovos: 0,
        totalJaExistentes: 1,
        unidadesNovas: [],
        executada: false,
        motivoIgnorada: 123,
        ultimaExecucaoEm: false,
      },
    })

    await expect(sincronizarUnidadesDiretas()).resolves.toEqual({
      totalConsultados: 1,
      totalNovos: 0,
      totalJaExistentes: 1,
      executada: false,
      motivoIgnorada: null,
      ultimaExecucaoEm: null,
    })
  })

  it('lista definições de polo com filtros suportados', async () => {
    apiGetMock.mockResolvedValue({
      data: {
        results: [
          {
            id: '11111111-1111-1111-1111-111111111111',
            dre: 'DRE Butantã',
            tipoUe: 'EMEF',
            nomePolo: 'Escola Centro',
            gestao: 'Direta',
          },
        ],
        page: 1,
        pageSize: 10,
        total: 1,
        totalPages: 1,
      },
    })

    const listagem = await listarDefinicoesPolo({
      pagina: 1,
      tamanhoPagina: 10,
      dre: 'DRE Butantã',
      tipoUe: 'EMEF',
      nomeUeOuCodigoEol: 'Centro',
      nomeEdicao: 'Janeiro 2025',
      tipoPolo: '',
      gestao: 'Direta',
    })

    expect(listagem.total).toBe(1)
    expect(listagem.polos[0]?.nomeUe).toBe('Escola Centro')

    expect(apiGetMock).toHaveBeenCalledWith('/api/polos/', {
      params: {
        page: '1',
        pageSize: '10',
        dre: 'DRE Butantã',
        tipoUe: 'EMEF',
        gestao: 'Direta',
        nomeEdicao: 'Janeiro 2025',
        nomeUeOuCodigoEol: 'Centro',
      },
    })
  })

  it('envia Tipo de Polo como filtro da coluna tipo', async () => {
    apiGetMock.mockResolvedValue({
      data: {
        results: [],
        page: 1,
        pageSize: 10,
        total: 0,
        totalPages: 0,
      },
    })

    await listarDefinicoesPolo({
      pagina: 1,
      tamanhoPagina: 10,
      dre: '',
      tipoUe: '',
      nomeUeOuCodigoEol: '',
      nomeEdicao: '',
      tipoPolo: 'Polo oficial',
      gestao: '',
    })

    expect(apiGetMock).toHaveBeenCalledWith('/api/polos/', {
      params: { page: '1', pageSize: '10', tipoPolo: 'Polo oficial' },
    })
  })

  it('lança erro tipado quando a sincronização falha', async () => {
    apiGetMock.mockRejectedValue({
      response: { status: 503, data: { error: 'SME indisponível' } },
    })

    await expect(sincronizarUnidadesDiretas()).rejects.toBeInstanceOf(
      ErroSincronizacaoUnidadesDiretas,
    )
  })

  it('atualiza nome da edição em lote', async () => {
    apiPatchMock.mockResolvedValue({
      data: { totalAtualizados: 2, results: [] },
    })

    await expect(
      atualizarDefinicoesPoloEmLote({
        ids: [
          '11111111-1111-1111-1111-111111111111',
          '22222222-2222-2222-2222-222222222222',
        ],
        nomeEdicao: 'Janeiro 2026',
      }),
    ).resolves.toEqual({ totalAtualizados: 2 })

    expect(apiPatchMock).toHaveBeenCalledWith('/api/polos/atualizacao-lote/', {
      ids: [
        '11111111-1111-1111-1111-111111111111',
        '22222222-2222-2222-2222-222222222222',
      ],
      nomeEdicao: 'Janeiro 2026',
    })
  })

  it('atualiza tipo de polo em lote', async () => {
    apiPatchMock.mockResolvedValue({
      data: { totalAtualizados: 1, results: [] },
    })

    await expect(
      atualizarDefinicoesPoloEmLote({
        ids: ['11111111-1111-1111-1111-111111111111'],
        tipo: 'Polo oficial',
      }),
    ).resolves.toEqual({ totalAtualizados: 1 })
  })

  it('atualiza nomeEdicao e tipo juntos em lote', async () => {
    apiPatchMock.mockResolvedValue({
      data: { totalAtualizados: 1, results: [] },
    })

    await expect(
      atualizarDefinicoesPoloEmLote({
        ids: ['11111111-1111-1111-1111-111111111111'],
        nomeEdicao: 'Julho 2026',
        tipo: 'Polo reserva',
      }),
    ).resolves.toEqual({ totalAtualizados: 1 })

    expect(apiPatchMock).toHaveBeenCalledWith('/api/polos/atualizacao-lote/', {
      ids: ['11111111-1111-1111-1111-111111111111'],
      nomeEdicao: 'Julho 2026',
      tipo: 'Polo reserva',
    })
  })

  it('lança ErroAtualizacaoDefinicoesPolo quando atualização em lote falha', async () => {
    apiPatchMock.mockRejectedValue({
      response: { status: 400, data: { error: 'Payload inválido' } },
    })

    await expect(
      atualizarDefinicoesPoloEmLote({
        ids: ['11111111-1111-1111-1111-111111111111'],
        tipo: 'Polo oficial',
      }),
    ).rejects.toMatchObject({
      name: 'ErroAtualizacaoDefinicoesPolo',
      mensagemUsuario: 'Payload inválido',
    })
  })

  it('lança ErroAtualizacaoDefinicoesPolo quando corpo de atualização é inválido', async () => {
    apiPatchMock.mockResolvedValue({ data: { results: [] } })

    await expect(
      atualizarDefinicoesPoloEmLote({
        ids: ['11111111-1111-1111-1111-111111111111'],
        tipo: 'Polo oficial',
      }),
    ).rejects.toMatchObject({
      name: 'ErroAtualizacaoDefinicoesPolo',
      mensagemUsuario: 'Resposta de atualização inválida.',
    })
  })

  it('usa a mensagem do corpo quando a resposta é texto puro', async () => {
    apiGetMock.mockRejectedValue({
      response: { status: 502, data: 'serviço indisponível' },
    })

    await expect(listarDefinicoesPolo()).rejects.toMatchObject({
      name: 'ErroListagemDefinicoesPolo',
      mensagemUsuario: 'serviço indisponível',
    })
  })

  it('usa fallback quando o corpo de erro não tem mensagem reconhecida', async () => {
    apiGetMock.mockRejectedValue({
      response: { status: 500, data: { motivo: 'x' } },
    })

    await expect(listarDefinicoesPolo()).rejects.toMatchObject({
      name: 'ErroListagemDefinicoesPolo',
      mensagemUsuario: 'Não foi possível carregar a definição de polos.',
    })
  })

  it('lança erro tipado quando a listagem falha', async () => {
    apiGetMock.mockRejectedValue({
      response: { status: 500, data: { error: 'Falha' } },
    })

    await expect(listarDefinicoesPolo()).rejects.toBeInstanceOf(
      ErroListagemDefinicoesPolo,
    )
  })

  it('lança ErroListagemDefinicoesPolo quando resposta de listagem é inválida', async () => {
    apiGetMock.mockResolvedValue({ data: { results: 'inválido' } })

    await expect(listarDefinicoesPolo()).rejects.toMatchObject({
      name: 'ErroListagemDefinicoesPolo',
      mensagemUsuario: 'Resposta de listagem inválida.',
    })
  })

  it('lança ErroAtualizacaoDefinicoesPolo com fallback quando falha sem mensagem', async () => {
    apiPatchMock.mockRejectedValue(new Error('network error'))

    await expect(
      atualizarDefinicoesPoloEmLote({
        ids: ['11111111-1111-1111-1111-111111111111'],
        tipo: 'Polo oficial',
      }),
    ).rejects.toMatchObject({
      name: 'ErroAtualizacaoDefinicoesPolo',
      mensagemUsuario: 'Não foi possível atualizar os polos selecionados.',
    })
  })
})
