import type { ReactNode } from 'react'

import { Alert, AlertDescription } from '@/components/ui/alert'

type BlocoTextoProps = {
  children: ReactNode
}

export function BlocoTexto({ children }: Readonly<BlocoTextoProps>) {
  return (
    <Alert className="h-36 max-h-36 overflow-y-auto rounded-sm border-0 bg-[#c5d4d2] px-8 py-6">
      <AlertDescription className="text-sm text-foreground">
        {children}
      </AlertDescription>
    </Alert>
  )
}
