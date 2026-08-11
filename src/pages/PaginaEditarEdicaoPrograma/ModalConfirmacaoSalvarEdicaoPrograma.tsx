import { useEffect } from 'react'

import { Botao } from '@/components/shared/botao'
import { cn } from '@/lib/utils'

type ModalConfirmacaoSalvarEdicaoProgramaProps = {
  aberto: boolean
  onConfirmar: () => void
  onCancelar: () => void
}

export function ModalConfirmacaoSalvarEdicaoPrograma({
  aberto,
  onConfirmar,
  onCancelar,
}: Readonly<ModalConfirmacaoSalvarEdicaoProgramaProps>) {
  useEffect(() => {
    if (!aberto) return

    const fecharComEscape = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') {
        onCancelar()
      }
    }

    globalThis.addEventListener('keydown', fecharComEscape)
    return () => globalThis.removeEventListener('keydown', fecharComEscape)
  }, [aberto, onCancelar])

  if (!aberto) return null

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Fechar diálogo"
        className="absolute inset-0 cursor-default border-0 bg-[rgba(0,0,0,0.45)] p-0"
        onClick={onCancelar}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-confirmacao-salvar-edicao"
        className="relative z-10 w-full max-w-[28rem] rounded-[var(--size-radius-sm)] bg-[var(--color-background)] p-6 shadow-[var(--shadow-card)]"
      >
        <h4
          id="titulo-confirmacao-salvar-edicao"
          className="mb-3 font-[family-name:var(--font-family)] text-[length:var(--font-size-section-title)] font-bold leading-[1.3] text-[var(--color-text)]"
        >
          Salvar alterações
        </h4>
        <p className="mb-6 font-[family-name:var(--font-family)] text-[length:var(--font-size-label)] font-normal leading-[1.5] text-[var(--color-text)]">
          Deseja salvar as alterações realizadas na edição do programa?
        </p>
        <div
          className={cn(
            'flex flex-wrap justify-end gap-2',
            'max-md:flex-col-reverse max-md:items-stretch max-md:[&>button]:w-full',
          )}
        >
          <Botao variante="contorno" tamanho="formulario" onClick={onCancelar}>
            Cancelar
          </Botao>
          <Botao variante="primario" tamanho="formulario" onClick={onConfirmar}>
            Salvar
          </Botao>
        </div>
      </div>
    </div>
  )
}
