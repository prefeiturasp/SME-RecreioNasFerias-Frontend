import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CampoDataFormulario, GrupoPeriodoData } from './index'

describe('CampoDataFormulario', () => {
  it('renderiza campo de data com placeholder', () => {
    render(
      <CampoDataFormulario
        id="data-inicio"
        name="dataInicio"
        rotuloAcessivel="Data de início"
        placeholder="De"
      />,
    )

    expect(screen.getByLabelText(/data de início/i)).toBeInTheDocument()
    expect(screen.getByText('De')).toBeInTheDocument()
  })

  it('renderiza grupo de período com dois campos', () => {
    render(
      <GrupoPeriodoData
        rotulo="Período da Edição"
        idCampoInicio="data-inicio"
        nomeCampoInicio="dataInicio"
        rotuloAcessivelInicio="Data de início da edição"
        idCampoFim="data-fim"
        nomeCampoFim="dataFim"
        rotuloAcessivelFim="Data de fim da edição"
      />,
    )

    expect(screen.getByText('Período da Edição')).toBeInTheDocument()
    expect(
      screen.getByLabelText(/data de início da edição/i),
    ).toBeInTheDocument()
    expect(screen.getByLabelText(/data de fim da edição/i)).toBeInTheDocument()
  })
})
