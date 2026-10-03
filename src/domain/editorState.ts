import type { LatLon } from '@darioscianna/zonekit'
import { MIN_VERTICES, type Zone } from './zone.ts'

export interface EditorState {
  readonly zones: readonly Zone[]
  readonly selectedZoneId: string | null
}

export const initialEditorState: EditorState = {
  zones: [],
  selectedZoneId: null,
}

/**
 * Everything that can change the editor state.
 *
 * Vertex indices refer to `Zone.positions`. `addVertex` inserts before `index`,
 * so `index === positions.length` appends.
 */
export type EditorAction =
  | { readonly type: 'addZone'; readonly zone: Zone }
  | { readonly type: 'deleteZone'; readonly zoneId: string }
  | { readonly type: 'selectZone'; readonly zoneId: string | null }
  | {
      readonly type: 'addVertex'
      readonly zoneId: string
      readonly index: number
      readonly position: LatLon
    }
  | {
      readonly type: 'moveVertex'
      readonly zoneId: string
      readonly index: number
      readonly position: LatLon
    }
  | { readonly type: 'removeVertex'; readonly zoneId: string; readonly index: number }

/**
 * Applies an action to the state without mutating it.
 *
 * Actions that make no sense for the current state (unknown zone, index out of
 * range, a zone that would drop below MIN_VERTICES) return the same state
 * object, so React skips the re-render.
 */
export function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'addZone': {
      const { zone } = action
      if (zone.positions.length < MIN_VERTICES || findZone(state, zone.id) !== undefined) {
        return state
      }
      return { zones: [...state.zones, zone], selectedZoneId: zone.id }
    }

    case 'deleteZone': {
      if (findZone(state, action.zoneId) === undefined) {
        return state
      }
      return {
        zones: state.zones.filter((zone) => zone.id !== action.zoneId),
        selectedZoneId: state.selectedZoneId === action.zoneId ? null : state.selectedZoneId,
      }
    }

    case 'selectZone': {
      const { zoneId } = action
      if (zoneId === state.selectedZoneId) {
        return state
      }
      if (zoneId !== null && findZone(state, zoneId) === undefined) {
        return state
      }
      return { ...state, selectedZoneId: zoneId }
    }

    case 'addVertex':
      return updatePositions(state, action.zoneId, (positions) =>
        isIndexIn(action.index, positions.length + 1)
          ? positions.toSpliced(action.index, 0, action.position)
          : null,
      )

    case 'moveVertex':
      return updatePositions(state, action.zoneId, (positions) =>
        isIndexIn(action.index, positions.length)
          ? positions.with(action.index, action.position)
          : null,
      )

    case 'removeVertex':
      return updatePositions(state, action.zoneId, (positions) =>
        isIndexIn(action.index, positions.length) && positions.length > MIN_VERTICES
          ? positions.toSpliced(action.index, 1)
          : null,
      )

    default: {
      const unhandled: never = action
      return unhandled
    }
  }
}

function findZone(state: EditorState, zoneId: string): Zone | undefined {
  return state.zones.find((zone) => zone.id === zoneId)
}

function isIndexIn(index: number, length: number): boolean {
  return Number.isInteger(index) && index >= 0 && index < length
}

/** Replaces one zone's positions; `update` returns null to reject the change. */
function updatePositions(
  state: EditorState,
  zoneId: string,
  update: (positions: readonly LatLon[]) => readonly LatLon[] | null,
): EditorState {
  const zone = findZone(state, zoneId)
  if (zone === undefined) {
    return state
  }
  const positions = update(zone.positions)
  if (positions === null) {
    return state
  }
  return {
    ...state,
    zones: state.zones.map((other) => (other.id === zoneId ? { ...zone, positions } : other)),
  }
}
