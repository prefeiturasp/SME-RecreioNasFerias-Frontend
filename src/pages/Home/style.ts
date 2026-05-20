import styled from 'styled-components'

import backgroundHome from '../../assets/background-home.jpg'
import { media } from '../../styles/breakpoints'

export const Main = styled.main`
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;

  ${media.mobile} {
    flex-direction: column;
  }
`

export const SectionImage = styled.section`
  width: 60%;
  height: 100%;
  flex-shrink: 0;
  background-image: url(${backgroundHome});
  background-size: cover;
  background-position: 100% center;
  background-repeat: no-repeat;

  ${media.tablet} {
    width: 50%;
  }

  ${media.mobile} {
    width: 100%;
    height: auto;
    min-height: 12.5rem;
    max-height: 35vh;
    background-position: center center;
  }
`

export const SectionForm = styled.section`
  width: 40%;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1.5rem;
  overflow: hidden;

  ${media.tablet} {
    width: 50%;
    padding: 1.25rem;
  }

  ${media.mobile} {
    width: 100%;
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 1.5rem 1.25rem;
  }
`

export const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 2.5rem;

  p {
    font-size: 1.125rem;
    margin-bottom: 0.75rem;
  }

  img {
    width: 9.0625rem;
    height: 5.125rem;
    margin-bottom: 0.75rem;
    object-fit: contain;
  }

  h3 {
    font-size: 1.375rem;
    font-weight: var(--font-weight-semibold);
    text-align: center;
    line-height: 1.3;
  }

  ${media.mobile} {
    margin-bottom: 2rem;

    p {
      font-size: 1rem;
    }

    img {
      width: 7.5rem;
      height: auto;
      max-height: 4.25rem;
    }

    h3 {
      font-size: 1.25rem;
    }
  }
`

export const FormAcesso = styled.form`
  width: 100%;
  max-width: 22.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;

  ${media.mobile} {
    max-width: 100%;
    gap: 1.5rem;
  }
`

export const FormField = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  label {
    font-size: 1rem;
    font-weight: var(--font-weight-regular);
    margin-bottom: 0.5rem;
  }

  input {
    border: 1px solid var(--color-input-border);
    background-color: var(--color-background);
    padding: 0.625rem 0.9375rem;
    border-radius: 0.25rem;
    outline: none;
    transition: border-color 0.2s ease;

    &:focus-visible {
      border-color: var(--color-primary);
    }
  }
`

export const SubmitButton = styled.button`
  width: 100%;
  min-height: 2.8125rem;
  background-color: var(--color-primary);
  border-radius: 0.25rem;
  color: var(--color-background);
  font-size: 1rem;
  font-weight: var(--font-weight-bold);
  cursor: pointer;
`

export const ForgotPassword = styled.p`
  display: flex;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: var(--font-weight-medium);

  a {
    color: var(--color-primary);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`

export const PartnerLogo = styled.div`
  display: flex;
  justify-content: center;

  img {
    width: 11.0625rem;
    height: 4.3125rem;
    object-fit: contain;
  }

  ${media.mobile} {
    img {
      width: 9.375rem;
      height: auto;
      max-height: 3.75rem;
    }
  }
`
