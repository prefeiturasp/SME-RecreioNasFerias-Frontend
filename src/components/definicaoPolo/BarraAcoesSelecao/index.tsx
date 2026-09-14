import { iconeLapisEditar } from '@/assets'
import { CloseIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'

type BarraAcoesSelecaoProps = {
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

export function BarraAcoesSelecao({
  quantidadeSelecionada,
  onAlterarEdicao,
  onAlterarTipoPolo,
  onCancelar,
}: Readonly<BarraAcoesSelecaoProps>) {
  return (
    <div
      aria-live="polite"
      className="flex min-h-12 flex-wrap items-center justify-between gap-3 border border-brand-dark bg-brand-dark px-4 py-2"
    >
      <p className="text-sm font-bold text-background">
        {formatarContagem(quantidadeSelecionada)}
      </p>

      <div className="flex flex-wrap items-center">
        <Button
          type="button"
          variant="ghost"
          className="h-auto gap-2 rounded-sm px-0 py-1 text-sm font-bold whitespace-nowrap text-background hover:bg-transparent hover:text-background hover:opacity-85 focus-visible:border-background focus-visible:ring-background/50"
          onClick={onAlterarEdicao}
        >
          <img
            src={iconeLapisEditar}
            alt=""
            aria-hidden="true"
            className="size-4 object-contain brightness-0 invert"
          />
          <span>Alterar Edição</span>
        </Button>

        <span
          aria-hidden="true"
          className="mx-3 h-5 w-px bg-background/45"
        />

        <Button
          type="button"
          variant="ghost"
          className="h-auto gap-2 rounded-sm px-0 py-1 text-sm font-bold whitespace-nowrap text-background hover:bg-transparent hover:text-background hover:opacity-85 focus-visible:border-background focus-visible:ring-background/50"
          onClick={onAlterarTipoPolo}
        >
          <img
            src={iconeLapisEditar}
            alt=""
            aria-hidden="true"
            className="size-4 object-contain brightness-0 invert"
          />
          <span>Alterar Tipo de Polo</span>
        </Button>

        <span
          aria-hidden="true"
          className="mx-3 h-5 w-px bg-background/45"
        />

        <Button
          type="button"
          variant="ghost"
          className="h-auto gap-2 rounded-sm px-0 py-1 text-sm font-bold whitespace-nowrap text-background hover:bg-transparent hover:text-background hover:opacity-85 focus-visible:border-background focus-visible:ring-background/50"
          onClick={onCancelar}
        >
          <CloseIcon />
          <span>Cancelar</span>
        </Button>
      </div>
    </div>
  )
}
