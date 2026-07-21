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
}

export function MensagemSucessoAoCriarNovaEdicaoPrograma({
  visivel,
  onFechar,
}: Readonly<MensagemSucessoAoCriarNovaEdicaoProgramaProps>) {
  useEffect(() => {
    if (!visivel) return

    const temporizador = globalThis.setTimeout(onFechar, TEMPO_EXIBICAO_MS)
    return () => globalThis.clearTimeout(temporizador)
  }, [visivel, onFechar])

  if (!visivel) return null

  return (
    <ContainerMensagemSucesso aria-live="polite">
      <p>Edição do Programa cadastrado com sucesso!</p>
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
