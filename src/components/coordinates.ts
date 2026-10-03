import type { LatLon } from '@darioscianna/zonekit'
import type { LatLng, LatLngTuple } from 'leaflet'

// Leaflet calls longitude `lng`, zonekit calls it `lon`: convert only at the map boundary.

export function fromLeaflet({ lat, lng }: LatLng): LatLon {
  return { lat, lon: lng }
}

export function toLeaflet({ lat, lon }: LatLon): LatLngTuple {
  return [lat, lon]
}
