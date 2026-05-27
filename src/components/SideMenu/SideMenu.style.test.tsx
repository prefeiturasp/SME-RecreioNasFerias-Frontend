import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Aside, MenuContent } from './style'

describe('SideMenu styles', () => {
  it('renderiza Aside e MenuContent', () => {
    render(
      <Aside $isOpen>
        <MenuContent>
          <p>Menu</p>
        </MenuContent>
      </Aside>,
    )

    expect(screen.getByText(/menu/i)).toBeInTheDocument()
  })
})
