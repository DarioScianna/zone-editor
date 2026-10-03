import { createContext, type Dispatch, useContext } from 'react'
import type { EditorAction, EditorState } from '../domain/editorState.ts'

export interface EditorContextValue {
  readonly state: EditorState
  readonly dispatch: Dispatch<EditorAction>
}

export const EditorContext = createContext<EditorContextValue | null>(null)

export function useEditor(): EditorContextValue {
  const value = useContext(EditorContext)
  if (value === null) {
    throw new Error('useEditor must be used inside EditorProvider')
  }
  return value
}
