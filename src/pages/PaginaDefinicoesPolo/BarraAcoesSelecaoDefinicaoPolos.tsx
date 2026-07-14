import { iconeLapisEditar } from '../../assets'
import { CloseIcon } from '../../components/icons'
import {
  BarraAcoesSelecao,
  BotaoAcaoSelecao,
  ContagemSelecao,
  GrupoAcoesSelecao,
  SeparadorAcaoSelecao,
} from './barraAcoesSelecaoDefinicaoPolosStyles'

type BarraAcoesSelecaoDefinicaoPolosProps = {
  quantidadeSelecionada: number
  onAlterarEdicao: () => void
  onAlterarTipoPolo: () => void
  onCancelar: () => void
}

function formatarContagem(quantidade: number): string {
  if (quantidade === 1) {
    return '1 UE selecionada'
  }

  return `${quantidade} UEs selecionadas`
}

export function BarraAcoesSelecaoDefinicaoPolos({
  quantidadeSelecionada,
  onAlterarEdicao,
  onAlterarTipoPolo,
  onCancelar,
}: Readonly<BarraAcoesSelecaoDefinicaoPolosProps>) {
  return (
    <BarraAcoesSelecao aria-live="polite">
      <ContagemSelecao>{formatarContagem(quantidadeSelecionada)}</ContagemSelecao>

      <GrupoAcoesSelecao>
        <BotaoAcaoSelecao type="button" onClick={onAlterarEdicao}>
          <img src={iconeLapisEditar} alt="" aria-hidden="true" />
          {' '}
          Alterar Edição
        </BotaoAcaoSelecao>

        <SeparadorAcaoSelecao aria-hidden="true" />

        <BotaoAcaoSelecao type="button" onClick={onAlterarTipoPolo}>
          <img src={iconeLapisEditar} alt="" aria-hidden="true" />
          {' '}
          Alterar Tipo de Polo
        </BotaoAcaoSelecao>

        <SeparadorAcaoSelecao aria-hidden="true" />

        <BotaoAcaoSelecao type="button" onClick={onCancelar}>
          <CloseIcon />
          {' '}
          Cancelar
        </BotaoAcaoSelecao>
      </GrupoAcoesSelecao>
    </BarraAcoesSelecao>
  )
}
