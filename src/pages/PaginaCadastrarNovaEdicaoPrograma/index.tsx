import { useCallback, useState, type SubmitEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import IconeSetaVoltar from '../../assets/icone-seta-voltar.png'
import { Cabecalho } from '../../components/Cabecalho'
import { GrupoPeriodoData } from '../../components/CampoDataFormulario'
import { MapaVisual } from '../../components/MapaVisual'
import { MenuLateral } from '../../components/MenuLateral'
import {
  cadastrarEdicaoPrograma,
  ErroCadastroEdicaoPrograma,
} from '../../services/edicaoPrograma/api'
import { QUANTIDADES_MOCK_CADASTRO_EDICAO } from '../../services/edicaoPrograma/mocks'
import type { DadosCadastroEdicaoPrograma } from '../../services/edicaoPrograma/types'
import { validarCadastroEdicao, formularioCadastroEstaPreenchido } from '../../services/edicaoPrograma/validarCadastroEdicao'
import type { EstadoNavegacaoEdicoesPrograma } from '../PaginaEdicoesPrograma/types'
import {
  AreaConteudo,
  BotaoCancelarFormulario,
  BotaoSalvarFormulario,
  BotaoVoltar,
  CabecalhoAreaInternaConteudo,
  ContainerPaginaEdicoesPrograma,
  FormularioCadastroNovaEdicao,
  InputNumericoFormularioCadastroNovaEdicao,
  InputTextoFormularioCadastroNovaEdicao,
  LinhaDeControlesFormularioCadastroNovaEdicao,
  LinhaFormularioCadastroNovaEdicao,
  MensagemErroFormulario,
  RotuloBotaoVoltar,
  SecaoPrincipal,
} from './style'

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

function obterCampoTextoFormulario(dados: FormData, nomeCampo: string): string {
  const valor = dados.get(nomeCampo)
  return typeof valor === 'string' ? valor : ''
}

function obterDadosCadastroFormulario(
  form: HTMLFormElement,
): DadosCadastroEdicaoPrograma {
  const dados = new FormData(form)

  return {
    nome: obterCampoTextoFormulario(dados, 'NomeDaEdicao'),
    dataInicioEdicao: obterCampoTextoFormulario(dados, 'DataInicioEdicao'),
    dataFimEdicao: obterCampoTextoFormulario(dados, 'DataFimEdicao'),
    dataInicioInscricoes: obterCampoTextoFormulario(
      dados,
      'DataInicioInscricoes',
    ),
    dataFimInscricoes: obterCampoTextoFormulario(dados, 'DataFimInscricoes'),
  }
}

export default function PaginaCadastrarNovaEdicaoPrograma() {
  const navigate = useNavigate()
  const [mensagemErro, setMensagemErro] = useState<string | null>(null)
  const [estaSalvando, setEstaSalvando] = useState(false)
  const [formularioPreenchido, setFormularioPreenchido] = useState(false)

  const voltarParaEdicoes = () => navigate('/edicoes-programa')

  const detectarPreenchimentoFormulario = useCallback(
    (form: HTMLFormElement) => {
      setFormularioPreenchido(
        formularioCadastroEstaPreenchido(obterDadosCadastroFormulario(form)),
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

    const dadosCadastro = obterDadosCadastroFormulario(form)

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
    <ContainerPaginaEdicoesPrograma>
      <MenuLateral />
      <SecaoPrincipal>
        <Cabecalho />
        <AreaConteudo>
          <MapaVisual niveis={[...NIVEIS_MAPA_VISUAL]} />
          <section>
            <CabecalhoAreaInternaConteudo>
              <h3>Cadastrar Nova Edição do Programa</h3>
              <div>
                <BotaoVoltar
                  type="button"
                  aria-label="Voltar para edições do programa"
                  onClick={voltarParaEdicoes}
                >
                  <img src={IconeSetaVoltar} alt="" aria-hidden="true" />
                  <RotuloBotaoVoltar>Voltar</RotuloBotaoVoltar>
                </BotaoVoltar>
              </div>
            </CabecalhoAreaInternaConteudo>
            <FormularioCadastroNovaEdicao
              onSubmit={salvarNovaEdicao}
              onChange={(evento) =>
                detectarPreenchimentoFormulario(evento.currentTarget)
              }
            >
              {mensagemErro && (
                <MensagemErroFormulario role="alert">
                  {mensagemErro}
                </MensagemErroFormulario>
              )}
              <LinhaFormularioCadastroNovaEdicao>
                <InputTextoFormularioCadastroNovaEdicao>
                  <label htmlFor="NomeDaEdicao">Nome da Edição</label>
                  <input
                    type="text"
                    name="NomeDaEdicao"
                    id="NomeDaEdicao"
                    placeholder="Digite o Nome da Edição"
                  />
                </InputTextoFormularioCadastroNovaEdicao>
                <GrupoPeriodoData
                  rotulo="Período da Edição"
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
              </LinhaFormularioCadastroNovaEdicao>

              <LinhaFormularioCadastroNovaEdicao>
                {CAMPOS_NUMERICOS_DESABILITADOS.slice(0, 3).map((campo) => (
                  <InputNumericoFormularioCadastroNovaEdicao key={campo.id}>
                    <label htmlFor={campo.id}>{campo.rotulo}</label>
                    <input
                      type="number"
                      name={campo.id}
                      id={campo.id}
                      placeholder={campo.placeholder}
                      readOnly
                      value={campo.valor}
                    />
                  </InputNumericoFormularioCadastroNovaEdicao>
                ))}
              </LinhaFormularioCadastroNovaEdicao>

              <LinhaFormularioCadastroNovaEdicao>
                <InputNumericoFormularioCadastroNovaEdicao>
                  <label htmlFor={CAMPOS_NUMERICOS_DESABILITADOS[3].id}>
                    {CAMPOS_NUMERICOS_DESABILITADOS[3].rotulo}
                  </label>
                  <input
                    type="number"
                    name={CAMPOS_NUMERICOS_DESABILITADOS[3].id}
                    id={CAMPOS_NUMERICOS_DESABILITADOS[3].id}
                    placeholder={CAMPOS_NUMERICOS_DESABILITADOS[3].placeholder}
                    readOnly
                    value={CAMPOS_NUMERICOS_DESABILITADOS[3].valor}
                  />
                </InputNumericoFormularioCadastroNovaEdicao>
              </LinhaFormularioCadastroNovaEdicao>

              <LinhaDeControlesFormularioCadastroNovaEdicao>
                <BotaoCancelarFormulario
                  type="button"
                  onClick={voltarParaEdicoes}
                >
                  Cancelar
                </BotaoCancelarFormulario>
                <BotaoSalvarFormulario
                  type="submit"
                  disabled={estaSalvando || !formularioPreenchido}
                >
                  Salvar
                </BotaoSalvarFormulario>
              </LinhaDeControlesFormularioCadastroNovaEdicao>
            </FormularioCadastroNovaEdicao>
          </section>
        </AreaConteudo>
      </SecaoPrincipal>
    </ContainerPaginaEdicoesPrograma>
  )
}
