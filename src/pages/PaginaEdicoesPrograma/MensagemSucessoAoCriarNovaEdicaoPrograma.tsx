import { useEffect } from 'react'
import { CloseIcon } from '../../components/icons'
import {
  BotaoFecharMensagemSucesso,
  MensagemSucessoAoCriarNovaEdicaoPrograma as ContainerMensagemSucesso,
} from './style'

const TEMPO_EXIBICAO_MS = 3000

type MensagemSucessoAoCriarNovaEdicaoProgramaProps = {
  visivel: boolean
  onFechar: () => void
  mensagem?: string
}

export function MensagemSucessoAoCriarNovaEdicaoPrograma({
  visivel,
  onFechar,
  mensagem = 'Edição do Programa cadastrado com sucesso!',
}: Readonly<MensagemSucessoAoCriarNovaEdicaoProgramaProps>) {
  useEffect(() => {
    if (!visivel) return

    const temporizador = globalThis.setTimeout(onFechar, TEMPO_EXIBICAO_MS)
    return () => globalThis.clearTimeout(temporizador)
  }, [visivel, onFechar])

  if (!visivel) return null

  return (
    <ContainerMensagemSucesso aria-live="polite">
      <p>{mensagem}</p>
      <BotaoFecharMensagemSucesso
        type="button"
        aria-label="Fechar mensagem de sucesso"
        onClick={onFechar}
      >
        <CloseIcon />
      </BotaoFecharMensagemSucesso>
    </ContainerMensagemSucesso>
  )
}
