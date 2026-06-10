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

export function MapaVisual({ niveis }: MapaVisualProps) {
  return (
    <NavMapa aria-label="Mapa do site">
      <ListaMapa>
        {niveis.map((nivel, indice) => {
          const ehUltimo = indice === niveis.length - 1
          const ehPrimeiro = indice === 0
          const iconeInicio = ehPrimeiro ? (
            <IconeMapa>
              <IconeCasaMapa />
            </IconeMapa>
          ) : null

          const conteudo = ehUltimo ? (
            <TextoItemMapa $ativo aria-current="page">
              {iconeInicio}
              <span>{nivel.rotulo}</span>
            </TextoItemMapa>
          ) : nivel.caminho ? (
            <LinkItemMapa to={nivel.caminho}>
              {iconeInicio}
              <span>{nivel.rotulo}</span>
            </LinkItemMapa>
          ) : (
            <TextoItemMapa>
              {iconeInicio}
              <span>{nivel.rotulo}</span>
            </TextoItemMapa>
          )

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
