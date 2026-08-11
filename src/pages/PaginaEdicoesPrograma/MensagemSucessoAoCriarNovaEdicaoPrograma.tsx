import { useEffect } from 'react'

import { MensagemAlerta } from '@/components/shared/mensagem-alerta'

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
    <MensagemAlerta variante="sucesso" onFechar={onFechar}>
      Edição do Programa cadastrado com sucesso!
    </MensagemAlerta>
  )
}
