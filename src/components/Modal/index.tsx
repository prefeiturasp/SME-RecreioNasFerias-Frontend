import type { ReactNode } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type ModalProps = {
  aberto: boolean
  titulo: string
  children: ReactNode
  acoes?: ReactNode
  exibirBotaoFechar?: boolean
  onOpenChange: (aberto: boolean) => void
}

export function Modal({
  aberto,
  titulo,
  children,
  acoes,
  exibirBotaoFechar = false,
  onOpenChange,
}: Readonly<ModalProps>) {
  return (
    <Dialog open={aberto} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={exibirBotaoFechar}>
        <DialogHeader>
          <DialogTitle>{titulo}</DialogTitle>
          {typeof children === 'string' ? (
            <DialogDescription>{children}</DialogDescription>
          ) : (
            children
          )}
        </DialogHeader>
        {acoes ? <DialogFooter>{acoes}</DialogFooter> : null}
      </DialogContent>
    </Dialog>
  )
}
