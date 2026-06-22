import styled from 'styled-components'
import {
  BotaoCancelarFormulario,
  BotaoSalvarFormulario,
} from '../shared/edicoesProgramaStyles'

export const SobreposicaoModalConfirmacao = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.45);
`

export const ConteudoModalConfirmacao = styled.div`
  width: min(100%, 28rem);
  padding: 1.5rem;
  border-radius: var(--size-radius-sm);
  background-color: var(--color-background);
  box-shadow: var(--shadow-card);
`

export const TituloModalConfirmacao = styled.h4`
  margin-bottom: 0.75rem;
  font-family: var(--font-family);
  font-size: var(--font-size-section-title);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
  line-height: 1.3;
`

export const MensagemModalConfirmacao = styled.p`
  margin-bottom: 1.5rem;
  font-family: var(--font-family);
  font-size: var(--font-size-label);
  font-weight: var(--font-weight-regular);
  color: var(--color-text);
  line-height: 1.5;
`

export const AcoesModalConfirmacao = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.5rem;

  @media (max-width: 48rem) {
    flex-direction: column-reverse;
    align-items: stretch;

    > button {
      width: 100%;
    }
  }
`

export const BotaoCancelarModalConfirmacao = styled(BotaoCancelarFormulario)``

export const BotaoConfirmarModalConfirmacao = styled(BotaoSalvarFormulario)``
