import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { IndicadorCargaPolos } from './index'

describe('IndicadorCargaPolos', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('exibe texto fixo e barra de progresso simulada', () => {
    render(<IndicadorCargaPolos />)

    expect(
      screen.getByText('Carregando polos da rede...'),
    ).toBeInTheDocument()
    expect(screen.queryByText(/%/)).not.toBeInTheDocument()

    const barra = screen.getByRole('progressbar', {
      name: /progresso do carregamento dos polos/i,
    })
    expect(barra).toHaveAttribute('aria-valuenow', '0')

    act(() => {
      vi.advanceTimersByTime(400)
    })

    expect(barra).not.toHaveAttribute('aria-valuenow', '0')
    expect(
      screen.getByText('Carregando polos da rede...'),
    ).toBeInTheDocument()
  })

  it('não ultrapassa 90% enquanto a carga continua ativa', () => {
    render(<IndicadorCargaPolos />)

    act(() => {
      vi.advanceTimersByTime(60_000)
    })

    const barra = screen.getByRole('progressbar', {
      name: /progresso do carregamento dos polos/i,
    })
    const valor = Number(barra.getAttribute('aria-valuenow'))

    expect(valor).toBeLessThanOrEqual(90)
  })
})
