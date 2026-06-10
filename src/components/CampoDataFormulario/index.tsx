import { IconeCalendario } from '../icons'
import {
  CampoData,
  CampoDataComRotulo,
  GrupoCamposData,
  IconeCalendarioData,
  PlaceholderData,
} from './style'

type CampoDataFormularioProps = {
  id: string
  name: string
  rotuloAcessivel: string
  placeholder: 'De' | 'Até'
}

export function CampoDataFormulario({
  id,
  name,
  rotuloAcessivel,
  placeholder,
}: Readonly<CampoDataFormularioProps>) {
  return (
    <CampoData>
      <input
        type="date"
        id={id}
        name={name}
        required
        aria-label={rotuloAcessivel}
      />
      <PlaceholderData aria-hidden="true">{placeholder}</PlaceholderData>
      <IconeCalendarioData aria-hidden="true">
        <IconeCalendario />
      </IconeCalendarioData>
    </CampoData>
  )
}

type GrupoPeriodoDataProps = {
  rotulo: string
  idCampoInicio: string
  nomeCampoInicio: string
  rotuloAcessivelInicio: string
  idCampoFim: string
  nomeCampoFim: string
  rotuloAcessivelFim: string
}

export function GrupoPeriodoData({
  rotulo,
  idCampoInicio,
  nomeCampoInicio,
  rotuloAcessivelInicio,
  idCampoFim,
  nomeCampoFim,
  rotuloAcessivelFim,
}: Readonly<GrupoPeriodoDataProps>) {
  return (
    <CampoDataComRotulo>
      <label htmlFor={idCampoInicio}>{rotulo}</label>
      <GrupoCamposData>
        <CampoDataFormulario
          id={idCampoInicio}
          name={nomeCampoInicio}
          rotuloAcessivel={rotuloAcessivelInicio}
          placeholder="De"
        />
        <CampoDataFormulario
          id={idCampoFim}
          name={nomeCampoFim}
          rotuloAcessivel={rotuloAcessivelFim}
          placeholder="Até"
        />
      </GrupoCamposData>
    </CampoDataComRotulo>
  )
}
