import styled from 'styled-components'

export const TituloListagem = styled.p`
  margin-bottom: 1rem;
  font-family: var(--font-family);
  font-size: var(--font-size-label);
  font-weight: var(--font-weight-semibold);
  color: var(--color-brand-dark);
`

export const MensagemListagemVazia = styled.p`
  font-family: var(--font-family);
  font-weight: var(--font-weight-regular);
  font-size: var(--font-size-label);
  text-align: center;
  color: var(--color-text);
`

export const ContainerTabelaListagem = styled.div`
  width: 100%;
  overflow-x: auto;
`

export const TabelaListagem = styled.table`
  width: 100%;
  min-width: 56rem;
  border-collapse: collapse;
  background-color: var(--color-background);
`

export const CabecalhoTabelaListagem = styled.thead`
  background-color: #f1f3f5;

  th {
    padding: 0.75rem 1rem;
    border: 1px solid #e1e1e1;
    font-family: var(--font-family);
    font-size: var(--font-size-label);
    font-weight: var(--font-weight-bold);
    color: var(--color-text);
    text-align: left;
    white-space: nowrap;
  }
`

export const BotaoOrdenarColuna = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font: inherit;
  font-weight: inherit;
  color: inherit;

  > svg {
    width: 0.625rem;
    height: 0.75rem;
    color: #929394;
    flex-shrink: 0;
  }

  &:hover > svg {
    color: var(--color-text);
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
    border-radius: 2px;
  }
`

export const CorpoTabelaListagem = styled.tbody`
  td {
    padding: 0.75rem 1rem;
    border: 1px solid #e1e1e1;
    font-family: var(--font-family);
    font-size: var(--font-size-label);
    font-weight: var(--font-weight-regular);
    color: var(--color-text);
    vertical-align: middle;
  }
`

export const CelulaCheckboxListagem = styled.td`
  width: 3rem;
  text-align: center;
`

export const CabecalhoCheckboxListagem = styled.th`
  width: 3rem;
  text-align: center;
`

export const CheckboxListagem = styled.input.attrs({ type: 'checkbox' })`
  width: 1rem;
  height: 1rem;
  cursor: pointer;
  accent-color: var(--color-brand-dark);
`

export const CelulaAcoesListagem = styled.td`
  text-align: center;
  white-space: nowrap;
`

export const GrupoAcoesListagem = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`

export const ContainerPaginacaoListagem = styled.nav`
  margin-top: 1.5rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`

export const GrupoControlesPaginacao = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
`

export const ListaPaginas = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.375rem;
`

const estilosBotaoPaginaBase = `
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
  height: 2rem;
  padding: 0 0.375rem;
  border-radius: 0.25rem;
  font-family: var(--font-family);
  font-size: var(--font-size-label);
  font-weight: var(--font-weight-regular);
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
`

export const BotaoNavegacaoPagina = styled.button`
  ${estilosBotaoPaginaBase}
  width: 2rem;
  padding: 0;
  border: 1px solid #e1e1e1;
  background-color: var(--color-background);
  color: var(--color-brand-dark);

  &:hover:not(:disabled) {
    background-color: var(--color-button-outline-hover-bg);
    border-color: var(--color-brand-dark);
  }

  &:disabled {
    color: var(--color-placeholder);
    cursor: not-allowed;
    opacity: 0.6;
  }
`

export const BotaoPaginaNumerica = styled.button<{ $ativa?: boolean }>`
  ${estilosBotaoPaginaBase}
  border: 1px solid ${({ $ativa }) =>
    $ativa ? 'var(--color-brand-dark)' : '#e1e1e1'};
  background-color: ${({ $ativa }) =>
    $ativa ? 'var(--color-brand-dark)' : 'var(--color-background)'};
  color: ${({ $ativa }) =>
    $ativa ? 'var(--color-background)' : 'var(--color-text)'};
  font-weight: ${({ $ativa }) =>
    $ativa ? 'var(--font-weight-bold)' : 'var(--font-weight-regular)'};

  &:hover:not(:disabled) {
    background-color: ${({ $ativa }) =>
      $ativa
        ? 'var(--color-brand-dark-hover)'
        : 'var(--color-button-outline-hover-bg)'};
    border-color: var(--color-brand-dark);
  }
`

export const IndicadorReticenciasPagina = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
  height: 2rem;
  font-family: var(--font-family);
  font-size: var(--font-size-label);
  color: var(--color-text);
`

export const SeletorItensPorPagina = styled.label`
  position: relative;
  display: inline-flex;
  align-items: center;

  > select {
    appearance: none;
    min-width: 4.5rem;
    height: 2rem;
    border: 1px solid #e1e1e1;
    border-radius: 0.25rem;
    background-color: var(--color-background);
    padding: 0 1.75rem 0 0.75rem;
    font-family: var(--font-family);
    font-size: var(--font-size-label);
    font-weight: var(--font-weight-regular);
    color: var(--color-text);
    cursor: pointer;

    &:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }
  }

  > svg {
    position: absolute;
    right: 0.5rem;
    pointer-events: none;
    color: var(--color-text);
  }
`

export const RotuloAcessivelSeletorItensPorPagina = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`

export const BotaoAcaoListagem = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  color: var(--color-brand-dark);
  border-radius: var(--size-radius-sm);
  transition: background-color 0.2s ease;

  > img {
    width: 1.25rem;
    height: 1.25rem;
    object-fit: contain;
  }

  &:hover {
    background-color: rgba(29, 10, 85, 0.08);
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
`
