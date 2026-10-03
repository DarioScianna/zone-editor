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
