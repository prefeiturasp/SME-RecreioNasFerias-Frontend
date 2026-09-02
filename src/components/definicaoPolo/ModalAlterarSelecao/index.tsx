import { useEffect, useState } from 'react'
import { AlertaErroApi } from '@/components/AlertaErroApi'
import { IndicadorCarregamento } from '@/components/IndicadorCarregamento'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

type ModalAlterarSelecaoProps = {
  aberto: boolean
  titulo: string
  descricao: string
  rotuloCampo: string
  idCampo: string
  textoOpcaoVazia: string
  opcoes: readonly { valor: string; rotulo: string }[]
  estaCarregandoOpcoes?: boolean
  mensagemCarregamento?: string
  estaSalvando?: boolean
  erro?: unknown
  onFechar: () => void
  onAlterar: (valor: string) => void
}

export function ModalAlterarSelecao({
  aberto,
  titulo,
  descricao,
  rotuloCampo,
  idCampo,
  textoOpcaoVazia,
  opcoes,
  estaCarregandoOpcoes = false,
  mensagemCarregamento = 'Carregando opções...',
  estaSalvando = false,
  erro,
  onFechar,
  onAlterar,
}: Readonly<ModalAlterarSelecaoProps>) {
  const [valorSelecionado, setValorSelecionado] = useState('')

  useEffect(() => {
    if (!aberto) {
      setValorSelecionado('')
    }
  }, [aberto])

  function handleOpenChange(open: boolean) {
    if (!open && !estaSalvando) {
      onFechar()
    }
  }

  return (
    <Dialog open={aberto} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={!estaSalvando}>
        <DialogHeader>
          <DialogTitle>{titulo}</DialogTitle>
          <DialogDescription>{descricao}</DialogDescription>
        </DialogHeader>

        {estaCarregandoOpcoes ? (
          <IndicadorCarregamento mensagem={mensagemCarregamento} />
        ) : (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={idCampo} className="font-bold">
              {rotuloCampo}
            </Label>
            <select
              id={idCampo}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={valorSelecionado}
              disabled={estaSalvando}
              onChange={(evento) => setValorSelecionado(evento.target.value)}
            >
              <option value="">{textoOpcaoVazia}</option>
              {opcoes.map((opcao) => (
                <option key={opcao.valor} value={opcao.valor}>
                  {opcao.rotulo}
                </option>
              ))}
            </select>
          </div>
        )}

        <AlertaErroApi erro={erro} />

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={estaSalvando}
            onClick={onFechar}
          >
            Fechar
          </Button>
          <Button
            type="button"
            disabled={
              !valorSelecionado || estaSalvando || estaCarregandoOpcoes
            }
            onClick={() => onAlterar(valorSelecionado)}
          >
            {estaSalvando ? 'Alterando...' : 'Alterar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
