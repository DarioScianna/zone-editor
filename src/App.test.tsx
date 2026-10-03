import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { App } from './App.tsx'

afterEach(cleanup)

describe('App', () => {
  it('renders the map area and the sidebar', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'Zone editor' })).toBeTruthy()
    expect(screen.getByRole('main', { name: 'Map' })).toBeTruthy()
    expect(screen.getByRole('complementary', { name: 'Zones and checks' })).toBeTruthy()
    expect(screen.getByText('No zones yet.')).toBeTruthy()
  })

  it('credits OpenStreetMap for the base map tiles', () => {
    render(<App />)

    const link = screen.getByRole('link', { name: 'OpenStreetMap' })
    expect(link.getAttribute('href')).toBe('https://www.openstreetmap.org/copyright')
  })

  it('enters and leaves draw mode from the sidebar', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'Draw zone' }))
    const finish = screen.getByRole('button', { name: 'Finish (0 vertices)' })
    expect(finish.hasAttribute('disabled')).toBe(true)

    fireEvent.keyDown(window, { key: 'Escape' })
    expect(screen.getByRole('button', { name: 'Draw zone' })).toBeTruthy()
  })
})
