import { Trash2 } from 'lucide-react'

type ItemAnexoProps = {
  nome: string
  onRemover: () => void
}

export function ItemAnexo({ nome, onRemover }: Readonly<ItemAnexoProps>) {
  return (
    <li className="inline-flex h-7 items-center gap-1.5 rounded-sm border border-gray-300 bg-background px-2 text-sm text-foreground">
      <span>{nome}</span>
      <button
        type="button"
        aria-label={`Remover ${nome}`}
        className="inline-flex text-destructive"
        onClick={onRemover}
      >
        <Trash2 className="size-3.5" aria-hidden="true" />
      </button>
    </li>
  )
}
