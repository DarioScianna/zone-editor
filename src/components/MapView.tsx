import 'leaflet/dist/leaflet.css'
import type { LatLngTuple } from 'leaflet'
import { MapContainer, TileLayer } from 'react-leaflet'
import type { Drawing } from '../hooks/useDrawing.ts'
import { DrawTool } from './DrawTool.tsx'
import { ZoneLayer } from './ZoneLayer.tsx'

const INITIAL_CENTER: LatLngTuple = [45.4642, 9.19]
const INITIAL_ZOOM = 15

// The OSM tile usage policy asks for the plain tile.openstreetmap.org host
// (no a/b/c subdomains) and a visible attribution.
const TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

export function MapView({ drawing }: { readonly drawing: Drawing }) {
  return (
    <MapContainer className="map" center={INITIAL_CENTER} zoom={INITIAL_ZOOM}>
      <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} maxZoom={19} />
      <ZoneLayer selectable={drawing.draft === null} />
      {drawing.draft !== null && (
        <DrawTool
          draft={drawing.draft}
          onAddVertex={drawing.addVertex}
          onFinish={drawing.finish}
          onCancel={drawing.cancel}
        />
      )}
    </MapContainer>
  )
}
