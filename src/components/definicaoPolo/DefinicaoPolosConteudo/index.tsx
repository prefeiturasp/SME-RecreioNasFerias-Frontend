import { DefinicaoPolosListagem } from '@/components/definicaoPolo/DefinicaoPolosListagem'
import { FiltrosDefinicaoPolosForm } from '@/components/definicaoPolo/FiltrosDefinicaoPolosForm'
import { ModalAlterarSelecao } from '@/components/definicaoPolo/ModalAlterarSelecao'
import { CloseIcon } from '@/components/icons'
import { Alert, AlertAction, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useGetEdicoesPrograma } from '@/hooks/useGetEdicoesPrograma'
import { usePostAlterarTipoEmMassa } from '@/hooks/usePostAlterarTipoEmMassa'
import { usePostVincularEmMassa } from '@/hooks/usePostVincularEmMassa'
import { cn } from '@/lib/utils'
import {
  FILTROS_LISTAGEM_DEFINICAO_POLOS_INICIAIS,
  OPCOES_TIPO_POLO,
  type FiltrosListagemDefinicaoPolos,
  type PoloParaAlterarTipo,
} from '@/services/definicaoPolo/types'
import { useEffect, useState } from 'react'

const MENSAGEM_POLO_ALTERADO = 'Polo alterado com sucesso!'
const TEMPO_EXIBICAO_SUCESSO_MS = 3000

type ResultadoOperacao = {
  mensagem: string
  tipo: 'sucesso' | 'aviso'
}

export function DefinicaoPolosConteudo() {
  const vincularEmMassaMutation = usePostVincularEmMassa()
  const alterarTipoMutation = usePostAlterarTipoEmMassa()

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
  const [resultadoOperacao, setResultadoOperacao] =
    useState<ResultadoOperacao | null>(null)
  const [chaveResetSelecao, setChaveResetSelecao] = useState(0)

  function fecharMensagemResultado() {
    setResultadoOperacao(null)
  }

  useEffect(() => {
    if (!resultadoOperacao) return

    const temporizador = globalThis.setTimeout(() => {
      setResultadoOperacao(null)
    }, TEMPO_EXIBICAO_SUCESSO_MS)

    return () => globalThis.clearTimeout(temporizador)
  }, [resultadoOperacao])

  const modalTipoAberto = polosParaAlterarTipoPolo.length > 0
  const edicoesQuery = useGetEdicoesPrograma(modalEdicaoAberto)

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

  function abrirModalAlterarTipoPolo(polos: PoloParaAlterarTipo[]) {
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
          setResultadoOperacao({
            mensagem: MENSAGEM_POLO_ALTERADO,
            tipo: 'sucesso',
          })
        },
      },
    )
  }

  function confirmarAlteracaoTipoPolo(tipoPolo: string) {
    if (!tipoPolo.trim()) return

    const operacoes = polosParaAlterarTipoPolo.map((polo) => ({
      polo_uuid: polo.polo_uuid,
      edicao: polo.edicao_uuid,
      tipo: tipoPolo.trim(),
    }))

    if (operacoes.length === 0) return

    alterarTipoMutation.mutate(operacoes, {
      onSuccess: (resultado) => {
        setPolosParaAlterarTipoPolo([])
        setChaveResetSelecao((chaveAtual) => chaveAtual + 1)
        setResultadoOperacao({
          mensagem: resultado.mensagem,
          tipo: resultado.ignorados.length > 0 ? 'aviso' : 'sucesso',
        })
      },
    })
  }

  return (
    <>
      {resultadoOperacao ? (
        <Alert
          role="status"
          className={cn(
            'mt-3 min-h-12 items-center py-3 text-center font-bold',
            resultadoOperacao.tipo === 'aviso'
              ? 'border-yellow-400 bg-yellow-50 text-yellow-800'
              : 'border-verde-medio bg-verde-claro text-verde-escuro',
          )}
        >
          <AlertDescription
            className={
              resultadoOperacao.tipo === 'aviso'
                ? 'text-yellow-800'
                : 'text-verde-escuro'
            }
          >
            {resultadoOperacao.mensagem}
          </AlertDescription>
          <AlertAction>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Fechar mensagem de resultado"
              className={
                resultadoOperacao.tipo === 'aviso'
                  ? 'text-yellow-800 hover:bg-yellow-800/10 hover:text-yellow-800'
                  : 'text-verde-escuro hover:bg-verde-escuro/10 hover:text-verde-escuro'
              }
              onClick={fecharMensagemResultado}
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

      <Card className="overflow-visible rounded-sm bg-background py-0 shadow-card ring-0">
        <CardContent className="p-8 max-md:p-4">
          <DefinicaoPolosListagem
            filtros={filtrosAplicados}
            chaveResetSelecao={chaveResetSelecao}
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
        opcoes={edicoesQuery.data ?? []}
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
        opcoes={OPCOES_TIPO_POLO}
        estaSalvando={alterarTipoMutation.isPending}
        erro={modalTipoAberto ? alterarTipoMutation.error : undefined}
        onFechar={fecharModalAlterarTipoPolo}
        onAlterar={confirmarAlteracaoTipoPolo}
      />
    </>
  )
}
