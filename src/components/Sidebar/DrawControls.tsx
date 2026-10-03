import { MIN_VERTICES } from '../../domain/zone.ts'
import type { Drawing } from '../../hooks/useDrawing.ts'

export function DrawControls({ drawing }: { readonly drawing: Drawing }) {
  const { draft, start, finish, cancel } = drawing

  if (draft === null) {
    return (
      <button type="button" className="primary" onClick={start}>
        Draw zone
      </button>
    )
  }

  return (
    <div className="draw-controls">
      <p className="muted">
        Click the map to add vertices. Click the first vertex or press Enter to close, Esc to
        cancel.
      </p>
      <div className="button-row">
        <button
          type="button"
          className="primary"
          onClick={finish}
          disabled={draft.length < MIN_VERTICES}
        >
          Finish ({draft.length} vertices)
        </button>
        <button type="button" onClick={cancel}>
          Cancel
        </button>
      </div>
    </div>
  )
}
