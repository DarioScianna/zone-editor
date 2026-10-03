import { type ReactNode, useMemo, useReducer } from 'react'
import { editorReducer, initialEditorState } from '../domain/editorState.ts'
import { EditorContext } from '../hooks/useEditor.ts'

export function EditorProvider({ children }: { readonly children: ReactNode }) {
  const [state, dispatch] = useReducer(editorReducer, initialEditorState)
  const value = useMemo(() => ({ state, dispatch }), [state])

  return <EditorContext value={value}>{children}</EditorContext>
}
