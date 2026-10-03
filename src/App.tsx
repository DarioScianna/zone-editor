export function App() {
  return (
    <div className="layout">
      <header className="topbar">
        <h1>Zone editor</h1>
      </header>
      <main className="map-area" aria-label="Map">
        <p className="placeholder">Map coming soon.</p>
      </main>
      <aside className="sidebar" aria-label="Zones and checks">
        <h2>Zones</h2>
        <p className="muted">No zones yet.</p>
      </aside>
    </div>
  )
}
