import {
  useCallback,
  useState,
  type ChangeEvent,
  type SubmitEvent,
} from 'react'
import { useNavigate } from 'react-router-dom'

import IconeSetaVoltar from '../../assets/icone-seta-voltar.png'
import { CabecalhoPagina } from '@/components/shared/cabecalho-pagina'
import { IndicadorCarregamento } from '../../components/IndicadorCarregamento'
import { ChevronDownIcon } from '../../components/icons'
import { MapaVisual } from '../../components/MapaVisual'
import { MenuLateral } from '@/components/shared/menu-lateral'
import {
  cadastrarPoloParceiro,
  ErroCadastroPoloParceiro,
} from '../../services/poloParceiro/api'
import { obterDadosCadastroFormulario } from '../../services/poloParceiro/obterDadosCadastroFormulario'
import { useOpcoesIntegracaoPolosParceiros } from '../../services/smeIntegracao/useOpcoesIntegracaoPolosParceiros'
import {
  formularioCadastroEstaPreenchido,
  validarCadastroPoloParceiro,
} from '../../services/poloParceiro/validarCadastroPoloParceiro'
import type { EstadoNavegacaoPolosParceiros } from '../PaginaPolosParceiros/types'
import {
  aplicarMascaraCep,
  aplicarMascaraTelefone,
} from '../../utils/mascarasEntrada'
import {
  AreaConteudo,
  BotaoCancelarFormulario,
  BotaoSalvarFormulario,
  BotaoVoltar,
  CabecalhoAreaInternaConteudo,
  CampoNumericoFormularioPoloParceiro,
  CampoSeletorFormularioPoloParceiro,
  CampoTextareaFormularioPoloParceiro,
  CampoTextoFormularioPoloParceiro,
  ContainerPaginaCadastrarPoloParceiro,
  FormularioCadastroPoloParceiro,
  LinhaDeControlesFormularioCadastroNovaEdicao,
  LinhaFormularioColunaUnicaPoloParceiro,
  LinhaFormularioDuasColunasPoloParceiro,
  LinhaFormularioTresColunasPoloParceiro,
  MensagemErroFormulario,
  RotuloBotaoVoltar,
  SecaoFormularioPoloParceiro,
  SecaoPrincipal,
  TituloSecaoFormularioPoloParceiro,
} from './style'

const NIVEIS_MAPA_VISUAL = [
  { rotulo: 'Início', caminho: '/inicio' },
  { rotulo: 'Cadastros' },
  { rotulo: 'Cadastro de Polos Parceiros', caminho: '/polos-parceiros' },
  { rotulo: 'Cadastrar Polo Parceiro' },
] as const

const TIPO_POLO_PARCEIRO = 'Pendente'

export default function PaginaCadastrarPoloParceiro() {
  const navigate = useNavigate()
  const [mensagemErro, setMensagemErro] = useState<string | null>(null)
  const [estaSalvando, setEstaSalvando] = useState(false)
  const [formularioPreenchido, setFormularioPreenchido] = useState(false)
  const { opcoesDre, opcoesTipoUe, estaCarregando } =
    useOpcoesIntegracaoPolosParceiros()

  const voltarParaListagem = () => navigate('/polos-parceiros')

  const detectarPreenchimentoFormulario = useCallback(
    (form: HTMLFormElement) => {
      setFormularioPreenchido(
        formularioCadastroEstaPreenchido(obterDadosCadastroFormulario(form)),
      )
    },
    [],
  )

  const aplicarMascaraNoCampo = (
    evento: ChangeEvent<HTMLInputElement>,
    aplicarMascara: (valor: string) => string,
  ) => {
    evento.target.value = aplicarMascara(evento.target.value)

    const form = evento.currentTarget.form
    if (form) {
      detectarPreenchimentoFormulario(form)
    }
  }

  const salvarPoloParceiro = (evento: SubmitEvent<HTMLFormElement>) => {
    evento.preventDefault()
    void submeterCadastro(evento.currentTarget)
  }

  async function submeterCadastro(form: HTMLFormElement) {
    setMensagemErro(null)

    const dadosCadastro = obterDadosCadastroFormulario(form)

    const mensagemValidacao = validarCadastroPoloParceiro(dadosCadastro)
    if (mensagemValidacao) {
      setMensagemErro(mensagemValidacao)
      return
    }

    setEstaSalvando(true)

    try {
      await cadastrarPoloParceiro(dadosCadastro)

      navigate('/polos-parceiros', {
        state: {
          poloCadastrado: true,
        } satisfies EstadoNavegacaoPolosParceiros,
      })
    } catch (error) {
      if (error instanceof ErroCadastroPoloParceiro) {
        setMensagemErro(error.mensagemUsuario)
      }
    } finally {
      setEstaSalvando(false)
    }
  }

  return (
    <ContainerPaginaCadastrarPoloParceiro>
      <MenuLateral />
      <SecaoPrincipal>
        <CabecalhoPagina />
        <AreaConteudo>
          <MapaVisual niveis={[...NIVEIS_MAPA_VISUAL]} />
          <section>
            <CabecalhoAreaInternaConteudo>
              <h3>Cadastrar Polo Parceiro</h3>
              <div>
                <BotaoVoltar
                  type="button"
                  aria-label="Voltar para cadastro de polos parceiros"
                  onClick={voltarParaListagem}
                >
                  <img src={IconeSetaVoltar} alt="" aria-hidden="true" />
                  <RotuloBotaoVoltar>Voltar</RotuloBotaoVoltar>
                </BotaoVoltar>
              </div>
            </CabecalhoAreaInternaConteudo>

            {estaCarregando ? (
              <IndicadorCarregamento mensagem="Carregando formulário..." />
            ) : (
              <FormularioCadastroPoloParceiro
                noValidate
                onSubmit={salvarPoloParceiro}
                onChange={(evento) =>
                  detectarPreenchimentoFormulario(evento.currentTarget)
                }
              >
                {mensagemErro && (
                  <MensagemErroFormulario role="alert">
                    {mensagemErro}
                  </MensagemErroFormulario>
                )}

                <SecaoFormularioPoloParceiro aria-labelledby="secao-informacoes-gerais">
                  <TituloSecaoFormularioPoloParceiro id="secao-informacoes-gerais">
                    Informações Gerais
                  </TituloSecaoFormularioPoloParceiro>

                  <LinhaFormularioColunaUnicaPoloParceiro>
                    <CampoTextoFormularioPoloParceiro>
                      <label htmlFor="Tipo">Tipo</label>
                      <input
                        type="text"
                        name="Tipo"
                        id="Tipo"
                        value={TIPO_POLO_PARCEIRO}
                        readOnly
                        aria-readonly="true"
                      />
                    </CampoTextoFormularioPoloParceiro>
                  </LinhaFormularioColunaUnicaPoloParceiro>

                  <LinhaFormularioDuasColunasPoloParceiro>
                    <CampoTextoFormularioPoloParceiro>
                      <label htmlFor="NomeOsc">Nome da OSC</label>
                      <input
                        type="text"
                        name="NomeOsc"
                        id="NomeOsc"
                        placeholder="Digite o nome da OSC"
                      />
                    </CampoTextoFormularioPoloParceiro>
                    <CampoTextoFormularioPoloParceiro>
                      <label htmlFor="NomePolo">Nome do Polo</label>
                      <input
                        type="text"
                        name="NomePolo"
                        id="NomePolo"
                        placeholder="Digite o nome do polo"
                      />
                    </CampoTextoFormularioPoloParceiro>
                  </LinhaFormularioDuasColunasPoloParceiro>

                  <LinhaFormularioTresColunasPoloParceiro>
                    <CampoSeletorFormularioPoloParceiro>
                      <label htmlFor="Dre">DRE</label>
                      <div>
                        <select name="Dre" id="Dre" defaultValue="">
                          <option value="">Selecione a DRE</option>
                          {opcoesDre.map((dre) => (
                            <option key={dre.codigo} value={dre.nome}>
                              {dre.nome}
                            </option>
                          ))}
                        </select>
                        <ChevronDownIcon />
                      </div>
                    </CampoSeletorFormularioPoloParceiro>
                    <CampoSeletorFormularioPoloParceiro>
                      <label htmlFor="TipoUe">Tipo de UE</label>
                      <div>
                        <select name="TipoUe" id="TipoUe" defaultValue="">
                          <option value="">Selecione o tipo</option>
                          {opcoesTipoUe.map((tipoUe) => (
                            <option
                              key={tipoUe.codigo}
                              value={tipoUe.descricaoSigla}
                            >
                              {tipoUe.descricaoSigla}
                            </option>
                          ))}
                        </select>
                        <ChevronDownIcon />
                      </div>
                    </CampoSeletorFormularioPoloParceiro>
                    <CampoNumericoFormularioPoloParceiro>
                      <label htmlFor="QuantidadeMaximaAlunos">
                        Quantidade máxima de alunos
                      </label>
                      <input
                        type="number"
                        name="QuantidadeMaximaAlunos"
                        id="QuantidadeMaximaAlunos"
                        placeholder="Digite a quantidade"
                        min={1}
                      />
                    </CampoNumericoFormularioPoloParceiro>
                  </LinhaFormularioTresColunasPoloParceiro>
                </SecaoFormularioPoloParceiro>

                <SecaoFormularioPoloParceiro aria-labelledby="secao-endereco">
                  <TituloSecaoFormularioPoloParceiro id="secao-endereco">
                    Endereço
                  </TituloSecaoFormularioPoloParceiro>

                  <LinhaFormularioDuasColunasPoloParceiro>
                    <CampoTextoFormularioPoloParceiro>
                      <label htmlFor="Cep">CEP</label>
                      <input
                        type="text"
                        name="Cep"
                        id="Cep"
                        inputMode="numeric"
                        autoComplete="postal-code"
                        placeholder="00000-000"
                        onChange={(evento) =>
                          aplicarMascaraNoCampo(evento, aplicarMascaraCep)
                        }
                      />
                    </CampoTextoFormularioPoloParceiro>
                    <CampoTextoFormularioPoloParceiro>
                      <label htmlFor="Endereco">Endereço</label>
                      <input
                        type="text"
                        name="Endereco"
                        id="Endereco"
                        placeholder="Digite o endereço"
                      />
                    </CampoTextoFormularioPoloParceiro>
                  </LinhaFormularioDuasColunasPoloParceiro>
                </SecaoFormularioPoloParceiro>

                <SecaoFormularioPoloParceiro aria-labelledby="secao-contato">
                  <TituloSecaoFormularioPoloParceiro id="secao-contato">
                    Informações de contato
                  </TituloSecaoFormularioPoloParceiro>

                  <LinhaFormularioTresColunasPoloParceiro>
                    <CampoTextoFormularioPoloParceiro>
                      <label htmlFor="NomeGestor">Nome do gestor</label>
                      <input
                        type="text"
                        name="NomeGestor"
                        id="NomeGestor"
                        placeholder="Digite o nome do gestor"
                      />
                    </CampoTextoFormularioPoloParceiro>
                    <CampoTextoFormularioPoloParceiro>
                      <label htmlFor="EmailPolo">E-mail do Polo</label>
                      <input
                        type="email"
                        name="EmailPolo"
                        id="EmailPolo"
                        placeholder="Digite o e-mail oficial do polo"
                      />
                    </CampoTextoFormularioPoloParceiro>
                    <CampoTextoFormularioPoloParceiro>
                      <label htmlFor="TelefonePolo">Telefone do Polo</label>
                      <input
                        type="text"
                        name="TelefonePolo"
                        id="TelefonePolo"
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder="(00) 00000-0000"
                        onChange={(evento) =>
                          aplicarMascaraNoCampo(evento, aplicarMascaraTelefone)
                        }
                      />
                    </CampoTextoFormularioPoloParceiro>
                  </LinhaFormularioTresColunasPoloParceiro>
                </SecaoFormularioPoloParceiro>

                <SecaoFormularioPoloParceiro aria-labelledby="secao-observacoes">
                  <TituloSecaoFormularioPoloParceiro id="secao-observacoes">
                    Observações
                  </TituloSecaoFormularioPoloParceiro>

                  <LinhaFormularioColunaUnicaPoloParceiro>
                    <CampoTextareaFormularioPoloParceiro>
                      <label htmlFor="Observacoes">Observações Gerais</label>
                      <textarea
                        name="Observacoes"
                        id="Observacoes"
                        placeholder="Digite observações e comentários"
                      />
                    </CampoTextareaFormularioPoloParceiro>
                  </LinhaFormularioColunaUnicaPoloParceiro>
                </SecaoFormularioPoloParceiro>

                <LinhaDeControlesFormularioCadastroNovaEdicao>
                  <BotaoCancelarFormulario
                    type="button"
                    onClick={voltarParaListagem}
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
              </FormularioCadastroPoloParceiro>
            )}
          </section>
        </AreaConteudo>
      </SecaoPrincipal>
    </ContainerPaginaCadastrarPoloParceiro>
  )
}
