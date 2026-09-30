export function calcularTotalInscritos(projecaoInscritos: number): number {
  if (!Number.isFinite(projecaoInscritos) || projecaoInscritos < 0) {
    return 0
  }

  return Math.floor(projecaoInscritos * 1.3)
}
