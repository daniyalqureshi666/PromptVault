import { Search, X } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

export default function SearchBar() {
  const { query, setQuery } = useApp();
  return (
    <div className="sb">
      <Search size={18} aria-hidden="true" />
      <input type="search" aria-label="Search prompts" placeholder="Search title, content, description, tags…" value={query} onChange={(e) => setQuery(e.target.value)} />
      {query && <button className="ib" aria-label="Clear search" onClick={() => setQuery('')}><X size={18} /></button>}
    </div>
  );
}
