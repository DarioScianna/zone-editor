import type { LatLon } from '@darioscianna/zonekit'
import { useCallback, useState } from 'react'
import { createZone, MIN_VERTICES } from '../domain/zone.ts'
import { useEditor } from './useEditor.ts'

export interface Drawing {
  /** Vertices of the polygon being drawn, or null when not in draw mode. */
  readonly draft: readonly LatLon[] | null
  readonly start: () => void
  readonly addVertex: (position: LatLon) => void
  /** Turns the draft into a zone; does nothing below MIN_VERTICES. */
  readonly finish: () => void
  readonly cancel: () => void
}

/**
 * Draw mode state.
 *
 * The draft is kept out of EditorState on purpose: it is transient UI state and
 * only becomes part of the document when it is closed into a zone.
 */
export function useDrawing(): Drawing {
  const { state, dispatch } = useEditor()
  const [draft, setDraft] = useState<readonly LatLon[] | null>(null)

  const start = useCallback(() => setDraft([]), [])
  const cancel = useCallback(() => setDraft(null), [])

  const addVertex = useCallback((position: LatLon) => {
    setDraft((current) => (current === null ? null : [...current, position]))
  }, [])

  const finish = useCallback(() => {
    if (draft === null || draft.length < MIN_VERTICES) {
      return
    }
    dispatch({ type: 'addZone', zone: createZone(crypto.randomUUID(), draft, state.zones) })
    setDraft(null)
  }, [draft, dispatch, state.zones])

  return { draft, start, addVertex, finish, cancel }
}
