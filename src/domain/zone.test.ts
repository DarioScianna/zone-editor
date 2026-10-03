import type { LatLon } from '@darioscianna/zonekit'
import { describe, expect, it } from 'vitest'
import { createZone, ZONE_COLORS, type Zone } from './zone.ts'

const positions: readonly LatLon[] = [
  { lat: 45.464, lon: 9.188 },
  { lat: 45.464, lon: 9.192 },
  { lat: 45.467, lon: 9.192 },
]

function named(name: string): Zone {
  return { id: name, name, color: ZONE_COLORS[0], positions }
}

describe('createZone', () => {
  it('names the first zone "Zone 1" with the first palette colour', () => {
    expect(createZone('a', positions, [])).toEqual({
      id: 'a',
      name: 'Zone 1',
      color: ZONE_COLORS[0],
      positions,
    })
  })

  it('picks the first free name, so deleted names are reused', () => {
    const existing = [named('Zone 1'), named('Zone 3')]

    expect(createZone('b', positions, existing).name).toBe('Zone 2')
  })

  it('cycles through the palette', () => {
    const existing = ZONE_COLORS.map((_, index) => named(`Zone ${index + 1}`))

    expect(createZone('c', positions, existing).color).toBe(ZONE_COLORS[0])
  })
})
