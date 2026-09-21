import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast'
import { useToast } from '@/hooks/useToast'

export function Toaster() {
  const { dismissToast, toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, ...props }) => (
        <Toast
          key={id}
          open
          onOpenChange={(aberto) => {
            if (!aberto) dismissToast(id)
          }}
          {...props}
        >
          <div className="grid gap-1">
            {title ? <ToastTitle>{title}</ToastTitle> : null}
            {description ? (
              <ToastDescription>{description}</ToastDescription>
            ) : null}
          </div>
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  )
}
