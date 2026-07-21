import {
  ContainerIndicadorCarregamento,
  SpinnerIndicadorCarregamento,
} from './style'

type IndicadorCarregamentoProps = {
  mensagem?: string
}

export function IndicadorCarregamento({
  mensagem = 'Carregando...',
}: Readonly<IndicadorCarregamentoProps>) {
  return (
    <ContainerIndicadorCarregamento aria-live="polite">
      <SpinnerIndicadorCarregamento aria-hidden="true" />
      <span>{mensagem}</span>
    </ContainerIndicadorCarregamento>
  )
}
