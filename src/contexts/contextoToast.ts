import { createContext, type ReactNode } from 'react'

import type { ToastProps } from '@/components/ui/toast'

export type ToastMensagem = Pick<ToastProps, 'duration' | 'variant'> & {
  id: string
  title?: ReactNode
  description: ReactNode
}

export type ToastContextValue = {
  toasts: ToastMensagem[]
  showToast: (mensagem: ToastMensagem) => void
  dismissToast: (id: string) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)
