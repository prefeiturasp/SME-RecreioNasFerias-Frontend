import { useEffect, useState } from 'react'

import { ChevronDownIcon, CloseIcon } from '../../components/icons'
import { OPCOES_TIPO_POLO_ALTERACAO_MOCK } from '../../services/definicaoPolo/mocks'
import {
  BotaoAlterarModalAlterarEdicao as BotaoAlterarModalAlterarTipoPolo,
  BotaoFecharModalAlterarEdicao as BotaoFecharModalAlterarTipoPolo,
  BotaoFecharRodapeModalAlterarEdicao as BotaoFecharRodapeModalAlterarTipoPolo,
  CabecalhoModalAlterarEdicao as CabecalhoModalAlterarTipoPolo,
  CampoModalAlterarEdicao as CampoModalAlterarTipoPolo,
  ConteudoModalAlterarEdicao as ConteudoModalAlterarTipoPolo,
  CorpoModalAlterarEdicao as CorpoModalAlterarTipoPolo,
  DescricaoModalAlterarEdicao as DescricaoModalAlterarTipoPolo,
  RodapeModalAlterarEdicao as RodapeModalAlterarTipoPolo,
  SeletorModalAlterarEdicao as SeletorModalAlterarTipoPolo,
  SobreposicaoModalAlterarEdicao as SobreposicaoModalAlterarTipoPolo,
  TituloModalAlterarEdicao as TituloModalAlterarTipoPolo,
} from './modalAlterarEdicaoDoPoloStyles'

type ModalAlterarTipoDePoloProps = {
  aberto: boolean
  estaSalvando?: boolean
  mensagemErro?: string | null
  onFechar: () => void
  onAlterar: (tipoPolo: string) => void
}

export function ModalAlterarTipoDePolo({
  aberto,
  estaSalvando = false,
  mensagemErro = null,
  onFechar,
  onAlterar,
}: Readonly<ModalAlterarTipoDePoloProps>) {
  const [tipoPolo, setTipoPolo] = useState('')

  useEffect(() => {
    if (!aberto) {
      setTipoPolo('')
      return
    }

    const fecharComEscape = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape' && !estaSalvando) {
        onFechar()
      }
    }

    globalThis.addEventListener('keydown', fecharComEscape)
    return () => globalThis.removeEventListener('keydown', fecharComEscape)
  }, [aberto, estaSalvando, onFechar])

  if (!aberto) return null

  return (
    <SobreposicaoModalAlterarTipoPolo
      onClick={() => {
        if (!estaSalvando) onFechar()
      }}
    >
      <ConteudoModalAlterarTipoPolo
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-alterar-tipo-de-polo"
        onClick={(evento) => evento.stopPropagation()}
      >
        <CabecalhoModalAlterarTipoPolo>
          <TituloModalAlterarTipoPolo id="titulo-alterar-tipo-de-polo">
            Alterar Tipo de Polo
          </TituloModalAlterarTipoPolo>
          <BotaoFecharModalAlterarTipoPolo
            type="button"
            aria-label="Fechar"
            disabled={estaSalvando}
            onClick={onFechar}
          >
            <CloseIcon />
          </BotaoFecharModalAlterarTipoPolo>
        </CabecalhoModalAlterarTipoPolo>

        <CorpoModalAlterarTipoPolo>
          <DescricaoModalAlterarTipoPolo>
            Selecione o Tipo de Polo que deseja vincular ao(s) Polo(s):
          </DescricaoModalAlterarTipoPolo>

          <CampoModalAlterarTipoPolo>
            <label htmlFor="modal-tipo-polo">Selecione o Tipo de Polo</label>
            <SeletorModalAlterarTipoPolo>
              <select
                id="modal-tipo-polo"
                value={tipoPolo}
                disabled={estaSalvando}
                onChange={(evento) => setTipoPolo(evento.target.value)}
              >
                <option value="">Selecione o Tipo de Polo</option>
                {OPCOES_TIPO_POLO_ALTERACAO_MOCK.map((opcao) => (
                  <option key={opcao.valor} value={opcao.valor}>
                    {opcao.rotulo}
                  </option>
                ))}
              </select>
              <ChevronDownIcon />
            </SeletorModalAlterarTipoPolo>
          </CampoModalAlterarTipoPolo>

          {mensagemErro ? (
            <DescricaoModalAlterarTipoPolo role="alert">
              {mensagemErro}
            </DescricaoModalAlterarTipoPolo>
          ) : null}
        </CorpoModalAlterarTipoPolo>

        <RodapeModalAlterarTipoPolo>
          <BotaoFecharRodapeModalAlterarTipoPolo
            type="button"
            disabled={estaSalvando}
            onClick={onFechar}
          >
            Fechar
          </BotaoFecharRodapeModalAlterarTipoPolo>
          <BotaoAlterarModalAlterarTipoPolo
            type="button"
            disabled={!tipoPolo || estaSalvando}
            onClick={() => onAlterar(tipoPolo)}
          >
            {estaSalvando ? 'Alterando...' : 'Alterar'}
          </BotaoAlterarModalAlterarTipoPolo>
        </RodapeModalAlterarTipoPolo>
      </ConteudoModalAlterarTipoPolo>
    </SobreposicaoModalAlterarTipoPolo>
  )
}
