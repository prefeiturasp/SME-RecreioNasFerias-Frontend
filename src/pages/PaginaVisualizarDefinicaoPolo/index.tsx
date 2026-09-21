import { useNavigate, useParams } from 'react-router-dom'
import type { DetalheDefinicaoPolo } from '@/services/definicaoPolo/types'
import IconeSetaVoltar from '@/assets/icone-seta-voltar.png'
import { AlertaErroApi } from '@/components/AlertaErroApi'
import { Cabecalho } from '@/components/Cabecalho'
import { IndicadorCarregamento } from '@/components/IndicadorCarregamento'
import { MapaVisual } from '@/components/MapaVisual'
import { MenuLateral } from '@/components/MenuLateral'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { HistoricoDefinicaoPolo } from '@/components/definicaoPolo/HistoricoDefinicaoPolo'
import useGetDefinicaoPolo from '@/hooks/useGetDefinicaoPolo'

const NIVEIS_MAPA_VISUAL = [
  { rotulo: 'Início', caminho: '/inicio' },
  { rotulo: 'Cadastros' },
  { rotulo: 'Definição de Polos', caminho: '/definicoes-polo' },
  { rotulo: 'Detalhamento do Polo' },
] as const

export default function PaginaVisualizarDefinicaoPolo() {
  const navigate = useNavigate()
  const { uuidDefinicaoPolo } = useParams()
  const poloQuery = useGetDefinicaoPolo(uuidDefinicaoPolo)

  if (poloQuery.isPending) {
    return (
      <main className="flex h-full w-full overflow-hidden">
        <MenuLateral />
        <section className="flex h-screen min-w-0 flex-1 flex-col bg-main-background">
          <Cabecalho />
          <div className="min-h-0 flex-1 overflow-auto p-8 max-md:p-4">
            <IndicadorCarregamento />
          </div>
        </section>
      </main>
    )
  }

  if (poloQuery.isError) {
    return (
      <main className="flex h-full w-full overflow-hidden">
        <MenuLateral />
        <section className="flex h-screen min-w-0 flex-1 flex-col bg-main-background">
          <Cabecalho />
          <div className="min-h-0 flex-1 overflow-auto p-8 max-md:p-4">
            <AlertaErroApi erro={poloQuery.error} />
          </div>
        </section>
      </main>
    )
  }

  const polo: DetalheDefinicaoPolo = poloQuery.data

  return (
    <main className="flex h-full w-full overflow-hidden">
      <MenuLateral />

      <section className="flex h-screen min-w-0 flex-1 flex-col bg-main-background">
        <Cabecalho />

        <div className="min-h-0 flex-1 overflow-auto p-8 max-md:p-4">
          <MapaVisual niveis={[...NIVEIS_MAPA_VISUAL]} />

          <section>
            <div className="mt-8 mb-4 flex flex-wrap items-center justify-between gap-4 max-md:flex-col max-md:items-stretch">
              <h3 className="text-xl leading-tight font-bold text-foreground">
                Detalhamento do Polo
              </h3>

              <div className="flex flex-wrap items-center justify-end gap-2.5 max-md:flex-col max-md:items-stretch [&_button]:max-md:w-full">
                <Button
                  type="button"
                  variant="outline"
                  className="inline-flex h-9.5 items-center gap-2.5 rounded-sm border-brand-dark px-4 font-bold text-brand-dark hover:bg-accent hover:text-brand-dark"
                  aria-label="Voltar para definição de polos"
                  onClick={() => navigate('/definicoes-polo')}
                >
                  <img src={IconeSetaVoltar} alt="" aria-hidden="true" />
                  <span>Voltar</span>
                </Button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-sm">
              <FieldGroup>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Field>
                    <FieldLabel>Código EOL</FieldLabel>
                    <p className="text-sm text-foreground">
                      {polo.polo.codigo_eol}
                    </p>
                  </Field>

                  <Field>
                    <FieldLabel>Nome do Polo</FieldLabel>
                    <p className="text-sm text-foreground">
                      {polo.polo.nome_polo}
                    </p>
                  </Field>

                  <Field>
                    <FieldLabel>Nome da OSC</FieldLabel>
                    <p className="text-sm text-foreground">
                      {polo.polo.nome_osc}
                    </p>
                  </Field>

                  <Field>
                    <FieldLabel>DRE</FieldLabel>
                    <p className="text-sm text-foreground">
                      {polo.polo.dre_nome}
                    </p>
                  </Field>

                  <Field>
                    <FieldLabel>Tipo de UE</FieldLabel>
                    <p className="text-sm text-foreground">
                      {polo.polo.tipo_ue}
                    </p>
                  </Field>

                  <Field>
                    <FieldLabel>Tipo de Polo</FieldLabel>
                    <p className="text-sm text-foreground capitalize">
                      {polo.polo.tipo}
                    </p>
                  </Field>

                  <Field>
                    <FieldLabel>Status</FieldLabel>
                    <p className="text-sm text-foreground capitalize">
                      {polo.polo.status}
                    </p>
                  </Field>

                  <Field>
                    <FieldLabel>Gestão</FieldLabel>
                    <p className="text-sm text-foreground capitalize">
                      {polo.polo.gestao}
                    </p>
                  </Field>

                  <Field>
                    <FieldLabel>Quantidade Máxima de Alunos</FieldLabel>
                    <p className="text-sm text-foreground">
                      {polo.polo.quantidade_maxima_alunos}
                    </p>
                  </Field>

                  <Field>
                    <FieldLabel>CEP</FieldLabel>
                    <p className="text-sm text-foreground">{polo.polo.cep}</p>
                  </Field>

                  <Field>
                    <FieldLabel>Tipo de Logradouro</FieldLabel>
                    <p className="text-sm text-foreground">
                      {polo.polo.tipo_logradouro}
                    </p>
                  </Field>

                  <Field>
                    <FieldLabel>Logradouro</FieldLabel>
                    <p className="text-sm text-foreground">
                      {polo.polo.logradouro}
                    </p>
                  </Field>

                  <Field>
                    <FieldLabel>Bairro</FieldLabel>
                    <p className="text-sm text-foreground">
                      {polo.polo.bairro}
                    </p>
                  </Field>

                  <Field>
                    <FieldLabel>Número</FieldLabel>
                    <p className="text-sm text-foreground">
                      {polo.polo.numero}
                    </p>
                  </Field>

                  <Field>
                    <FieldLabel>Complemento</FieldLabel>
                    <p className="text-sm text-foreground">
                      {polo.polo.complemento || '-'}
                    </p>
                  </Field>

                  <Field>
                    <FieldLabel>Nome do Gestor</FieldLabel>
                    <p className="text-sm text-foreground">
                      {polo.polo.nome_gestor}
                    </p>
                  </Field>

                  <Field>
                    <FieldLabel>Email</FieldLabel>
                    <p className="text-sm text-foreground">{polo.polo.email}</p>
                  </Field>

                  <Field>
                    <FieldLabel>Telefone</FieldLabel>
                    <p className="text-sm text-foreground">
                      {polo.polo.telefone}
                    </p>
                  </Field>

                  <Field className="md:col-span-2">
                    <FieldLabel>Observações Gerais</FieldLabel>
                    <p className="text-sm text-foreground whitespace-pre-wrap">
                      {polo.polo.observacoes_gerais || '-'}
                    </p>
                  </Field>
                </div>
              </FieldGroup>

              {polo.polo.uuid && (
                <HistoricoDefinicaoPolo poloUuid={polo.polo.uuid} />
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}
