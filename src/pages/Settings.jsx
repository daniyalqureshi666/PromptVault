import { Download, Upload } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import Header from '../components/Header.jsx';

export default function Settings() {
  const { theme, setTheme, exportData, readImportFile } = useApp();
  return (
    <>
      <Header title="Settings" subtitle="Appearance and data backup." />
      <section className="panel">
        <h2>Appearance</h2>
        <div className="f" style={{ maxWidth: 260 }}>
          <label htmlFor="th">Theme</label>
          <select id="th" value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </section>
      <section className="panel">
        <h2>Backup</h2>
        <p className="muted">Export your library as JSON, or import a previous export. Imports are merged; existing prompts are never overwritten.</p>
        <div className="row wrap">
          <button className="btn" onClick={exportData}><Download size={18} />Export JSON</button>
          <label className="btn" style={{ cursor: 'pointer' }}>
            <Upload size={18} />Import JSON
            <input type="file" accept="application/json,.json" hidden onChange={(e) => { const f = e.target.files[0]; e.target.value = ''; if (f) readImportFile(f); }} />
          </label>
        </div>
      </section>
      <p className="muted">All data is stored locally in this browser (Local Storage).</p>
    </>
  );
}
