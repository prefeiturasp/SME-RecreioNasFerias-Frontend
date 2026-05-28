import { useState, type SubmitEvent } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  attemptLogin,
  LoginAccessDeniedError,
  LoginFailedError,
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

function getFormFieldValue(formData: FormData, fieldName: string): string {
  const value = formData.get(fieldName)
  return typeof value === 'string' ? value : ''
}

export default function Home() {
  const navigate = useNavigate()
  const [accessDeniedUserName, setAccessDeniedUserName] = useState<
    string | null
  >(null)
  const [loginErrorMessage, setLoginErrorMessage] = useState<string | null>(
    null,
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  function clearFormFeedback() {
    setAccessDeniedUserName(null)
    setLoginErrorMessage(null)
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    void submitLogin(event.currentTarget)
  }

  async function submitLogin(form: HTMLFormElement) {
    setAccessDeniedUserName(null)
    setLoginErrorMessage(null)

    const formData = new FormData(form)
    const usuario = getFormFieldValue(formData, 'usuario').trim()
    const senha = getFormFieldValue(formData, 'senha')

    setIsSubmitting(true)

    try {
      await attemptLogin({ usuario, senha })
      navigate('/main')
    } catch (error) {
      if (error instanceof LoginAccessDeniedError) {
        setAccessDeniedUserName(error.userName)
        setLoginErrorMessage(null)
      } else if (error instanceof LoginFailedError) {
        setLoginErrorMessage(error.userMessage)
        setAccessDeniedUserName(null)
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
              onChange={clearFormFeedback}
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
              onChange={clearFormFeedback}
            />
          </FormField>

          <SubmitButton type="submit" disabled={isSubmitting}>
            Acessar
          </SubmitButton>

          {(accessDeniedUserName || loginErrorMessage) && (
            <MessageError role="alert">
              <p>
                {accessDeniedUserName
                  ? buildAccessDeniedMessage(accessDeniedUserName)
                  : loginErrorMessage}
              </p>
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
