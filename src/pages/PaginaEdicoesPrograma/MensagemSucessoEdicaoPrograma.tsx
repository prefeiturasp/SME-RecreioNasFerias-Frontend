import { useEffect } from 'react'
import { CloseIcon } from '@/components/icons'
import {
  BotaoFecharMensagemSucesso,
  MensagemSucessoEdicaoPrograma as ContainerMensagemSucesso,
} from './style'

const TEMPO_EXIBICAO_MS = 3000

type MensagemSucessoEdicaoProgramaProps = {
  visivel: boolean
  onFechar: () => void
  mensagem?: string
}

export function MensagemSucessoEdicaoPrograma({
  visivel,
  onFechar,
  mensagem = 'Edição do Programa cadastrado com sucesso!',
}: Readonly<MensagemSucessoEdicaoProgramaProps>) {
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
