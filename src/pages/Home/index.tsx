import { type FormEvent, useState } from 'react'

import {
  attemptLogin,
  LoginAccessDeniedError,
} from './attemptLogin'
import { buildAccessDeniedMessage } from './messages'
import {
  ForgotPassword,
  FormAcesso,
  FormField,
  LogoContainer,
  Main,
  MessageError,
  PartnerLogo,
  SectionForm,
  SectionImage,
  SubmitButton,
} from './style'

import logoImg from '../../assets/logo-recreio.png'
import logoSMEImg from '../../assets/logo-sme.png'

export default function Home() {
  const [accessDeniedUserName, setAccessDeniedUserName] = useState<
    string | null
  >(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function clearAccessError() {
    setAccessDeniedUserName(null)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setAccessDeniedUserName(null)

    const formData = new FormData(event.currentTarget)
    const usuario = String(formData.get('usuario') ?? '').trim()
    const senha = String(formData.get('senha') ?? '')

    setIsSubmitting(true)

    try {
      await attemptLogin({ usuario, senha })
    } catch (error) {
      if (error instanceof LoginAccessDeniedError) {
        setAccessDeniedUserName(error.userName)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Main>
      <SectionImage aria-hidden />
      <SectionForm>
        <LogoContainer>
          <p>Bem-vindo(a) ao</p>
          <img src={logoImg} alt="Recreio nas Férias" />
          <h3>
            Sistema de Gestão
            <br />
            do Recreio nas Férias
          </h3>
        </LogoContainer>

        <FormAcesso onSubmit={handleSubmit}>
          <FormField>
            <label htmlFor="usuario">Usuário</label>
            <input
              type="text"
              id="usuario"
              name="usuario"
              autoComplete="username"
              disabled={isSubmitting}
              onChange={clearAccessError}
            />
          </FormField>

          <FormField>
            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              id="senha"
              name="senha"
              autoComplete="current-password"
              disabled={isSubmitting}
              onChange={clearAccessError}
            />
          </FormField>

          <SubmitButton type="submit" disabled={isSubmitting}>
            Acessar
          </SubmitButton>

          {accessDeniedUserName && (
            <MessageError role="alert">
              <p>{buildAccessDeniedMessage(accessDeniedUserName)}</p>
            </MessageError>
          )}

          <ForgotPassword>
            <a href="#recuperar-senha">Esqueci minha senha</a>
          </ForgotPassword>

          <PartnerLogo>
            <img
              src={logoSMEImg}
              alt="Prefeitura de São Paulo - Secretaria Municipal de Educação"
            />
          </PartnerLogo>
        </FormAcesso>
      </SectionForm>
    </Main>
  )
}
