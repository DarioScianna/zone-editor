import type { LatLon } from '@darioscianna/zonekit'
import type { PathOptions } from 'leaflet'
import { useEffect, useState } from 'react'
import { CircleMarker, Polyline, useMapEvents } from 'react-leaflet'
import { MIN_VERTICES } from '../domain/zone.ts'
import { fromLeaflet, toLeaflet } from './coordinates.ts'

const DRAFT_STYLE: PathOptions = { color: '#1d2228', weight: 2 }
const PREVIEW_STYLE: PathOptions = { ...DRAFT_STYLE, dashArray: '6 6' }

interface DrawToolProps {
  readonly draft: readonly LatLon[]
  readonly onAddVertex: (position: LatLon) => void
  readonly onFinish: () => void
  readonly onCancel: () => void
}

/**
 * Collects the vertices of a new zone: click to add, click the first vertex or
 * press Enter to close, Esc to cancel.
 */
export function DrawTool({ draft, onAddVertex, onFinish, onCancel }: DrawToolProps) {
  const [cursor, setCursor] = useState<LatLon | null>(null)

  const map = useMapEvents({
    click: (event) => onAddVertex(fromLeaflet(event.latlng)),
    mousemove: (event) => setCursor(fromLeaflet(event.latlng)),
    mouseout: () => setCursor(null),
  })

  // A quick second click would otherwise zoom in instead of adding a vertex.
  useEffect(() => {
    const container = map.getContainer()
    map.doubleClickZoom.disable()
    container.classList.add('leaflet-crosshair')
    return () => {
      map.doubleClickZoom.enable()
      container.classList.remove('leaflet-crosshair')
    }
  }, [map])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onCancel()
      } else if (event.key === 'Enter' && !isFormControl(event.target)) {
        // On a focused button, Enter already triggers that button.
        onFinish()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onFinish, onCancel])

  const first = draft[0]
  const last = draft.at(-1)
  const canClose = draft.length >= MIN_VERTICES

  // From the last vertex to the cursor and, once there is an edge, back to the first.
  const preview =
    cursor !== null && last !== undefined && first !== undefined
      ? [last, cursor, ...(draft.length > 1 ? [first] : [])]
      : []

  return (
    <>
      <Polyline positions={draft.map(toLeaflet)} pathOptions={DRAFT_STYLE} interactive={false} />
      <Polyline positions={preview.map(toLeaflet)} pathOptions={PREVIEW_STYLE} interactive={false} />
      {draft.slice(1).map((position, index) => (
        <CircleMarker
          // The draft only grows at the end, so the index identifies a vertex.
          key={index}
          center={toLeaflet(position)}
          radius={4}
          pathOptions={{ ...DRAFT_STYLE, fillColor: '#ffffff', fillOpacity: 1 }}
          interactive={false}
        />
      ))}
      {first !== undefined && (
        <CircleMarker
          center={toLeaflet(first)}
          radius={canClose ? 8 : 5}
          pathOptions={{ ...DRAFT_STYLE, fillColor: canClose ? '#2b8a3e' : '#ffffff', fillOpacity: 1 }}
          // Keeps the click from also reaching the map and adding a vertex.
          bubblingMouseEvents={false}
          eventHandlers={{ click: onFinish }}
        />
      )}
    </>
  )
}

function isFormControl(target: EventTarget | null): boolean {
  return target instanceof Element && target.closest('button, input, select, textarea') !== null
}
