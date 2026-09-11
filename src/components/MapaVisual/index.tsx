import { IconeCasaMapa, IconeSeparadorMapa } from '@/components/icons'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from '@/components/ui/breadcrumb'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export type NivelMapaVisual = {
  rotulo: string
  caminho?: string
}

type MapaVisualProps = {
  niveis: NivelMapaVisual[]
}

const classesItemMapa = 'inline-flex items-center text-xs leading-none'

function renderizarIconeInicioMapa(ehPrimeiro: boolean) {
  if (!ehPrimeiro) {
    return null
  }

  return (
    <span className="mr-1 inline-flex shrink-0 leading-none [&_svg]:block [&_svg]:size-3">
      <IconeCasaMapa />
    </span>
  )
}

function renderizarSeparadorMapa() {
  return (
    <span
      aria-hidden="true"
      className="mr-1.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full border border-border leading-none text-foreground [&_svg]:size-2"
    >
      <IconeSeparadorMapa />
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
      <span aria-current="page" className={cn(classesItemMapa, 'text-primary')}>
        {iconeInicio}
        <span>{nivel.rotulo}</span>
      </span>
    )
  }

  if (nivel.caminho) {
    return (
      <BreadcrumbLink
        asChild
        className={cn(
          classesItemMapa,
          'text-foreground no-underline hover:underline focus-visible:rounded-sm focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary',
        )}
      >
        <Link to={nivel.caminho}>
          {iconeInicio}
          <span>{nivel.rotulo}</span>
        </Link>
      </BreadcrumbLink>
    )
  }

  return (
    <span className={cn(classesItemMapa, 'text-foreground')}>
      {iconeInicio}
      <span>{nivel.rotulo}</span>
    </span>
  )
}

export function MapaVisual({ niveis }: Readonly<MapaVisualProps>) {
  return (
    <Breadcrumb aria-label="Mapa do site" className="flex items-center">
      <BreadcrumbList className="gap-4 text-xs text-foreground">
        {niveis.map((nivel, indice) => {
          const ehUltimo = indice === niveis.length - 1
          const ehPrimeiro = indice === 0
          const iconeInicio = renderizarIconeInicioMapa(ehPrimeiro)
          const conteudo = renderizarConteudoNivel(nivel, ehUltimo, iconeInicio)

          return (
            <BreadcrumbItem key={`${nivel.rotulo}-${indice}`}>
              {indice > 0 && renderizarSeparadorMapa()}
              {conteudo}
            </BreadcrumbItem>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
