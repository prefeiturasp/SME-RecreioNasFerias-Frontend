import { useCallback, useState, type SubmitEvent } from 'react'
import { useNavigate } from 'react-router-dom'

import IconeSetaVoltar from '../../assets/icone-seta-voltar.png'
import { Botao, BotaoVoltar } from '@/components/shared/botao'
import { MensagemAlerta } from '@/components/shared/mensagem-alerta'
import { CartaoFormulario } from '@/components/shared/cartao-conteudo'
import { GrupoPeriodoData } from '@/components/shared/campo-periodo-data'
import {
  AcoesFormulario,
  CampoFormulario,
  LinhaFormulario,
} from '@/components/shared/campo-formulario'
import { MapaVisual } from '@/components/shared/mapa-visual'
import { CabecalhoPagina } from '@/components/shared/cabecalho-pagina'
import {
  AreaConteudo,
  ContainerPagina,
  SecaoPrincipal,
} from '@/components/shared/estrutura-pagina'
import { CabecalhoSecao } from '@/components/shared/cabecalho-secao'
import { MenuLateral } from '@/components/shared/menu-lateral'
import { CampoEntrada } from '@/components/ui/campo-entrada'
import {
  cadastrarEdicaoPrograma,
  ErroCadastroEdicaoPrograma,
} from '../../services/edicaoPrograma/api'
import { QUANTIDADES_MOCK_CADASTRO_EDICAO } from '../../services/edicaoPrograma/mocks'
import { obterDadosFormularioEdicao } from '../../services/edicaoPrograma/obterDadosFormularioEdicao'
import {
  validarCadastroEdicao,
  formularioCadastroEstaPreenchido,
} from '../../services/edicaoPrograma/validarCadastroEdicao'
import type { EstadoNavegacaoEdicoesPrograma } from '../PaginaEdicoesPrograma/types'

const NIVEIS_MAPA_VISUAL = [
  { rotulo: 'Início', caminho: '/inicio' },
  { rotulo: 'Cadastros' },
  { rotulo: 'Edições do programa', caminho: '/edicoes-programa' },
  { rotulo: 'Cadastrar Nova Edição do Programa' },
] as const

const CAMPOS_NUMERICOS_DESABILITADOS = [
  {
    id: 'QuantidadeInscritos',
    rotulo: 'Quantidade de Inscritos',
    placeholder: 'Quantidade de Inscritos',
    valor: QUANTIDADES_MOCK_CADASTRO_EDICAO.quantidadeInscritos,
  },
  {
    id: 'QuantidadeAtendimentoEfetivo',
    rotulo: 'Quantidade de Atendimento Efetivo',
    placeholder: 'Quantidade de Atendimento Efetivo',
    valor: QUANTIDADES_MOCK_CADASTRO_EDICAO.quantidadeAtendimentoEfetivo,
  },
  {
    id: 'QuantidadePasseios',
    rotulo: 'Quantidade de Passeios',
    placeholder: 'Quantidade de Passeios',
    valor: QUANTIDADES_MOCK_CADASTRO_EDICAO.quantidadePasseios,
  },
  {
    id: 'QuantidadeApresentacoes',
    rotulo: 'Quantidade de Apresentações',
    placeholder: 'Quantidade de Apresentações',
    valor: QUANTIDADES_MOCK_CADASTRO_EDICAO.quantidadeApresentacoes,
  },
] as const

export default function PaginaCadastrarNovaEdicaoPrograma() {
  const navigate = useNavigate()
  const [mensagemErro, setMensagemErro] = useState<string | null>(null)
  const [estaSalvando, setEstaSalvando] = useState(false)
  const [formularioPreenchido, setFormularioPreenchido] = useState(false)

  const voltarParaEdicoes = () => navigate('/edicoes-programa')

  const detectarPreenchimentoFormulario = useCallback(
    (form: HTMLFormElement) => {
      setFormularioPreenchido(
        formularioCadastroEstaPreenchido(obterDadosFormularioEdicao(form)),
      )
    },
    [],
  )

  const salvarNovaEdicao = (evento: SubmitEvent<HTMLFormElement>) => {
    evento.preventDefault()
    void submeterNovaEdicao(evento.currentTarget)
  }

  async function submeterNovaEdicao(form: HTMLFormElement) {
    setMensagemErro(null)

    const dadosCadastro = obterDadosFormularioEdicao(form)

    const mensagemValidacao = validarCadastroEdicao(dadosCadastro)
    if (mensagemValidacao) {
      setMensagemErro(mensagemValidacao)
      return
    }

    setEstaSalvando(true)

    try {
      await cadastrarEdicaoPrograma(dadosCadastro)

      navigate('/edicoes-programa', {
        state: {
          edicaoCadastrada: true,
        } satisfies EstadoNavegacaoEdicoesPrograma,
      })
    } catch (error) {
      if (error instanceof ErroCadastroEdicaoPrograma) {
        setMensagemErro(error.mensagemUsuario)
      }
    } finally {
      setEstaSalvando(false)
    }
  }

  return (
    <ContainerPagina>
      <MenuLateral />
      <SecaoPrincipal>
        <CabecalhoPagina />
        <AreaConteudo>
          <MapaVisual niveis={[...NIVEIS_MAPA_VISUAL]} />
          <section>
            <CabecalhoSecao
              titulo="Cadastrar Nova Edição do Programa"
              acoes={
                <BotaoVoltar
                  aria-label="Voltar para edições do programa"
                  onClick={voltarParaEdicoes}
                  icone={
                    <img src={IconeSetaVoltar} alt="" aria-hidden="true" />
                  }
                >
                  Voltar
                </BotaoVoltar>
              }
            />
            <CartaoFormulario
              onSubmit={salvarNovaEdicao}
              onChange={(evento) =>
                detectarPreenchimentoFormulario(evento.currentTarget)
              }
            >
              {mensagemErro && (
                <MensagemAlerta variante="erro" role="alert">
                  {mensagemErro}
                </MensagemAlerta>
              )}
              <LinhaFormulario>
                <CampoFormulario>
                  <label htmlFor="NomeDaEdicao">
                    Nome da Edição do Programa
                  </label>
                  <CampoEntrada
                    type="text"
                    name="NomeDaEdicao"
                    id="NomeDaEdicao"
                    placeholder="Digite o Nome da Edição do Programa"
                  />
                </CampoFormulario>
                <GrupoPeriodoData
                  rotulo="Período da Edição do Programa"
                  idCampoInicio="DataInicioEdicao"
                  nomeCampoInicio="DataInicioEdicao"
                  rotuloAcessivelInicio="Data de início da edição"
                  idCampoFim="DataFimEdicao"
                  nomeCampoFim="DataFimEdicao"
                  rotuloAcessivelFim="Data de fim da edição"
                />
                <GrupoPeriodoData
                  rotulo="Período das Inscrições"
                  idCampoInicio="DataInicioInscricoes"
                  nomeCampoInicio="DataInicioInscricoes"
                  rotuloAcessivelInicio="Data de início das inscrições"
                  idCampoFim="DataFimInscricoes"
                  nomeCampoFim="DataFimInscricoes"
                  rotuloAcessivelFim="Data de fim das inscrições"
                />
              </LinhaFormulario>

              <LinhaFormulario>
                {CAMPOS_NUMERICOS_DESABILITADOS.slice(0, 3).map((campo) => (
                  <CampoFormulario key={campo.id}>
                    <label htmlFor={campo.id}>{campo.rotulo}</label>
                    <CampoEntrada
                      type="number"
                      name={campo.id}
                      id={campo.id}
                      placeholder={campo.placeholder}
                      readOnly
                      value={campo.valor}
                    />
                  </CampoFormulario>
                ))}
              </LinhaFormulario>

              <LinhaFormulario>
                <CampoFormulario>
                  <label htmlFor={CAMPOS_NUMERICOS_DESABILITADOS[3].id}>
                    {CAMPOS_NUMERICOS_DESABILITADOS[3].rotulo}
                  </label>
                  <CampoEntrada
                    type="number"
                    name={CAMPOS_NUMERICOS_DESABILITADOS[3].id}
                    id={CAMPOS_NUMERICOS_DESABILITADOS[3].id}
                    placeholder={CAMPOS_NUMERICOS_DESABILITADOS[3].placeholder}
                    readOnly
                    value={CAMPOS_NUMERICOS_DESABILITADOS[3].valor}
                  />
                </CampoFormulario>
              </LinhaFormulario>

              <AcoesFormulario>
                <Botao
                  variante="contorno"
                  tamanho="formulario"
                  onClick={voltarParaEdicoes}
                >
                  Cancelar
                </Botao>
                <Botao
                  variante="primario"
                  tamanho="formulario"
                  type="submit"
                  disabled={estaSalvando || !formularioPreenchido}
                >
                  Salvar
                </Botao>
              </AcoesFormulario>
            </CartaoFormulario>
          </section>
        </AreaConteudo>
      </SecaoPrincipal>
    </ContainerPagina>
  )
}
