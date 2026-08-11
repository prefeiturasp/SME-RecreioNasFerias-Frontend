import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { IconeCasaMapa, IconeSeparadorMapa } from '@/components/icons'
import { cn } from '@/lib/utils'

export type NivelMapaVisual = {
  rotulo: string
  caminho?: string
}

type MapaVisualProps = {
  niveis: NivelMapaVisual[]
}

const linkItemClasses =
  'inline-flex items-center font-[family-name:var(--font-family)] text-xs leading-none text-[var(--color-text)] no-underline hover:underline focus-visible:rounded-[2px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]'

function renderizarIconeInicioMapa(ehPrimeiro: boolean) {
  if (!ehPrimeiro) {
    return null
  }

  return (
    <span className="mr-1 inline-flex shrink-0 leading-none [&>svg]:block [&>svg]:size-3">
      <IconeCasaMapa />
    </span>
  )
}

function renderizarConteudoNivel(
  nivel: NivelMapaVisual,
  ehUltimo: boolean,
  iconeInicio: ReactNode,
) {
  if (ehUltimo) {
    return (
      <span
        className="inline-flex items-center font-[family-name:var(--font-family)] text-xs leading-none text-[var(--color-primary)]"
        aria-current="page"
      >
        {iconeInicio}
        <span>{nivel.rotulo}</span>
      </span>
    )
  }

  if (nivel.caminho) {
    return (
      <Link to={nivel.caminho} className={linkItemClasses}>
        {iconeInicio}
        <span>{nivel.rotulo}</span>
      </Link>
    )
  }

  return (
    <span className="inline-flex items-center font-[family-name:var(--font-family)] text-xs leading-none text-[var(--color-text)]">
      {iconeInicio}
      <span>{nivel.rotulo}</span>
    </span>
  )
}

export function MapaVisual({ niveis }: Readonly<MapaVisualProps>) {
  return (
    <nav aria-label="Mapa do site" className="flex items-center">
      <ol className="m-0 flex list-none flex-wrap items-center gap-4 p-0">
        {niveis.map((nivel, indice) => {
          const ehUltimo = indice === niveis.length - 1
          const ehPrimeiro = indice === 0
          const iconeInicio = renderizarIconeInicioMapa(ehPrimeiro)
          const conteudo = renderizarConteudoNivel(nivel, ehUltimo, iconeInicio)

          return (
            <li
              key={nivel.caminho ?? nivel.rotulo}
              className="flex items-center"
            >
              {indice > 0 ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    'mr-1.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full',
                    'border border-[var(--color-border)] leading-none text-[var(--color-text)]',
                    '[&>svg]:block [&>svg]:size-2',
                  )}
                >
                  <IconeSeparadorMapa />
                </span>
              ) : null}
              {conteudo}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
