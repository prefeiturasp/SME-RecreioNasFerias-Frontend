import { Alert, AlertDescription } from '@/components/ui/alert'
import { extrairMensagemDeErro } from '@/services/api/extrairMensagemDeErro'
import { cn } from '@/lib/utils'

export function AlertaErroApi({
  erro,
  className,
}: Readonly<{ erro?: unknown; className?: string }>) {
  const mensagem = extrairMensagemDeErro(erro)

  if (!mensagem) {
    return null
  }

  return (
    <Alert
      variant="destructive"
      className={cn(
        'border-rosa-medio bg-rosa-claro text-center font-bold text-vermelho-escuro',
        className,
      )}
    >
      <AlertDescription className="text-vermelho-escuro">
        {mensagem}
      </AlertDescription>
    </Alert>
  )
}
