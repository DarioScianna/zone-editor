import { useEditor } from '../../hooks/useEditor.ts'

export function ZoneList() {
  const { state, dispatch } = useEditor()

  if (state.zones.length === 0) {
    return <p className="muted">No zones yet.</p>
  }

  return (
    <ul className="zone-list">
      {state.zones.map((zone) => {
        const selected = zone.id === state.selectedZoneId
        return (
          <li key={zone.id} className={selected ? 'zone-item selected' : 'zone-item'}>
            <button
              type="button"
              className="zone-select"
              aria-pressed={selected}
              onClick={() => dispatch({ type: 'selectZone', zoneId: selected ? null : zone.id })}
            >
              <span className="swatch" style={{ background: zone.color }} aria-hidden="true" />
              <span>{zone.name}</span>
              <span className="muted">{zone.positions.length} vertices</span>
            </button>
            <button
              type="button"
              aria-label={`Delete ${zone.name}`}
              onClick={() => dispatch({ type: 'deleteZone', zoneId: zone.id })}
            >
              Delete
            </button>
          </li>
        )
      })}
    </ul>
  )
}
