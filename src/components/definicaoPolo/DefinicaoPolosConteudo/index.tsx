import { DefinicaoPolosListagem } from '@/components/definicaoPolo/DefinicaoPolosListagem'
import { FiltrosDefinicaoPolosForm } from '@/components/definicaoPolo/FiltrosDefinicaoPolosForm'
import { ModalAlterarSelecao } from '@/components/definicaoPolo/ModalAlterarSelecao'
import { CloseIcon } from '@/components/icons'
import { Modal } from '@/components/Modal'
import { Alert, AlertAction, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useGetEdicoesPrograma } from '@/hooks/useGetEdicoesPrograma'
import { usePostAlterarTipoEmMassa } from '@/hooks/usePostAlterarTipoEmMassa'
import { usePostPopularPolos } from '@/hooks/usePostPopularPolos'
import { usePostVincularEmMassa } from '@/hooks/usePostVincularEmMassa'
import { OPCOES_TIPO_POLO_ALTERACAO_MOCK } from '@/services/definicaoPolo/mocks'
import {
  FILTROS_LISTAGEM_DEFINICAO_POLOS_INICIAIS,
  type FiltrosListagemDefinicaoPolos,
  type PoloParaAlterarTipo,
} from '@/services/definicaoPolo/types'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

const MENSAGEM_BLOQUEIO_TIPO_SEM_EDICAO =
  'É necessário alterar a edição primeiro para, depois, vincular ou alterar o tipo de polo.'
const MENSAGEM_POLO_ALTERADO = 'Polo alterado com sucesso!'
const TEMPO_EXIBICAO_SUCESSO_MS = 3000

export function DefinicaoPolosConteudo() {
  const queryClient = useQueryClient()
  const { mutate: popularizarPolos } = usePostPopularPolos()
  const vincularEmMassaMutation = usePostVincularEmMassa()
  const alterarTipoMutation = usePostAlterarTipoEmMassa()
  const popularizacaoDisparada = useRef(false)

  const [filtrosAplicados, setFiltrosAplicados] =
    useState<FiltrosListagemDefinicaoPolos>(
      FILTROS_LISTAGEM_DEFINICAO_POLOS_INICIAIS,
    )
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false)
  const [polosParaVincularEdicao, setPolosParaVincularEdicao] = useState<
    string[]
  >([])
  const [polosParaAlterarTipoPolo, setPolosParaAlterarTipoPolo] = useState<
    PoloParaAlterarTipo[]
  >([])
  const [modalBloqueioTipoAberto, setModalBloqueioTipoAberto] = useState(false)
  const [mensagemSucessoVisivel, setMensagemSucessoVisivel] = useState(false)
  const [chaveResetSelecao, setChaveResetSelecao] = useState(0)

  const fecharMensagemSucesso = useCallback(() => {
    setMensagemSucessoVisivel(false)
  }, [])

  useEffect(() => {
    if (!mensagemSucessoVisivel) return

    const temporizador = globalThis.setTimeout(
      fecharMensagemSucesso,
      TEMPO_EXIBICAO_SUCESSO_MS,
    )
    return () => globalThis.clearTimeout(temporizador)
  }, [mensagemSucessoVisivel, fecharMensagemSucesso])

  const modalTipoAberto = polosParaAlterarTipoPolo.length > 0
  const edicoesQuery = useGetEdicoesPrograma(modalEdicaoAberto)

  const opcoesNomeEdicao = useMemo(() => {
    if (!edicoesQuery.data) {
      return []
    }

    return edicoesQuery.data
      .filter((edicao) => edicao.nome.trim() !== '')
      .map((edicao) => ({
        valor: edicao.uuid,
        rotulo: edicao.nome.trim(),
      }))
  }, [edicoesQuery.data])

  useEffect(() => {
    if (popularizacaoDisparada.current) return
    popularizacaoDisparada.current = true

    popularizarPolos(undefined, {
      onSuccess: (resultado) => {
        if (!resultado.executada || resultado.total_novos === 0) return
        void queryClient.invalidateQueries({ queryKey: ['definicoesPolo'] })
      },
    })
  }, [popularizarPolos, queryClient])

  function aplicarFiltros(filtros: FiltrosListagemDefinicaoPolos) {
    setFiltrosAplicados(filtros)
  }

  function limparFiltros() {
    setFiltrosAplicados(FILTROS_LISTAGEM_DEFINICAO_POLOS_INICIAIS)
  }

  function fecharModalAlterarEdicao() {
    if (vincularEmMassaMutation.isPending) return
    vincularEmMassaMutation.reset()
    setModalEdicaoAberto(false)
    setPolosParaVincularEdicao([])
  }

  function fecharModalAlterarTipoPolo() {
    if (alterarTipoMutation.isPending) return
    alterarTipoMutation.reset()
    setPolosParaAlterarTipoPolo([])
  }

  function abrirModalAlterarEdicao(idsPolos: string[]) {
    vincularEmMassaMutation.reset()
    setPolosParaVincularEdicao(idsPolos)
    setModalEdicaoAberto(true)
  }

  function fecharModalBloqueioTipo() {
    setModalBloqueioTipoAberto(false)
  }

  function abrirModalAlterarTipoPolo(polos: PoloParaAlterarTipo[]) {
    if (polos.some((polo) => !polo.edicao_uuid)) {
      setModalBloqueioTipoAberto(true)
      return
    }

    alterarTipoMutation.reset()
    setPolosParaAlterarTipoPolo(polos)
  }

  function confirmarAlteracaoEdicao(edicaoDestino: string) {
    if (!edicaoDestino.trim() || polosParaVincularEdicao.length === 0) return

    vincularEmMassaMutation.mutate(
      {
        polos: polosParaVincularEdicao,
        edicao: edicaoDestino.trim(),
      },
      {
        onSuccess: () => {
          setModalEdicaoAberto(false)
          setPolosParaVincularEdicao([])
          setChaveResetSelecao((chaveAtual) => chaveAtual + 1)
          setMensagemSucessoVisivel(true)
          void queryClient.invalidateQueries({ queryKey: ['definicoesPolo'] })
        },
      },
    )
  }

  function confirmarAlteracaoTipoPolo(tipoPolo: string) {
    if (!tipoPolo.trim()) return

    const operacoes = polosParaAlterarTipoPolo.flatMap((polo) => {
      if (!polo.edicao_uuid) {
        return []
      }

      return [
        {
          polo_uuid: polo.polo_uuid,
          edicao: polo.edicao_uuid,
          tipo: tipoPolo.trim(),
        },
      ]
    })

    if (operacoes.length === 0) return

    alterarTipoMutation.mutate(operacoes, {
      onSuccess: () => {
        setPolosParaAlterarTipoPolo([])
        setChaveResetSelecao((chaveAtual) => chaveAtual + 1)
        setMensagemSucessoVisivel(true)
        void queryClient.invalidateQueries({ queryKey: ['definicoesPolo'] })
      },
    })
  }

  return (
    <>
      {mensagemSucessoVisivel ? (
        <Alert
          role="status"
          className="mt-3 min-h-12 items-center border-verde-medio bg-verde-claro py-3 text-center font-bold text-verde-escuro"
        >
          <AlertDescription className="text-verde-escuro">
            {MENSAGEM_POLO_ALTERADO}
          </AlertDescription>
          <AlertAction>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Fechar mensagem de sucesso"
              className="text-verde-escuro hover:bg-verde-escuro/10 hover:text-verde-escuro"
              onClick={fecharMensagemSucesso}
            >
              <CloseIcon />
            </Button>
          </AlertAction>
        </Alert>
      ) : null}

      <FiltrosDefinicaoPolosForm
        onFiltrar={aplicarFiltros}
        onLimpar={limparFiltros}
      />

      <Card className="rounded-sm bg-background py-0 shadow-card ring-0">
        <CardContent className="p-8 max-md:p-4">
          <DefinicaoPolosListagem
            filtros={filtrosAplicados}
            chaveResetSelecao={chaveResetSelecao}
            onVisualizarPolo={() => undefined}
            onAlterarEdicaoPolo={abrirModalAlterarEdicao}
            onAlterarTipoPolo={abrirModalAlterarTipoPolo}
          />
        </CardContent>
      </Card>

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
        estaSalvando={vincularEmMassaMutation.isPending}
        erro={modalEdicaoAberto ? vincularEmMassaMutation.error : undefined}
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
        estaSalvando={alterarTipoMutation.isPending}
        erro={modalTipoAberto ? alterarTipoMutation.error : undefined}
        onFechar={fecharModalAlterarTipoPolo}
        onAlterar={confirmarAlteracaoTipoPolo}
      />

      <Modal
        aberto={modalBloqueioTipoAberto}
        titulo="Não é possível alterar o tipo de polo"
        onOpenChange={setModalBloqueioTipoAberto}
        acoes={
          <Button type="button" onClick={fecharModalBloqueioTipo}>
            Fechar
          </Button>
        }
      >
        {MENSAGEM_BLOQUEIO_TIPO_SEM_EDICAO}
      </Modal>
    </>
  )
}
