import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CardModulo } from './style'

describe('CartaoModulo styles', () => {
  it('renderiza CardModulo', () => {
    render(
      <CardModulo type="button">
        <span>Card módulo</span>
      </CardModulo>,
    )

    expect(
      screen.getByRole('button', { name: /card módulo/i }),
    ).toBeInTheDocument()
  })
})
