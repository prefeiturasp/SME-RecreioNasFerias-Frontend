import type { ReactNode } from 'react'
import { IconeCasaMapa, IconeSeparadorMapa } from '../icons'
import {
  IconeMapa,
  ItemMapa,
  LinkItemMapa,
  ListaMapa,
  NavMapa,
  SeparadorMapa,
  TextoItemMapa,
} from './style'

export type NivelMapaVisual = {
  rotulo: string
  caminho?: string
}

type MapaVisualProps = {
  niveis: NivelMapaVisual[]
}

function renderizarIconeInicioMapa(ehPrimeiro: boolean) {
  if (!ehPrimeiro) {
    return null
  }

  return (
    <IconeMapa>
      <IconeCasaMapa />
    </IconeMapa>
  )
}

function renderizarConteudoNivel(
  nivel: NivelMapaVisual,
  ehUltimo: boolean,
  iconeInicio: ReactNode,
) {
  if (ehUltimo) {
    return (
      <TextoItemMapa $ativo aria-current="page">
        {iconeInicio}
        <span>{nivel.rotulo}</span>
      </TextoItemMapa>
    )
  }

  if (nivel.caminho) {
    return (
      <LinkItemMapa to={nivel.caminho}>
        {iconeInicio}
        <span>{nivel.rotulo}</span>
      </LinkItemMapa>
    )
  }

  return (
    <TextoItemMapa>
      {iconeInicio}
      <span>{nivel.rotulo}</span>
    </TextoItemMapa>
  )
}

export function MapaVisual({ niveis }: Readonly<MapaVisualProps>) {
  return (
    <NavMapa aria-label="Mapa do site">
      <ListaMapa>
        {niveis.map((nivel, indice) => {
          const ehUltimo = indice === niveis.length - 1
          const ehPrimeiro = indice === 0
          const iconeInicio = renderizarIconeInicioMapa(ehPrimeiro)

          const conteudo = renderizarConteudoNivel(nivel, ehUltimo, iconeInicio)

          return (
            <ItemMapa key={`${nivel.rotulo}-${indice}`}>
              {indice > 0 && (
                <SeparadorMapa aria-hidden="true">
                  <IconeSeparadorMapa />
                </SeparadorMapa>
              )}
              {conteudo}
            </ItemMapa>
          )
        })}
      </ListaMapa>
    </NavMapa>
  )
}
