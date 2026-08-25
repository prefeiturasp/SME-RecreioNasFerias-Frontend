import { Alert, AlertDescription } from '@/components/ui/alert'
import { extrairMensagemDeErro } from '@/services/api/extrairMensagemDeErro'

export function AlertaErroApi({ erro }: Readonly<{ erro?: unknown }>) {
  const mensagem = extrairMensagemDeErro(erro)

  if (!mensagem) {
    return null
  }

  return (
    <Alert
      variant="destructive"
      className="border-rosa-medio bg-rosa-claro text-center font-bold text-vermelho-escuro"
    >
      <AlertDescription className="text-vermelho-escuro">
        {mensagem}
      </AlertDescription>
    </Alert>
  )
}
