import { useApp } from '../context/AppContext.jsx';
import { useFilteredPrompts } from '../hooks/usePrompts.js';
import Header from '../components/Header.jsx';
import DashboardStats from '../components/DashboardStats.jsx';
import SearchBar from '../components/SearchBar.jsx';
import CategoryFilters from '../components/CategoryFilters.jsx';
import PromptGrid from '../components/PromptGrid.jsx';
import SortBar from '../components/SortBar.jsx';

export default function Dashboard() {
  const { prompts, view, query, sort, categoryMap } = useApp();
  const list = useFilteredPrompts(prompts, { view, query, sort });
  const h = new Date().getHours();
  const greet = h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
  const title = view === 'all' ? `${greet} 👋` : categoryMap[view]?.name || 'Prompts';
  return (
    <>
      <Header title={title} subtitle={view === 'all' ? 'Find and copy any prompt in seconds.' : `${list.length} prompt${list.length === 1 ? '' : 's'} in this category`} />
      <DashboardStats />
      <div className="top"><SearchBar /></div>
      <CategoryFilters />
      <SortBar count={list.length} />
      <PromptGrid list={list} />
    </>
  );
}
