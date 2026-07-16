import { beforeEach, describe, expect, it, vi } from 'vitest'

import { requisicaoAutenticada } from '../autenticacao'
import {
  ErroListagemDefinicoesPolo,
  ErroSincronizacaoUnidadesDiretas,
  atualizarDefinicoesPoloEmLote,
  listarDefinicoesPolo,
  listarOpcoesFiltroDefinicaoPolos,
  sincronizarUnidadesDiretas,
} from './api'

vi.mock('../autenticacao', () => ({
  requisicaoAutenticada: vi.fn(),
}))

const requisicaoAutenticadaMock = vi.mocked(requisicaoAutenticada)

describe('definicaoPolo/api', () => {
  beforeEach(() => {
    requisicaoAutenticadaMock.mockReset()
  })

  it('lista opções de filtro a partir do endpoint dedicado', async () => {
    requisicaoAutenticadaMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          dres: ['DIRETORIA REGIONAL DE EDUCACAO PENHA'],
          tiposUe: ['CEI DIRET', 'EMEF'],
          gestoes: ['Direta', 'Parceira'],
          nomesEdicao: ['-', 'Janeiro 2025'],
          tiposPolo: ['Pendente', 'Polo oficial', 'Polo reserva'],
        }),
        { status: 200 },
      ),
    )

    await expect(listarOpcoesFiltroDefinicaoPolos()).resolves.toEqual({
      dres: ['DIRETORIA REGIONAL DE EDUCACAO PENHA'],
      tiposUe: ['CEI DIRET', 'EMEF'],
      gestoes: ['Direta', 'Parceira'],
      nomesEdicao: ['-', 'Janeiro 2025'],
      tiposPolo: ['Pendente', 'Polo oficial', 'Polo reserva'],
    })

    expect(requisicaoAutenticadaMock).toHaveBeenCalledWith(
      '/api/polos/opcoes-filtro/',
      { method: 'GET' },
    )
  })

  it('lança ErroOpcoesFiltroDefinicaoPolos quando o payload não é objeto', async () => {
    requisicaoAutenticadaMock.mockResolvedValue(
      new Response(JSON.stringify(null), { status: 200 }),
    )

    await expect(listarOpcoesFiltroDefinicaoPolos()).rejects.toMatchObject({
      name: 'ErroOpcoesFiltroDefinicaoPolos',
      mensagemUsuario: 'Resposta de opções de filtro inválida.',
    })
  })

  it('lança ErroOpcoesFiltroDefinicaoPolos com error do corpo quando !ok', async () => {
    requisicaoAutenticadaMock.mockResolvedValue(
      new Response(JSON.stringify({ error: 'Filtros indisponíveis' }), {
        status: 503,
      }),
    )

    await expect(listarOpcoesFiltroDefinicaoPolos()).rejects.toMatchObject({
      name: 'ErroOpcoesFiltroDefinicaoPolos',
      mensagemUsuario: 'Filtros indisponíveis',
    })
  })

  it('lança ErroOpcoesFiltroDefinicaoPolos com detail do corpo quando !ok', async () => {
    requisicaoAutenticadaMock.mockResolvedValue(
      new Response(JSON.stringify({ detail: 'Acesso negado' }), {
        status: 403,
      }),
    )

    await expect(listarOpcoesFiltroDefinicaoPolos()).rejects.toMatchObject({
      name: 'ErroOpcoesFiltroDefinicaoPolos',
      mensagemUsuario: 'Acesso negado',
    })
  })

  it('lança ErroOpcoesFiltroDefinicaoPolos com fallback quando JSON vazio e !ok', async () => {
    requisicaoAutenticadaMock.mockResolvedValue(
      new Response(JSON.stringify({}), { status: 500 }),
    )

    await expect(listarOpcoesFiltroDefinicaoPolos()).rejects.toMatchObject({
      name: 'ErroOpcoesFiltroDefinicaoPolos',
      mensagemUsuario: 'Não foi possível carregar as opções dos filtros.',
    })
  })

  it('lança ErroOpcoesFiltroDefinicaoPolos quando payload de opções é inválido', async () => {
    requisicaoAutenticadaMock.mockResolvedValue(
      new Response(JSON.stringify({ dres: 'inválido' }), { status: 200 }),
    )

    await expect(listarOpcoesFiltroDefinicaoPolos()).rejects.toMatchObject({
      name: 'ErroOpcoesFiltroDefinicaoPolos',
      mensagemUsuario: 'Resposta de opções de filtro inválida.',
    })
  })

  it('sincroniza unidades diretas no endpoint dedicado', async () => {
    requisicaoAutenticadaMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          totalConsultados: 10,
          totalNovos: 2,
          totalJaExistentes: 8,
          unidadesNovas: [],
          executada: true,
          motivoIgnorada: null,
          ultimaExecucaoEm: '2026-07-13T12:00:00+00:00',
        }),
        { status: 200 },
      ),
    )

    await expect(sincronizarUnidadesDiretas()).resolves.toEqual({
      totalConsultados: 10,
      totalNovos: 2,
      totalJaExistentes: 8,
      executada: true,
      motivoIgnorada: null,
      ultimaExecucaoEm: '2026-07-13T12:00:00+00:00',
    })

    expect(requisicaoAutenticadaMock).toHaveBeenCalledWith(
      '/api/polos/unidades-diretas/',
      { method: 'GET' },
    )
  })

  it('lança ErroSincronizacaoUnidadesDiretas quando resposta de sync é inválida', async () => {
    requisicaoAutenticadaMock.mockResolvedValue(
      new Response(JSON.stringify({ totalConsultados: '10' }), { status: 200 }),
    )

    await expect(sincronizarUnidadesDiretas()).rejects.toMatchObject({
      name: 'ErroSincronizacaoUnidadesDiretas',
      mensagemUsuario: 'Resposta de sincronização inválida.',
    })
  })

  it('normaliza motivoIgnorada e ultimaExecucaoEm para null quando não são string', async () => {
    requisicaoAutenticadaMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          totalConsultados: 1,
          totalNovos: 0,
          totalJaExistentes: 1,
          unidadesNovas: [],
          executada: false,
          motivoIgnorada: 123,
          ultimaExecucaoEm: false,
        }),
        { status: 200 },
      ),
    )

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
    requisicaoAutenticadaMock.mockResolvedValue(
      new Response(
        JSON.stringify({
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
        }),
        { status: 200 },
      ),
    )

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

    const [url] = requisicaoAutenticadaMock.mock.calls[0] ?? []
    expect(url).toBe(
      '/api/polos/?page=1&pageSize=10&dre=DRE+Butant%C3%A3&tipoUe=EMEF&gestao=Direta&nomeEdicao=Janeiro+2025&nomeUeOuCodigoEol=Centro',
    )
  })

  it('envia Tipo de Polo como filtro da coluna tipo', async () => {
    requisicaoAutenticadaMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          results: [],
          page: 1,
          pageSize: 10,
          total: 0,
          totalPages: 0,
        }),
        { status: 200 },
      ),
    )

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

    const [url] = requisicaoAutenticadaMock.mock.calls[0] ?? []
    expect(url).toBe('/api/polos/?page=1&pageSize=10&tipoPolo=Polo+oficial')
  })

  it('lança erro tipado quando a sincronização falha', async () => {
    requisicaoAutenticadaMock.mockResolvedValue(
      new Response(JSON.stringify({ error: 'SME indisponível' }), {
        status: 503,
      }),
    )

    await expect(sincronizarUnidadesDiretas()).rejects.toBeInstanceOf(
      ErroSincronizacaoUnidadesDiretas,
    )
  })

  it('atualiza nome da edição em lote', async () => {
    requisicaoAutenticadaMock.mockResolvedValue(
      new Response(JSON.stringify({ totalAtualizados: 2, results: [] }), {
        status: 200,
      }),
    )

    await expect(
      atualizarDefinicoesPoloEmLote({
        ids: [
          '11111111-1111-1111-1111-111111111111',
          '22222222-2222-2222-2222-222222222222',
        ],
        nomeEdicao: 'Janeiro 2026',
      }),
    ).resolves.toEqual({ totalAtualizados: 2 })

    expect(requisicaoAutenticadaMock).toHaveBeenCalledWith(
      '/api/polos/atualizacao-lote/',
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({
          ids: [
            '11111111-1111-1111-1111-111111111111',
            '22222222-2222-2222-2222-222222222222',
          ],
          nomeEdicao: 'Janeiro 2026',
        }),
      }),
    )
  })

  it('atualiza tipo de polo em lote', async () => {
    requisicaoAutenticadaMock.mockResolvedValue(
      new Response(JSON.stringify({ totalAtualizados: 1, results: [] }), {
        status: 200,
      }),
    )

    await expect(
      atualizarDefinicoesPoloEmLote({
        ids: ['11111111-1111-1111-1111-111111111111'],
        tipo: 'Polo oficial',
      }),
    ).resolves.toEqual({ totalAtualizados: 1 })
  })

  it('atualiza nomeEdicao e tipo juntos em lote', async () => {
    requisicaoAutenticadaMock.mockResolvedValue(
      new Response(JSON.stringify({ totalAtualizados: 1, results: [] }), {
        status: 200,
      }),
    )

    await expect(
      atualizarDefinicoesPoloEmLote({
        ids: ['11111111-1111-1111-1111-111111111111'],
        nomeEdicao: 'Julho 2026',
        tipo: 'Polo reserva',
      }),
    ).resolves.toEqual({ totalAtualizados: 1 })

    expect(requisicaoAutenticadaMock).toHaveBeenCalledWith(
      '/api/polos/atualizacao-lote/',
      expect.objectContaining({
        body: JSON.stringify({
          ids: ['11111111-1111-1111-1111-111111111111'],
          nomeEdicao: 'Julho 2026',
          tipo: 'Polo reserva',
        }),
      }),
    )
  })

  it('lança ErroAtualizacaoDefinicoesPolo quando atualização em lote falha', async () => {
    requisicaoAutenticadaMock.mockResolvedValue(
      new Response(JSON.stringify({ error: 'Payload inválido' }), {
        status: 400,
      }),
    )

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
    requisicaoAutenticadaMock.mockResolvedValue(
      new Response(JSON.stringify({ results: [] }), { status: 200 }),
    )

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

  it('usa fallback de extrairMensagem quando o corpo da resposta não é JSON', async () => {
    requisicaoAutenticadaMock.mockResolvedValue(
      new Response('serviço indisponível', { status: 502 }),
    )

    await expect(listarDefinicoesPolo()).rejects.toMatchObject({
      name: 'ErroListagemDefinicoesPolo',
      mensagemUsuario: 'Não foi possível carregar a definição de polos.',
    })
  })

  it('lança erro tipado quando a listagem falha', async () => {
    requisicaoAutenticadaMock.mockResolvedValue(
      new Response(JSON.stringify({ error: 'Falha' }), { status: 500 }),
    )

    await expect(listarDefinicoesPolo()).rejects.toBeInstanceOf(
      ErroListagemDefinicoesPolo,
    )
  })

  it('lança ErroListagemDefinicoesPolo quando resposta de listagem é inválida', async () => {
    requisicaoAutenticadaMock.mockResolvedValue(
      new Response(JSON.stringify({ results: 'inválido' }), { status: 200 }),
    )

    await expect(listarDefinicoesPolo()).rejects.toMatchObject({
      name: 'ErroListagemDefinicoesPolo',
      mensagemUsuario: 'Resposta de listagem inválida.',
    })
  })
})
