import { useState } from 'react'

import { ChevronDownIcon, IconeFiltro } from '../../components/icons'
import { IndicadorCarregamento } from '../../components/IndicadorCarregamento'
import { useOpcoesFiltroDefinicaoPolos } from '../../services/definicaoPolo/useOpcoesFiltroDefinicaoPolos'
import type { FiltrosListagemDefinicaoPolos } from '../../services/definicaoPolo/types'
import {
  BotaoCancelarFormulario as BotaoLimparFiltros,
  BotaoSalvarFormulario as BotaoFiltrar,
} from '../shared/edicoesProgramaStyles'
import {
  BotaoCabecalhoFiltrosPolos,
  CabecalhoFiltrosPolos,
  CampoFiltroPolos,
  CartaoFiltrosPolos,
  CorpoFiltrosPolos,
  IconeChevronFiltrosPolos,
  LinhaBotoesFiltrosPolos,
  LinhaCamposFiltrosPolos,
  SeletorCampoFiltroPolos,
  TituloFiltrosPolos,
} from '../PaginaPolosParceiros/filtrosStyles'

type FiltrosDefinicaoPolosProps = {
  valores: FiltrosListagemDefinicaoPolos
  onChange: (valores: FiltrosListagemDefinicaoPolos) => void
  onLimpar: () => void
  onFiltrar: () => void
}

export function FiltrosDefinicaoPolos({
  valores,
  onChange,
  onLimpar,
  onFiltrar,
}: Readonly<FiltrosDefinicaoPolosProps>) {
  const [expandido, setExpandido] = useState(true)
  const {
    opcoesDre,
    opcoesTipoUe,
    opcoesGestao,
    opcoesNomeEdicao,
    opcoesTipoPolo,
    estaCarregando,
  } = useOpcoesFiltroDefinicaoPolos()

  const atualizarCampo = (
    campo: keyof FiltrosListagemDefinicaoPolos,
    valor: string,
  ) => {
    onChange({
      ...valores,
      [campo]: valor,
    })
  }

  return (
    <CartaoFiltrosPolos aria-label="Filtrar polos">
      <CabecalhoFiltrosPolos>
        <BotaoCabecalhoFiltrosPolos
          type="button"
          aria-expanded={expandido}
          aria-controls="corpo-filtros-definicao-polos"
          onClick={() => setExpandido((atual) => !atual)}
        >
          <IconeFiltro />
          <TituloFiltrosPolos>Filtrar Polos</TituloFiltrosPolos>
          <IconeChevronFiltrosPolos $expandido={expandido} aria-hidden="true">
            <ChevronDownIcon />
          </IconeChevronFiltrosPolos>
        </BotaoCabecalhoFiltrosPolos>
      </CabecalhoFiltrosPolos>

      {expandido && (
        <CorpoFiltrosPolos id="corpo-filtros-definicao-polos">
          {estaCarregando ? (
            <IndicadorCarregamento mensagem="Carregando opções dos filtros..." />
          ) : (
            <>
              <LinhaCamposFiltrosPolos>
                <CampoFiltroPolos>
                  <label htmlFor="filtro-dre">Filtrar por DRE</label>
                  <SeletorCampoFiltroPolos>
                    <select
                      id="filtro-dre"
                      value={valores.dre}
                      onChange={(evento) =>
                        atualizarCampo('dre', evento.target.value)
                      }
                    >
                      <option value="">Selecione a DRE</option>
                      {opcoesDre.map((dre) => (
                        <option key={dre} value={dre}>
                          {dre}
                        </option>
                      ))}
                    </select>
                    <ChevronDownIcon />
                  </SeletorCampoFiltroPolos>
                </CampoFiltroPolos>

                <CampoFiltroPolos>
                  <label htmlFor="filtro-tipo-ue">Filtrar por Tipo de UE</label>
                  <SeletorCampoFiltroPolos>
                    <select
                      id="filtro-tipo-ue"
                      value={valores.tipoUe}
                      onChange={(evento) =>
                        atualizarCampo('tipoUe', evento.target.value)
                      }
                    >
                      <option value="">Selecione o Tipo de UE</option>
                      {opcoesTipoUe.map((tipoUe) => (
                        <option key={tipoUe} value={tipoUe}>
                          {tipoUe}
                        </option>
                      ))}
                    </select>
                    <ChevronDownIcon />
                  </SeletorCampoFiltroPolos>
                </CampoFiltroPolos>

                <CampoFiltroPolos>
                  <label htmlFor="filtro-nome-ue-codigo-eol">
                    Filtrar por Nome da UE ou Código EOL
                  </label>
                  <SeletorCampoFiltroPolos>
                    <input
                      id="filtro-nome-ue-codigo-eol"
                      type="search"
                      value={valores.nomeUeOuCodigoEol}
                      placeholder="Digite o Nome da UE ou Código EOL"
                      onChange={(evento) =>
                        atualizarCampo('nomeUeOuCodigoEol', evento.target.value)
                      }
                    />
                  </SeletorCampoFiltroPolos>
                </CampoFiltroPolos>
              </LinhaCamposFiltrosPolos>

              <LinhaCamposFiltrosPolos>
                <CampoFiltroPolos>
                  <label htmlFor="filtro-nome-edicao">
                    Filtrar por Nome da Edição
                  </label>
                  <SeletorCampoFiltroPolos>
                    <select
                      id="filtro-nome-edicao"
                      value={valores.nomeEdicao}
                      onChange={(evento) =>
                        atualizarCampo('nomeEdicao', evento.target.value)
                      }
                    >
                      <option value="">Selecione o Nome da Edição</option>
                      {opcoesNomeEdicao.map((edicao) => (
                        <option key={edicao} value={edicao}>
                          {edicao}
                        </option>
                      ))}
                    </select>
                    <ChevronDownIcon />
                  </SeletorCampoFiltroPolos>
                </CampoFiltroPolos>

                <CampoFiltroPolos>
                  <label htmlFor="filtro-tipo-polo">Tipo de Polo</label>
                  <SeletorCampoFiltroPolos>
                    <select
                      id="filtro-tipo-polo"
                      value={valores.tipoPolo}
                      onChange={(evento) =>
                        atualizarCampo('tipoPolo', evento.target.value)
                      }
                    >
                      <option value="">Selecione o Tipo de Polo</option>
                      {opcoesTipoPolo.map((tipoPolo) => (
                        <option key={tipoPolo} value={tipoPolo}>
                          {tipoPolo}
                        </option>
                      ))}
                    </select>
                    <ChevronDownIcon />
                  </SeletorCampoFiltroPolos>
                </CampoFiltroPolos>

                <CampoFiltroPolos>
                  <label htmlFor="filtro-gestao">Gestão</label>
                  <SeletorCampoFiltroPolos>
                    <select
                      id="filtro-gestao"
                      value={valores.gestao}
                      onChange={(evento) =>
                        atualizarCampo('gestao', evento.target.value)
                      }
                    >
                      <option value="">Selecione a Gestão</option>
                      {opcoesGestao.map((gestao) => (
                        <option key={gestao} value={gestao}>
                          {gestao}
                        </option>
                      ))}
                    </select>
                    <ChevronDownIcon />
                  </SeletorCampoFiltroPolos>
                </CampoFiltroPolos>
              </LinhaCamposFiltrosPolos>

              <LinhaBotoesFiltrosPolos>
                <BotaoLimparFiltros type="button" onClick={onLimpar}>
                  Limpar Filtros
                </BotaoLimparFiltros>
                <BotaoFiltrar type="button" onClick={onFiltrar}>
                  Filtrar
                </BotaoFiltrar>
              </LinhaBotoesFiltrosPolos>
            </>
          )}
        </CorpoFiltrosPolos>
      )}
    </CartaoFiltrosPolos>
  )
}
