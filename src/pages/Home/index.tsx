import {
  ForgotPassword,
  FormAcesso,
  FormField,
  LogoContainer,
  Main,
  PartnerLogo,
  SectionForm,
  SectionImage,
  SubmitButton,
} from './style'

import logoImg from '../../assets/logo-recreio.png'
import logoSMEImg from '../../assets/logo-sme.png'

export default function Home() {
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

        <FormAcesso>
          <FormField>
            <label htmlFor="usuario">Usuário</label>
            <input
              type="text"
              id="usuario"
              name="usuario"
              autoComplete="username"
            />
          </FormField>

          <FormField>
            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              id="senha"
              name="senha"
              autoComplete="current-password"
            />
          </FormField>

          <SubmitButton type="submit">Acessar</SubmitButton>

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
