import styled from 'styled-components'

export const CardModulo = styled.button`
  width: 262px;
  height: 141px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  border: 1px solid var(--color-user-card-border);
  border-radius: 4px;
  background-color: #ffffff;
  color: var(--color-primary);
  box-shadow: inset 0 -5px 0 0 var(--color-primary);

  > img {
    width: 45px;
    height: 45px;
    object-fit: contain;
  }

  > span {
    font-family: var(--font-family);
    font-size: 14px;
    font-weight: var(--font-weight-regular);
    color: #595959;
  }
`
