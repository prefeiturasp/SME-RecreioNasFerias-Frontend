export {
  AreaConteudo,
  BotaoCadastrarNovaEdicao,
  BotaoVoltar,
  CabecalhoAreaInternaConteudo,
  ContainerPaginaEdicoesPrograma,
  ListagemEdicoesPrograma,
  RotuloBotaoVoltar,
  SecaoPrincipal,
} from '../shared/edicoesProgramaStyles'

import styled from 'styled-components'

export const MensagemSucessoAoCriarNovaEdicaoPrograma = styled.output`
  position: relative;
  min-height: 50px;
  margin-top: 12px;
  border: 1px solid #a4c7af;
  border-radius: 4px;
  background-color: #d4edda;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.75rem 2.5rem;

  > p {
    font-family: var(--font-family);
    font-weight: var(--font-weight-bold);
    font-size: var(--font-size-label);
    color: #155724;
    text-align: center;
  }
`

export const BotaoFecharMensagemSucesso = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  color: #155724;
  border-radius: var(--size-radius-sm);
  transition: background-color 0.2s ease;

  > svg {
    width: 1rem;
    height: 1rem;
  }

  &:hover {
    background-color: rgba(21, 87, 36, 0.1);
  }

  &:focus-visible {
    outline: 2px solid #155724;
    outline-offset: 2px;
  }
`
