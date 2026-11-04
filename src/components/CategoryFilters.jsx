import { useApp } from '../context/AppContext.jsx';
import { UNCATEGORIZED_ID } from '../utils/helpers.js';

export default function CategoryFilters() {
  const { categories, counts, view, setView } = useApp();
  const tabs = [
    ['all', 'All Prompts'],
    ...categories.filter((c) => c.id !== UNCATEGORIZED_ID || counts[c.id]).map((c) => [c.id, c.name]),
    ['fav', 'Favorites'],
  ];
  return (
    <div className="chips" role="tablist" aria-label="Category filter">
      {tabs.map(([id, label]) => (
        <button key={id} role="tab" aria-selected={view === id} className={`chip${view === id ? ' on' : ''}`} onClick={() => setView(id)}>{label}</button>
      ))}
    </div>
  );
}
