import { useApp } from '../context/AppContext.jsx';
import { useFilteredPrompts } from '../hooks/usePrompts.js';
import Header from '../components/Header.jsx';
import SearchBar from '../components/SearchBar.jsx';
import SortBar from '../components/SortBar.jsx';
import PromptGrid from '../components/PromptGrid.jsx';

export default function Favorites() {
  const { prompts, query, sort } = useApp();
  const list = useFilteredPrompts(prompts, { view: 'fav', query, sort });
  return (
    <>
      <Header title="Favorites" subtitle="Your starred prompts, one click away." />
      <div className="top"><SearchBar /></div>
      <SortBar count={list.length} />
      <PromptGrid list={list} />
    </>
  );
}
