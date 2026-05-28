import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ContentArea, MainStyled } from './style'

describe('Main styles', () => {
  it('renderiza MainStyled e ContentArea', () => {
    render(
      <MainStyled>
        <ContentArea>
          <p>Área principal</p>
        </ContentArea>
      </MainStyled>,
    )

    expect(screen.getByText(/área principal/i)).toBeInTheDocument()
  })
})
