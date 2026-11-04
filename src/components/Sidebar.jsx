import { LayoutDashboard, Folder, Star, Settings, Plus, Pencil, Trash2, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { CategoryIcon } from '../utils/icons.jsx';
import { UNCATEGORIZED_ID } from '../utils/helpers.js';

export default function Sidebar() {
  const { categories, counts, prompts, favoriteCount, view, setView, setModal, drawer, setDrawer } = useApp();
  const go = (v) => { setView(v); setDrawer(false); };
  const NavBtn = ({ id, icon: Icon, label, count }) => (
    <button className={`nav${view === id ? ' on' : ''}`} aria-current={view === id ? 'page' : undefined} onClick={() => go(id)}>
      <Icon size={18} /><span className="t">{label}</span>{count != null && <span className="n">{count}</span>}
    </button>
  );
  return (
    <>
      <aside className={`side${drawer ? ' open' : ''}`} aria-label="Sidebar">
        <div className="logo"><i><Lock size={18} /></i>PromptVault</div>
        <NavBtn id="all" icon={LayoutDashboard} label="Dashboard" />
        <NavBtn id="all" icon={Folder} label="All Prompts" count={prompts.length} />
        <NavBtn id="fav" icon={Star} label="Favorites" count={favoriteCount} />
        <div className="lbl">
          Categories
          <button className="ib" aria-label="Create category" onClick={() => setModal({ type: 'category' })}><Plus size={15} /></button>
        </div>
        {categories.map((c) => (
          <div className="cat" key={c.id}>
            <button className={`nav${view === c.id ? ' on' : ''}`} aria-current={view === c.id ? 'page' : undefined} onClick={() => go(c.id)}>
              <span className="dot" style={{ background: c.color }}><CategoryIcon name={c.icon} /></span>
              <span className="t">{c.name}</span><span className="n">{counts[c.id] || 0}</span>
            </button>
            {c.id !== UNCATEGORIZED_ID && (
              <>
                <button className="ib mini" aria-label={`Edit ${c.name}`} onClick={() => setModal({ type: 'category', category: c })}><Pencil size={14} /></button>
                <button className="ib mini" aria-label={`Delete ${c.name}`} onClick={() => setModal({ type: 'deleteCategory', category: c })}><Trash2 size={14} /></button>
              </>
            )}
          </div>
        ))}
        <button className="btn" style={{ marginTop: 10 }} onClick={() => setModal({ type: 'category' })}><Plus size={18} />Create Category</button>
        <div style={{ flex: 1 }} />
        <NavBtn id="settings" icon={Settings} label="Settings" />
      </aside>
      {drawer && <div className="sc" onClick={() => setDrawer(false)} />}
    </>
  );
}
