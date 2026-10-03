import type { LatLon } from '@darioscianna/zonekit'

/** Fewer vertices than this would make a segment or a point, not a polygon. */
export const MIN_VERTICES = 3

/**
 * A named polygon on the map.
 *
 * The ring is closed implicitly: the first position is not repeated at the end,
 * which is the convention zonekit expects.
 */
export interface Zone {
  readonly id: string
  readonly name: string
  readonly color: string
  readonly positions: readonly LatLon[]
}

// Red is reserved for errors and overlaps, so no zone colour comes close to it.
export const ZONE_COLORS = ['#2f7de1', '#0c8599', '#7048e8', '#2b8a3e', '#9c6644'] as const

/** Builds a new zone with the first free "Zone N" name and the next palette colour. */
export function createZone(id: string, positions: readonly LatLon[], existing: readonly Zone[]): Zone {
  return {
    id,
    name: nextZoneName(existing),
    color: ZONE_COLORS[existing.length % ZONE_COLORS.length] ?? ZONE_COLORS[0],
    positions,
  }
}

function nextZoneName(zones: readonly Zone[]): string {
  const taken = new Set(zones.map((zone) => zone.name))
  let number = 1
  while (taken.has(`Zone ${number}`)) {
    number += 1
  }
  return `Zone ${number}`
}
