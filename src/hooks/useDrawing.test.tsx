import type { LatLon } from '@darioscianna/zonekit'
import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { EditorProvider } from '../components/EditorProvider.tsx'
import { useDrawing } from './useDrawing.ts'
import { useEditor } from './useEditor.ts'

const A: LatLon = { lat: 45.464, lon: 9.188 }
const B: LatLon = { lat: 45.464, lon: 9.192 }
const C: LatLon = { lat: 45.467, lon: 9.192 }

function renderDrawing() {
  return renderHook(() => ({ drawing: useDrawing(), editor: useEditor() }), {
    wrapper: EditorProvider,
  })
}

function draw(result: ReturnType<typeof renderDrawing>['result'], positions: readonly LatLon[]) {
  act(() => result.current.drawing.start())
  for (const position of positions) {
    act(() => result.current.drawing.addVertex(position))
  }
}

describe('useDrawing', () => {
  it('turns the draft into a selected zone on finish', () => {
    const { result } = renderDrawing()
    draw(result, [A, B, C])

    act(() => result.current.drawing.finish())

    const { zones, selectedZoneId } = result.current.editor.state
    expect(zones).toHaveLength(1)
    expect(zones[0]?.positions).toEqual([A, B, C])
    expect(selectedZoneId).toBe(zones[0]?.id)
    expect(result.current.drawing.draft).toBeNull()
  })

  it('keeps drawing when finish is called with fewer than three vertices', () => {
    const { result } = renderDrawing()
    draw(result, [A, B])

    act(() => result.current.drawing.finish())

    expect(result.current.editor.state.zones).toEqual([])
    expect(result.current.drawing.draft).toEqual([A, B])
  })

  it('discards the draft on cancel', () => {
    const { result } = renderDrawing()
    draw(result, [A, B, C])

    act(() => result.current.drawing.cancel())

    expect(result.current.drawing.draft).toBeNull()
    expect(result.current.editor.state.zones).toEqual([])
  })

  it('ignores vertices outside draw mode', () => {
    const { result } = renderDrawing()

    act(() => result.current.drawing.addVertex(A))

    expect(result.current.drawing.draft).toBeNull()
  })
})
