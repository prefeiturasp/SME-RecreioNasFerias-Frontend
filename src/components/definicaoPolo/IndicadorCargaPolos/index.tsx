import { Progress } from '@/components/ui/progress'
import { Spinner } from '@/components/ui/spinner'
import { useEffect, useState } from 'react'

const INTERVALO_PROGRESSO_MS = 400
const PERCENTUAL_MAXIMO_ENQUANTO_CARREGA = 90

export function IndicadorCargaPolos() {
  const [percentual, setPercentual] = useState(0)

  useEffect(() => {
    const temporizador = globalThis.setInterval(() => {
      setPercentual((atual) => {
        if (atual >= PERCENTUAL_MAXIMO_ENQUANTO_CARREGA) {
          return atual
        }

        const restante = PERCENTUAL_MAXIMO_ENQUANTO_CARREGA - atual
        const incremento = Math.max(0.4, restante * 0.06)
        return Math.min(PERCENTUAL_MAXIMO_ENQUANTO_CARREGA, atual + incremento)
      })
    }, INTERVALO_PROGRESSO_MS)

    return () => globalThis.clearInterval(temporizador)
  }, [])

  return (
    <output
      aria-live="polite"
      className="flex w-full flex-col items-center justify-center gap-4 px-4 py-8"
    >
      <div className="flex items-center gap-3 text-sm font-medium text-foreground">
        <Spinner
          className="size-5 text-brand-dark"
          role="presentation"
          aria-hidden="true"
        />
        <span>Carregando polos da rede...</span>
      </div>

      <Progress
        value={percentual}
        aria-label="Progresso do carregamento dos polos"
        className="h-2 max-w-md bg-muted **:data-[slot=progress-indicator]:bg-brand-dark"
      />
    </output>
  )
}
