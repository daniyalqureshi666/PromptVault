import { Plus, Search } from 'lucide-react';
import PromptCard from './PromptCard.jsx';
import { useApp } from '../context/AppContext.jsx';
import { UNCATEGORIZED_ID } from '../utils/helpers.js';

export default function PromptGrid({ list }) {
  const { categoryMap, copyPrompt, toggleFavorite, duplicatePrompt, setModal, toast, query, setQuery, prompts } = useApp();

  const onAction = (action, p) => {
    if (action === 'duplicate') { duplicatePrompt(p); toast('Prompt duplicated'); }
    else setModal({ type: action, prompt: p });
  };

  if (!list.length) {
    return (
      <div className="empty">
        <Search size={36} />
        <h3>{query ? 'No prompts match your search' : prompts.length ? 'Nothing here yet' : 'Your vault is empty'}</h3>
        <p>{query ? 'Try different keywords or clear the search.' : 'Create a prompt to get started.'}</p>
        {query
          ? <button className="btn" onClick={() => setQuery('')}>Clear search</button>
          : <button className="btn p" onClick={() => setModal({ type: 'prompt' })}><Plus size={18} />Create Prompt</button>}
      </div>
    );
  }
  return (
    <div className="grid">
      {list.map((p) => (
        <PromptCard key={p.id} prompt={p} category={categoryMap[p.categoryId] || categoryMap[UNCATEGORIZED_ID]} onCopy={copyPrompt} onFavorite={toggleFavorite} onAction={onAction} />
      ))}
    </div>
  );
}
