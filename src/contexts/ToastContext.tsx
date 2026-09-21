import { useCallback, useMemo, useState, type ReactNode } from 'react'

import { ToastContext, type ToastMensagem } from './contextoToast'

function ToastProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [toasts, setToasts] = useState<ToastMensagem[]>([])

  const showToast = useCallback((mensagem: ToastMensagem) => {
    setToasts((toastsAtuais) => {
      const mensagemExistente = toastsAtuais.some(
        (toast) => toast.id === mensagem.id,
      )

      return mensagemExistente
        ? toastsAtuais.map((toast) =>
            toast.id === mensagem.id ? mensagem : toast,
          )
        : [...toastsAtuais, mensagem]
    })
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts((toastsAtuais) => toastsAtuais.filter((toast) => toast.id !== id))
  }, [])

  const value = useMemo(
    () => ({ toasts, showToast, dismissToast }),
    [dismissToast, showToast, toasts],
  )

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

export { ToastProvider }
