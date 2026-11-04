import { useApp } from '../context/AppContext.jsx';

export default function DashboardStats() {
  const { prompts, categories, favoriteCount } = useApp();
  const items = [[prompts.length, 'Total prompts'], [categories.length, 'Categories'], [favoriteCount, 'Favorites']];
  return (
    <div className="stats">
      {items.map(([n, l]) => (
        <div className="stat" key={l}><b>{n}</b><span>{l}</span></div>
      ))}
    </div>
  );
}
