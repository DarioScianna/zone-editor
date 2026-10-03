import { EditorProvider } from './components/EditorProvider.tsx'
import { MapView } from './components/MapView.tsx'
import { DrawControls } from './components/Sidebar/DrawControls.tsx'
import { ZoneList } from './components/Sidebar/ZoneList.tsx'
import { useDrawing } from './hooks/useDrawing.ts'

export function App() {
  return (
    <EditorProvider>
      <Editor />
    </EditorProvider>
  )
}

function Editor() {
  const drawing = useDrawing()

  return (
    <div className="layout">
      <header className="topbar">
        <h1>Zone editor</h1>
      </header>
      <main className="map-area" aria-label="Map">
        <MapView drawing={drawing} />
      </main>
      <aside className="sidebar" aria-label="Zones and checks">
        <h2>Zones</h2>
        <DrawControls drawing={drawing} />
        <ZoneList />
      </aside>
    </div>
  )
}
