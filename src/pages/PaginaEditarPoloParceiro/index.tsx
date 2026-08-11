import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type SubmitEvent,
} from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import IconeSetaVoltar from '../../assets/icone-seta-voltar.png'
import { CabecalhoPagina } from '@/components/shared/cabecalho-pagina'
import { IndicadorCarregamento } from '../../components/IndicadorCarregamento'
import { ChevronDownIcon } from '../../components/icons'
import { MapaVisual } from '../../components/MapaVisual'
import { MenuLateral } from '@/components/shared/menu-lateral'
import {
  atualizarPoloParceiro,
  ErroAtualizacaoPoloParceiro,
  ErroObterPoloParceiro,
  obterPoloParceiro,
} from '../../services/poloParceiro/api'
import {
  dadosCadastroSaoIguais,
  obterDadosCadastroFormulario,
  poloParaDadosFormulario,
} from '../../services/poloParceiro/obterDadosCadastroFormulario'
import type {
  DadosCadastroPoloParceiro,
  PoloParceiroDetalhado,
} from '../../services/poloParceiro/types'
import { OPCOES_STATUS_POLO_PARCEIRO } from '../../services/poloParceiro/types'
import { validarCadastroPoloParceiro } from '../../services/poloParceiro/validarCadastroPoloParceiro'
import { useOpcoesIntegracaoPolosParceiros } from '../../services/smeIntegracao/useOpcoesIntegracaoPolosParceiros'
import {
  aplicarMascaraCep,
  aplicarMascaraTelefone,
} from '../../utils/mascarasEntrada'
import { ModalConfirmacaoSalvarPoloParceiro } from './ModalConfirmacaoSalvarPoloParceiro'
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
  ContainerPaginaEditarPoloParceiro,
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
  { rotulo: 'Editar Polo Parceiro' },
] as const

export default function PaginaEditarPoloParceiro() {
  const navigate = useNavigate()
  const { idPolo } = useParams<{ idPolo: string }>()
  const [polo, setPolo] = useState<PoloParceiroDetalhado | null>(null)
  const [estaCarregandoPolo, setEstaCarregandoPolo] = useState(true)
  const [mensagemErro, setMensagemErro] = useState<string | null>(null)
  const [estaSalvando, setEstaSalvando] = useState(false)
  const [formularioAlterado, setFormularioAlterado] = useState(false)
  const [modalConfirmacaoAberto, setModalConfirmacaoAberto] = useState(false)
  const valoresIniciaisRef = useRef<DadosCadastroPoloParceiro | null>(null)
  const formularioRef = useRef<HTMLFormElement>(null)
  const {
    opcoesDre,
    opcoesTipoUe,
    estaCarregando: estaCarregandoOpcoes,
  } = useOpcoesIntegracaoPolosParceiros()

  const estaCarregando = estaCarregandoPolo || estaCarregandoOpcoes

  const voltarParaListagem = useCallback(
    () => navigate('/polos-parceiros'),
    [navigate],
  )

  useEffect(() => {
    if (!idPolo) {
      setEstaCarregandoPolo(false)
      setMensagemErro('Polo parceiro não encontrado.')
      return
    }

    setEstaCarregandoPolo(true)
    setMensagemErro(null)

    void obterPoloParceiro(idPolo)
      .then((poloCarregado) => {
        setPolo(poloCarregado)
      })
      .catch((error) => {
        setPolo(null)

        if (error instanceof ErroObterPoloParceiro) {
          setMensagemErro(error.mensagemUsuario)
          return
        }

        setMensagemErro('Não foi possível carregar o polo parceiro.')
      })
      .finally(() => {
        setEstaCarregandoPolo(false)
      })
  }, [idPolo])

  useEffect(() => {
    if (!polo) {
      valoresIniciaisRef.current = null
      setFormularioAlterado(false)
      return
    }

    valoresIniciaisRef.current = poloParaDadosFormulario(polo)
    setFormularioAlterado(false)
  }, [polo])

  const detectarAlteracaoFormulario = useCallback(
    (form: HTMLFormElement) => {
      if (!valoresIniciaisRef.current || !polo) return

      const dadosAtuais = obterDadosCadastroFormulario(form, polo.tipo)
      setFormularioAlterado(
        !dadosCadastroSaoIguais(dadosAtuais, valoresIniciaisRef.current),
      )
    },
    [polo],
  )

  const aplicarMascaraNoCampo = (
    evento: ChangeEvent<HTMLInputElement>,
    aplicarMascara: (valor: string) => string,
  ) => {
    evento.target.value = aplicarMascara(evento.target.value)

    const form = evento.currentTarget.form
    if (form) {
      detectarAlteracaoFormulario(form)
    }
  }

  const salvarPoloParceiro = (evento: SubmitEvent<HTMLFormElement>) => {
    evento.preventDefault()

    if (!polo) return

    const dadosCadastro = obterDadosCadastroFormulario(
      evento.currentTarget,
      polo.tipo,
    )
    const mensagemValidacao = validarCadastroPoloParceiro(dadosCadastro)

    if (mensagemValidacao) {
      setMensagemErro(mensagemValidacao)
      return
    }

    setMensagemErro(null)
    setModalConfirmacaoAberto(true)
  }

  const cancelarConfirmacaoSalvamento = useCallback(() => {
    setModalConfirmacaoAberto(false)
  }, [])

  const confirmarSalvamento = () => {
    setModalConfirmacaoAberto(false)

    if (!formularioRef.current) return

    void submeterEdicao(formularioRef.current)
  }

  async function submeterEdicao(form: HTMLFormElement) {
    if (!polo || !idPolo) return

    setMensagemErro(null)

    const dadosCadastro = obterDadosCadastroFormulario(form, polo.tipo)
    const mensagemValidacao = validarCadastroPoloParceiro(dadosCadastro)

    if (mensagemValidacao) {
      setMensagemErro(mensagemValidacao)
      return
    }

    setEstaSalvando(true)

    try {
      await atualizarPoloParceiro(idPolo, dadosCadastro)
      navigate('/polos-parceiros')
    } catch (error) {
      if (error instanceof ErroAtualizacaoPoloParceiro) {
        setMensagemErro(error.mensagemUsuario)
      }
    } finally {
      setEstaSalvando(false)
    }
  }

  return (
    <ContainerPaginaEditarPoloParceiro>
      <MenuLateral />
      <SecaoPrincipal>
        <CabecalhoPagina />
        <AreaConteudo>
          <MapaVisual niveis={[...NIVEIS_MAPA_VISUAL]} />
          <section>
            <CabecalhoAreaInternaConteudo>
              <h3>Editar Polo Parceiro</h3>
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

            {estaCarregando && (
              <IndicadorCarregamento mensagem="Carregando polo parceiro..." />
            )}

            {!estaCarregando && mensagemErro && !polo && (
              <MensagemErroFormulario role="alert">
                {mensagemErro}
              </MensagemErroFormulario>
            )}

            {polo && !estaCarregando && (
              <FormularioCadastroPoloParceiro
                ref={formularioRef}
                noValidate
                onSubmit={salvarPoloParceiro}
                onChange={(evento) =>
                  detectarAlteracaoFormulario(evento.currentTarget)
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

                  <LinhaFormularioDuasColunasPoloParceiro>
                    <CampoTextoFormularioPoloParceiro>
                      <label htmlFor="Tipo">Tipo</label>
                      <input
                        type="text"
                        name="Tipo"
                        id="Tipo"
                        value={polo.tipo}
                        readOnly
                        aria-readonly="true"
                      />
                    </CampoTextoFormularioPoloParceiro>
                    <CampoSeletorFormularioPoloParceiro>
                      <label htmlFor="Status">Status</label>
                      <div>
                        <select
                          name="Status"
                          id="Status"
                          defaultValue={polo.status}
                        >
                          <option value="">Selecione o status</option>
                          {OPCOES_STATUS_POLO_PARCEIRO.map((opcao) => (
                            <option key={opcao.valor} value={opcao.valor}>
                              {opcao.rotulo}
                            </option>
                          ))}
                        </select>
                        <ChevronDownIcon />
                      </div>
                    </CampoSeletorFormularioPoloParceiro>
                  </LinhaFormularioDuasColunasPoloParceiro>

                  <LinhaFormularioDuasColunasPoloParceiro>
                    <CampoTextoFormularioPoloParceiro>
                      <label htmlFor="NomeOsc">Nome da OSC</label>
                      <input
                        type="text"
                        name="NomeOsc"
                        id="NomeOsc"
                        placeholder="Digite o nome da OSC"
                        defaultValue={polo.nomeOsc}
                      />
                    </CampoTextoFormularioPoloParceiro>
                    <CampoTextoFormularioPoloParceiro>
                      <label htmlFor="NomePolo">Nome do Polo</label>
                      <input
                        type="text"
                        name="NomePolo"
                        id="NomePolo"
                        placeholder="Digite o nome do polo"
                        defaultValue={polo.nomePolo}
                      />
                    </CampoTextoFormularioPoloParceiro>
                  </LinhaFormularioDuasColunasPoloParceiro>

                  <LinhaFormularioTresColunasPoloParceiro>
                    <CampoSeletorFormularioPoloParceiro>
                      <label htmlFor="Dre">DRE</label>
                      <div>
                        <select name="Dre" id="Dre" defaultValue={polo.dre}>
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
                        <select
                          name="TipoUe"
                          id="TipoUe"
                          defaultValue={polo.tipoUe}
                        >
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
                        defaultValue={polo.quantidadeMaximaAlunos}
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
                        defaultValue={aplicarMascaraCep(polo.cep)}
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
                        defaultValue={polo.endereco}
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
                        defaultValue={polo.nomeGestor}
                      />
                    </CampoTextoFormularioPoloParceiro>
                    <CampoTextoFormularioPoloParceiro>
                      <label htmlFor="EmailPolo">E-mail do Polo</label>
                      <input
                        type="email"
                        name="EmailPolo"
                        id="EmailPolo"
                        placeholder="Digite o e-mail oficial do polo"
                        defaultValue={polo.emailPolo}
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
                        defaultValue={aplicarMascaraTelefone(polo.telefonePolo)}
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
                        defaultValue={polo.observacoesGerais}
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
                    disabled={estaSalvando || !formularioAlterado}
                  >
                    Salvar
                  </BotaoSalvarFormulario>
                </LinhaDeControlesFormularioCadastroNovaEdicao>
              </FormularioCadastroPoloParceiro>
            )}

            <ModalConfirmacaoSalvarPoloParceiro
              aberto={modalConfirmacaoAberto}
              onConfirmar={confirmarSalvamento}
              onCancelar={cancelarConfirmacaoSalvamento}
            />
          </section>
        </AreaConteudo>
      </SecaoPrincipal>
    </ContainerPaginaEditarPoloParceiro>
  )
}
