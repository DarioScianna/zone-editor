import { Polygon } from 'react-leaflet'
import { useEditor } from '../hooks/useEditor.ts'
import { toLeaflet } from './coordinates.ts'

interface ZoneLayerProps {
  /** False while drawing, so clicks on a zone go to the draw tool instead. */
  readonly selectable: boolean
}

export function ZoneLayer({ selectable }: ZoneLayerProps) {
  const { state, dispatch } = useEditor()

  return state.zones.map((zone) => {
    const selected = zone.id === state.selectedZoneId
    return (
      <Polygon
        key={zone.id}
        positions={zone.positions.map(toLeaflet)}
        pathOptions={{ color: zone.color, weight: selected ? 4 : 2, fillOpacity: selected ? 0.3 : 0.15 }}
        eventHandlers={
          selectable ? { click: () => dispatch({ type: 'selectZone', zoneId: zone.id }) } : {}
        }
      />
    )
  })
}
