import { cva, type VariantProps } from 'class-variance-authority'
import { XIcon } from 'lucide-react'
import type { ComponentProps } from 'react'
import { Toast as ToastPrimitive } from 'radix-ui'

import { cn } from '@/lib/utils'

const ToastProvider = ToastPrimitive.Provider

function ToastViewport({
  className,
  ...props
}: ComponentProps<typeof ToastPrimitive.Viewport>) {
  return (
    <ToastPrimitive.Viewport
      data-slot="toast-viewport"
      className={cn(
        'fixed top-0 right-0 z-100 flex max-h-screen w-full flex-col gap-2 p-4 sm:max-w-md',
        className,
      )}
      {...props}
    />
  )
}

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-start justify-between gap-4 overflow-hidden rounded-md border p-4 pr-8 shadow-lg transition-all data-[state=closed]:animate-out data-[state=open]:animate-in data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full',
  {
    variants: {
      variant: {
        default: 'border-border bg-background text-foreground',
        success:
          'border-verde-medio bg-verde-claro text-verde-escuro [&_[data-slot=toast-description]]:text-verde-escuro',
        destructive:
          'border-destructive/40 bg-destructive text-white [&_[data-slot=toast-description]]:text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function Toast({
  className,
  variant,
  ...props
}: ComponentProps<typeof ToastPrimitive.Root> &
  VariantProps<typeof toastVariants>) {
  return (
    <ToastPrimitive.Root
      data-slot="toast"
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
}

function ToastAction({
  className,
  ...props
}: ComponentProps<typeof ToastPrimitive.Action>) {
  return (
    <ToastPrimitive.Action
      data-slot="toast-action"
      className={cn(
        'inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-secondary focus:ring-2 focus:ring-ring focus:outline-none disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

function ToastClose({
  className,
  ...props
}: ComponentProps<typeof ToastPrimitive.Close>) {
  return (
    <ToastPrimitive.Close
      data-slot="toast-close"
      className={cn(
        'absolute top-2 right-2 rounded-md p-1 text-current/70 opacity-0 transition-opacity group-hover:opacity-100 hover:text-current focus:opacity-100 focus:ring-2 focus:ring-ring focus:outline-none',
        className,
      )}
      toast-close=""
      {...props}
    >
      <XIcon className="size-4" aria-hidden="true" />
      <span className="sr-only">Fechar</span>
    </ToastPrimitive.Close>
  )
}

function ToastTitle({
  className,
  ...props
}: ComponentProps<typeof ToastPrimitive.Title>) {
  return (
    <ToastPrimitive.Title
      data-slot="toast-title"
      className={cn('text-sm font-bold', className)}
      {...props}
    />
  )
}

function ToastDescription({
  className,
  ...props
}: ComponentProps<typeof ToastPrimitive.Description>) {
  return (
    <ToastPrimitive.Description
      data-slot="toast-description"
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
}

type ToastProps = ComponentProps<typeof Toast>
type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  type ToastActionElement,
  type ToastProps,
}
