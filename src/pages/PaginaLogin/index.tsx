import { useState, type SubmitEvent } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  ErroAcessoNegadoLogin,
  ErroFalhaLogin,
  tentarLogin,
} from './tentarLogin'
import { construirMensagemAcessoNegado } from './messages'
import {
  ForgotPassword,
  FormAcesso,
  FormField,
  LogoContainer,
  ContainerPaginaLogin,
  MessageError,
  PartnerLogo,
  SectionForm,
  SectionImage,
  SubmitButton,
} from './style'

import logoImg from '../../assets/logo-recreio.png'
import logoSMEImg from '../../assets/logo-sme.png'

function obterValorCampoFormulario(
  formData: FormData,
  nomeCampo: string,
): string {
  const value = formData.get(nomeCampo)
  return typeof value === 'string' ? value : ''
}

export default function PaginaLogin() {
  const navigate = useNavigate()
  const [nomeUsuarioAcessoNegado, setNomeUsuarioAcessoNegado] = useState<
    string | null
  >(null)
  const [mensagemErroLogin, setMensagemErroLogin] = useState<string | null>(
    null,
  )
  const [estaEnviando, setEstaEnviando] = useState(false)

  function limparFeedbackFormulario() {
    setNomeUsuarioAcessoNegado(null)
    setMensagemErroLogin(null)
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    void submeterLogin(event.currentTarget)
  }

  async function submeterLogin(form: HTMLFormElement) {
    setNomeUsuarioAcessoNegado(null)
    setMensagemErroLogin(null)

    const formData = new FormData(form)
    const usuario = obterValorCampoFormulario(formData, 'usuario').trim()
    const senha = obterValorCampoFormulario(formData, 'senha')

    setEstaEnviando(true)

    try {
      await tentarLogin({ usuario, senha })
      navigate('/inicio')
    } catch (error) {
      if (error instanceof ErroAcessoNegadoLogin) {
        setNomeUsuarioAcessoNegado(error.nomeUsuario)
        setMensagemErroLogin(null)
      } else if (error instanceof ErroFalhaLogin) {
        setMensagemErroLogin(error.mensagemUsuario)
        setNomeUsuarioAcessoNegado(null)
      }
    } finally {
      setEstaEnviando(false)
    }
  }

  return (
    <ContainerPaginaLogin>
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
              disabled={estaEnviando}
              onChange={limparFeedbackFormulario}
            />
          </FormField>

          <FormField>
            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              id="senha"
              name="senha"
              autoComplete="current-password"
              disabled={estaEnviando}
              onChange={limparFeedbackFormulario}
            />
          </FormField>

          <SubmitButton type="submit" disabled={estaEnviando}>
            Acessar
          </SubmitButton>

          {(nomeUsuarioAcessoNegado || mensagemErroLogin) && (
            <MessageError role="alert">
              <p>
                {nomeUsuarioAcessoNegado
                  ? construirMensagemAcessoNegado(nomeUsuarioAcessoNegado)
                  : mensagemErroLogin}
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
    </ContainerPaginaLogin>
  )
}
