import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { DefinicaoPolosListagem } from '@/components/definicaoPolo/DefinicaoPolosListagem'
import { FiltrosDefinicaoPolosForm } from '@/components/definicaoPolo/FiltrosDefinicaoPolosForm'
import { ModalAlterarSelecao } from '@/components/definicaoPolo/ModalAlterarSelecao'
import { useGetEdicoesPrograma } from '@/hooks/useGetEdicoesPrograma'
import { useGetSincronizacaoUnidadesDiretas } from '@/hooks/useGetSincronizacaoUnidadesDiretas'
import { usePatchDefinicoesPoloEmLote } from '@/hooks/usePatchDefinicoesPoloEmLote'
import { OPCOES_TIPO_POLO_ALTERACAO_MOCK } from '@/services/definicaoPolo/mocks'
import {
  FILTROS_LISTAGEM_DEFINICAO_POLOS_INICIAIS,
  type FiltrosListagemDefinicaoPolos,
} from '@/services/definicaoPolo/types'
import { CartaoConteudoInterno } from '@/pages/shared/edicoesProgramaStyles'

const NOME_EDICAO_SEM_VINCULO = '-'

export function DefinicaoPolosConteudo() {
  const queryClient = useQueryClient()
  const sincronizacaoQuery = useGetSincronizacaoUnidadesDiretas(true)
  const patchMutation = usePatchDefinicoesPoloEmLote()

  const [filtrosAplicados, setFiltrosAplicados] =
    useState<FiltrosListagemDefinicaoPolos>(
      FILTROS_LISTAGEM_DEFINICAO_POLOS_INICIAIS,
    )
  const [polosParaAlterarEdicao, setPolosParaAlterarEdicao] = useState<
    string[]
  >([])
  const [polosParaAlterarTipoPolo, setPolosParaAlterarTipoPolo] = useState<
    string[]
  >([])
  const [chaveResetSelecao, setChaveResetSelecao] = useState(0)

  const modalEdicaoAberto = polosParaAlterarEdicao.length > 0
  const modalTipoAberto = polosParaAlterarTipoPolo.length > 0
  const edicoesQuery = useGetEdicoesPrograma(modalEdicaoAberto)

  const opcoesNomeEdicao = useMemo(() => {
    if (edicoesQuery.isError) {
      return [{ valor: NOME_EDICAO_SEM_VINCULO, rotulo: NOME_EDICAO_SEM_VINCULO }]
    }

    if (!edicoesQuery.data) {
      return []
    }

    const nomes = Array.from(
      new Set(
        edicoesQuery.data
          .map((edicao) => edicao.nome.trim())
          .filter((nome) => nome !== ''),
      ),
    ).sort((a, b) => a.localeCompare(b, 'pt-BR'))

    return [
      { valor: NOME_EDICAO_SEM_VINCULO, rotulo: NOME_EDICAO_SEM_VINCULO },
      ...nomes.map((nome) => ({ valor: nome, rotulo: nome })),
    ]
  }, [edicoesQuery.data, edicoesQuery.isError])

  useEffect(() => {
    if (
      !sincronizacaoQuery.isSuccess ||
      !sincronizacaoQuery.data.executada ||
      sincronizacaoQuery.data.totalNovos === 0
    ) {
      return
    }

    void queryClient.invalidateQueries({ queryKey: ['definicoesPolo'] })
  }, [queryClient, sincronizacaoQuery.data, sincronizacaoQuery.isSuccess])

  function aplicarFiltros(filtros: FiltrosListagemDefinicaoPolos) {
    setFiltrosAplicados(filtros)
  }

  function limparFiltros() {
    setFiltrosAplicados(FILTROS_LISTAGEM_DEFINICAO_POLOS_INICIAIS)
  }

  function fecharModalAlterarEdicao() {
    if (patchMutation.isPending) return
    patchMutation.reset()
    setPolosParaAlterarEdicao([])
  }

  function fecharModalAlterarTipoPolo() {
    if (patchMutation.isPending) return
    patchMutation.reset()
    setPolosParaAlterarTipoPolo([])
  }

  function abrirModalAlterarEdicao(idsPolos: string[]) {
    patchMutation.reset()
    setPolosParaAlterarEdicao(idsPolos)
  }

  function abrirModalAlterarTipoPolo(idsPolos: string[]) {
    patchMutation.reset()
    setPolosParaAlterarTipoPolo(idsPolos)
  }

  function confirmarAlteracaoEdicao(nomeEdicao: string) {
    if (!nomeEdicao.trim() || polosParaAlterarEdicao.length === 0) return

    patchMutation.mutate(
      {
        ids: polosParaAlterarEdicao,
        nomeEdicao: nomeEdicao.trim(),
      },
      {
        onSuccess: () => {
          setPolosParaAlterarEdicao([])
          setChaveResetSelecao((chaveAtual) => chaveAtual + 1)
          void queryClient.invalidateQueries({ queryKey: ['definicoesPolo'] })
        },
      },
    )
  }

  function confirmarAlteracaoTipoPolo(tipoPolo: string) {
    if (!tipoPolo.trim() || polosParaAlterarTipoPolo.length === 0) return

    patchMutation.mutate(
      {
        ids: polosParaAlterarTipoPolo,
        tipo: tipoPolo.trim(),
      },
      {
        onSuccess: () => {
          setPolosParaAlterarTipoPolo([])
          setChaveResetSelecao((chaveAtual) => chaveAtual + 1)
          void queryClient.invalidateQueries({ queryKey: ['definicoesPolo'] })
        },
      },
    )
  }

  return (
    <>
      <FiltrosDefinicaoPolosForm
        onFiltrar={aplicarFiltros}
        onLimpar={limparFiltros}
      />

      <CartaoConteudoInterno>
        <DefinicaoPolosListagem
          filtros={filtrosAplicados}
          chaveResetSelecao={chaveResetSelecao}
          onVisualizarPolo={() => undefined}
          onAlterarEdicaoPolo={abrirModalAlterarEdicao}
          onAlterarTipoPolo={abrirModalAlterarTipoPolo}
        />
      </CartaoConteudoInterno>

      <ModalAlterarSelecao
        aberto={modalEdicaoAberto}
        titulo="Alterar Edição do Polo"
        descricao="Selecione o Nome da Edição que deseja vincular ao(s) Polo(s):"
        rotuloCampo="Selecione o Nome da Edição"
        idCampo="modal-nome-edicao"
        textoOpcaoVazia="Selecione o Nome da Edição"
        opcoes={opcoesNomeEdicao}
        estaCarregandoOpcoes={edicoesQuery.isPending}
        mensagemCarregamento="Carregando edições..."
        estaSalvando={patchMutation.isPending}
        erro={modalEdicaoAberto ? patchMutation.error : undefined}
        onFechar={fecharModalAlterarEdicao}
        onAlterar={confirmarAlteracaoEdicao}
      />

      <ModalAlterarSelecao
        aberto={modalTipoAberto}
        titulo="Alterar Tipo de Polo"
        descricao="Selecione o Tipo de Polo que deseja vincular ao(s) Polo(s):"
        rotuloCampo="Selecione o Tipo de Polo"
        idCampo="modal-tipo-polo"
        textoOpcaoVazia="Selecione o Tipo de Polo"
        opcoes={OPCOES_TIPO_POLO_ALTERACAO_MOCK}
        estaSalvando={patchMutation.isPending}
        erro={modalTipoAberto ? patchMutation.error : undefined}
        onFechar={fecharModalAlterarTipoPolo}
        onAlterar={confirmarAlteracaoTipoPolo}
      />
    </>
  )
}
