import { useMutation } from '@tanstack/react-query'
import { login } from '@/services/autenticacao/login'

export function usePostLogin() {
  return useMutation({ mutationFn: login })
}

export default usePostLogin
