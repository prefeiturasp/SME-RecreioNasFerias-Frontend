export function construirMensagemAcessoNegado(nomeUsuario: string) {
  const nome = nomeUsuario.trim() || 'usuário'

  return `Olá ${nome}! Desculpe, mas o acesso ao Sistema de Gestão do Recreio nas Férias é restrito a perfis específicos. Entre em contato com o administrador.`
}
