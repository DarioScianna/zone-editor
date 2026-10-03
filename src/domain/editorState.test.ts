import type { LatLon } from '@darioscianna/zonekit'
import { describe, expect, it } from 'vitest'
import { type EditorState, editorReducer, initialEditorState } from './editorState.ts'
import type { Zone } from './zone.ts'

const A: LatLon = { lat: 45.464, lon: 9.188 }
const B: LatLon = { lat: 45.464, lon: 9.192 }
const C: LatLon = { lat: 45.467, lon: 9.192 }
const D: LatLon = { lat: 45.467, lon: 9.188 }
const P: LatLon = { lat: 45.4655, lon: 9.195 }

// Frozen so that any mutation inside the reducer throws instead of passing silently.
function zone(id: string, positions: readonly LatLon[]): Zone {
  return Object.freeze({
    id,
    name: `Zone ${id}`,
    color: '#2f7de1',
    positions: Object.freeze([...positions]),
  })
}

function state(zones: readonly Zone[], selectedZoneId: string | null = null): EditorState {
  return Object.freeze({ zones: Object.freeze([...zones]), selectedZoneId })
}

const triangle = zone('t', [A, B, C])
const square = zone('s', [A, B, C, D])

function positionsOf(result: EditorState, zoneId: string): readonly LatLon[] | undefined {
  return result.zones.find((z) => z.id === zoneId)?.positions
}

describe('editorReducer', () => {
  describe('addZone', () => {
    it('appends the zone and selects it', () => {
      const result = editorReducer(state([square]), { type: 'addZone', zone: triangle })

      expect(result.zones).toEqual([square, triangle])
      expect(result.selectedZoneId).toBe('t')
    })

    it('rejects a zone with fewer than three vertices', () => {
      const before = state([])

      expect(editorReducer(before, { type: 'addZone', zone: zone('x', [A, B]) })).toBe(before)
    })

    it('rejects a duplicate id', () => {
      const before = state([triangle])

      expect(editorReducer(before, { type: 'addZone', zone: zone('t', [A, B, C, D]) })).toBe(
        before,
      )
    })
  })

  describe('deleteZone', () => {
    it('removes the zone and keeps an unrelated selection', () => {
      const result = editorReducer(state([triangle, square], 's'), {
        type: 'deleteZone',
        zoneId: 't',
      })

      expect(result.zones).toEqual([square])
      expect(result.selectedZoneId).toBe('s')
    })

    it('clears the selection when the selected zone is deleted', () => {
      const result = editorReducer(state([triangle], 't'), { type: 'deleteZone', zoneId: 't' })

      expect(result).toEqual(initialEditorState)
    })

    it('ignores an unknown zone', () => {
      const before = state([triangle])

      expect(editorReducer(before, { type: 'deleteZone', zoneId: 'nope' })).toBe(before)
    })
  })

  describe('selectZone', () => {
    it('selects an existing zone and clears the selection with null', () => {
      const selected = editorReducer(state([triangle]), { type: 'selectZone', zoneId: 't' })
      expect(selected.selectedZoneId).toBe('t')

      const cleared = editorReducer(selected, { type: 'selectZone', zoneId: null })
      expect(cleared.selectedZoneId).toBeNull()
    })

    it('returns the same state for an unknown zone or the current selection', () => {
      const before = state([triangle], 't')

      expect(editorReducer(before, { type: 'selectZone', zoneId: 'nope' })).toBe(before)
      expect(editorReducer(before, { type: 'selectZone', zoneId: 't' })).toBe(before)
    })
  })

  describe('addVertex', () => {
    it('inserts before the given index', () => {
      const result = editorReducer(state([triangle]), {
        type: 'addVertex',
        zoneId: 't',
        index: 1,
        position: P,
      })

      expect(positionsOf(result, 't')).toEqual([A, P, B, C])
    })

    it('appends when the index equals the vertex count', () => {
      const result = editorReducer(state([triangle]), {
        type: 'addVertex',
        zoneId: 't',
        index: 3,
        position: P,
      })

      expect(positionsOf(result, 't')).toEqual([A, B, C, P])
    })

    it.each([-1, 4, 1.5])('ignores index %s', (index) => {
      const before = state([triangle])

      expect(editorReducer(before, { type: 'addVertex', zoneId: 't', index, position: P })).toBe(
        before,
      )
    })
  })

  describe('moveVertex', () => {
    it('replaces only the given vertex and leaves other zones untouched', () => {
      const result = editorReducer(state([triangle, square]), {
        type: 'moveVertex',
        zoneId: 's',
        index: 2,
        position: P,
      })

      expect(positionsOf(result, 's')).toEqual([A, B, P, D])
      expect(result.zones[0]).toBe(triangle)
    })

    it.each([-1, 4])('ignores index %s', (index) => {
      const before = state([square])

      expect(editorReducer(before, { type: 'moveVertex', zoneId: 's', index, position: P })).toBe(
        before,
      )
    })
  })

  describe('removeVertex', () => {
    it('removes the vertex at the given index', () => {
      const result = editorReducer(state([square]), { type: 'removeVertex', zoneId: 's', index: 0 })

      expect(positionsOf(result, 's')).toEqual([B, C, D])
    })

    it('never drops a zone below three vertices', () => {
      const before = state([triangle])

      expect(editorReducer(before, { type: 'removeVertex', zoneId: 't', index: 0 })).toBe(before)
    })

    it.each([-1, 4])('ignores index %s', (index) => {
      const before = state([square])

      expect(editorReducer(before, { type: 'removeVertex', zoneId: 's', index })).toBe(before)
    })
  })

  it('ignores vertex actions on an unknown zone', () => {
    const before = state([triangle])

    expect(
      editorReducer(before, { type: 'moveVertex', zoneId: 'nope', index: 0, position: P }),
    ).toBe(before)
  })
})
