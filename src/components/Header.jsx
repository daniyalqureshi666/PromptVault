import { Menu, Moon, Plus, Sun } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

export default function Header({ title, subtitle }) {
  const { setDrawer, setModal, theme, toggleTheme } = useApp();
  return (
    <div className="top">
      <button className="ib mb" aria-label="Open menu" onClick={() => setDrawer(true)}><Menu size={20} /></button>
      <div className="grow">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <button className="btn" onClick={() => setModal({ type: 'category' })}><Plus size={18} />New Category</button>
      <button className="btn" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} onClick={toggleTheme}>
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </div>
  );
}
