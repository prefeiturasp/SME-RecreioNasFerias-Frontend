import { useEffect } from 'react'
import {
  AcoesModalConfirmacao,
  BotaoCancelarModalConfirmacao,
  BotaoConfirmarModalConfirmacao,
  ConteudoModalConfirmacao,
  MensagemModalConfirmacao,
  SobreposicaoModalConfirmacao,
  TituloModalConfirmacao,
} from './modalConfirmacaoSalvarPoloParceiroStyles'

type ModalConfirmacaoSalvarPoloParceiroProps = {
  aberto: boolean
  onConfirmar: () => void
  onCancelar: () => void
}

export function ModalConfirmacaoSalvarPoloParceiro({
  aberto,
  onConfirmar,
  onCancelar,
}: Readonly<ModalConfirmacaoSalvarPoloParceiroProps>) {
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
        aria-labelledby="titulo-confirmacao-salvar-polo-parceiro"
        onClick={(evento) => evento.stopPropagation()}
      >
        <TituloModalConfirmacao id="titulo-confirmacao-salvar-polo-parceiro">
          Salvar alterações
        </TituloModalConfirmacao>
        <MensagemModalConfirmacao>
          Deseja salvar as alterações realizadas no polo parceiro?
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
