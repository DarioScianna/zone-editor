import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { App } from './App.tsx'

afterEach(cleanup)

describe('App', () => {
  it('renders the map area and the sidebar', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'Zone editor' })).toBeTruthy()
    expect(screen.getByRole('main', { name: 'Map' })).toBeTruthy()
    expect(screen.getByRole('complementary', { name: 'Zones and checks' })).toBeTruthy()
  })

  it('credits OpenStreetMap for the base map tiles', () => {
    render(<App />)

    const link = screen.getByRole('link', { name: 'OpenStreetMap' })
    expect(link.getAttribute('href')).toBe('https://www.openstreetmap.org/copyright')
  })
})
