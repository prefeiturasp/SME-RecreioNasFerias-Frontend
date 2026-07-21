import { useEffect } from 'react'
import {
  AcoesModalConfirmacao,
  BotaoCancelarModalConfirmacao,
  BotaoConfirmarModalConfirmacao,
  ConteudoModalConfirmacao,
  MensagemModalConfirmacao,
  SobreposicaoModalConfirmacao,
  TituloModalConfirmacao,
} from './modalConfirmacaoSalvarEdicaoProgramaStyles'

type ModalConfirmacaoSalvarEdicaoProgramaProps = {
  aberto: boolean
  onConfirmar: () => void
  onCancelar: () => void
}

export function ModalConfirmacaoSalvarEdicaoPrograma({
  aberto,
  onConfirmar,
  onCancelar,
}: Readonly<ModalConfirmacaoSalvarEdicaoProgramaProps>) {
  useEffect(() => {
    if (!aberto) return

    const fecharComEscape = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') {
        onCancelar()
      }
    }

    globalThis.addEventListener('keydown', fecharComEscape)
    return () => globalThis.removeEventListener('keydown', fecharComEscape)
  }, [aberto, onCancelar])

  if (!aberto) return null

  return (
    <SobreposicaoModalConfirmacao onClick={onCancelar}>
      <ConteudoModalConfirmacao
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-confirmacao-salvar-edicao"
        onClick={(evento) => evento.stopPropagation()}
      >
        <TituloModalConfirmacao id="titulo-confirmacao-salvar-edicao">
          Salvar alterações
        </TituloModalConfirmacao>
        <MensagemModalConfirmacao>
          Deseja salvar as alterações realizadas na edição do programa?
        </MensagemModalConfirmacao>
        <AcoesModalConfirmacao>
          <BotaoCancelarModalConfirmacao type="button" onClick={onCancelar}>
            Cancelar
          </BotaoCancelarModalConfirmacao>
          <BotaoConfirmarModalConfirmacao type="button" onClick={onConfirmar}>
            Salvar
          </BotaoConfirmarModalConfirmacao>
        </AcoesModalConfirmacao>
      </ConteudoModalConfirmacao>
    </SobreposicaoModalConfirmacao>
  )
}
