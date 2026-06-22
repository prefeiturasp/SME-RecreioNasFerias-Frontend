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
  valor?: string
}

export function CampoDataFormulario({
  id,
  name,
  rotuloAcessivel,
  placeholder,
  valor,
}: Readonly<CampoDataFormularioProps>) {
  return (
    <CampoData>
      <input
        type="date"
        id={id}
        name={name}
        required
        aria-label={rotuloAcessivel}
        defaultValue={valor}
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
  valorCampoInicio?: string
  valorCampoFim?: string
}

export function GrupoPeriodoData({
  rotulo,
  idCampoInicio,
  nomeCampoInicio,
  rotuloAcessivelInicio,
  idCampoFim,
  nomeCampoFim,
  rotuloAcessivelFim,
  valorCampoInicio,
  valorCampoFim,
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
          valor={valorCampoInicio}
        />
        <CampoDataFormulario
          id={idCampoFim}
          name={nomeCampoFim}
          rotuloAcessivel={rotuloAcessivelFim}
          placeholder="Até"
          valor={valorCampoFim}
        />
      </GrupoCamposData>
    </CampoDataComRotulo>
  )
}
