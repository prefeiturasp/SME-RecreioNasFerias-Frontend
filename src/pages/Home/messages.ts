export function buildAccessDeniedMessage(userName: string) {
  const name = userName.trim() || 'usuário'

  return `Olá ${name}! Desculpe, mas o acesso ao Sistema de Gestão do Recreio nas Férias é restrito a perfis específicos. Entre em contato com o administrador.`
}
