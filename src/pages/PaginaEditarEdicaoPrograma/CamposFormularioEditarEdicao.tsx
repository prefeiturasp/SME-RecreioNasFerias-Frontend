import { CampoEntrada } from '@/components/ui/campo-entrada'
import {
  CampoFormulario,
  LinhaFormulario,
} from '@/components/shared/campo-formulario'
import { GrupoPeriodoData } from '@/components/shared/campo-periodo-data'
import type { EdicaoPrograma } from '../../services/edicaoPrograma/types'

type CampoNumericoDesabilitado = {
  id: string
  rotulo: string
  placeholder: string
  valor: number
}

type CamposFormularioEditarEdicaoProps = {
  edicao: EdicaoPrograma
  camposNumericos: readonly CampoNumericoDesabilitado[]
}

export function CamposFormularioEditarEdicao({
  edicao,
  camposNumericos,
}: Readonly<CamposFormularioEditarEdicaoProps>) {
  const campoExtra = camposNumericos[3]

  return (
    <>
      <LinhaFormulario>
        <CampoFormulario>
          <label htmlFor="NomeDaEdicao">Nome da Edição</label>
          <CampoEntrada
            type="text"
            name="NomeDaEdicao"
            id="NomeDaEdicao"
            placeholder="Digite o Nome da Edição"
            defaultValue={edicao.nome}
          />
        </CampoFormulario>
        <GrupoPeriodoData
          rotulo="Período da Edição"
          idCampoInicio="DataInicioEdicao"
          nomeCampoInicio="DataInicioEdicao"
          rotuloAcessivelInicio="Data de início da edição"
          idCampoFim="DataFimEdicao"
          nomeCampoFim="DataFimEdicao"
          rotuloAcessivelFim="Data de fim da edição"
          valorCampoInicio={edicao.dataInicioEdicao}
          valorCampoFim={edicao.dataFimEdicao}
        />
        <GrupoPeriodoData
          rotulo="Período das Inscrições"
          idCampoInicio="DataInicioInscricoes"
          nomeCampoInicio="DataInicioInscricoes"
          rotuloAcessivelInicio="Data de início das inscrições"
          idCampoFim="DataFimInscricoes"
          nomeCampoFim="DataFimInscricoes"
          rotuloAcessivelFim="Data de fim das inscrições"
          valorCampoInicio={edicao.dataInicioInscricoes}
          valorCampoFim={edicao.dataFimInscricoes}
        />
      </LinhaFormulario>

      <LinhaFormulario>
        {camposNumericos.slice(0, 3).map((campo) => (
          <CampoFormulario key={campo.id}>
            <label htmlFor={campo.id}>{campo.rotulo}</label>
            <CampoEntrada
              type="number"
              name={campo.id}
              id={campo.id}
              placeholder={campo.placeholder}
              readOnly
              value={campo.valor}
            />
          </CampoFormulario>
        ))}
      </LinhaFormulario>

      {campoExtra ? (
        <LinhaFormulario>
          <CampoFormulario>
            <label htmlFor={campoExtra.id}>{campoExtra.rotulo}</label>
            <CampoEntrada
              type="number"
              name={campoExtra.id}
              id={campoExtra.id}
              placeholder={campoExtra.placeholder}
              readOnly
              value={campoExtra.valor}
            />
          </CampoFormulario>
        </LinhaFormulario>
      ) : null}
    </>
  )
}
