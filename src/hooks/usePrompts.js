import { useCallback, useMemo } from 'react';
import { KEYS, validPrompts } from '../utils/storage.js';
import { useLocalStorage } from './useLocalStorage.js';
import { SORTS, nowISO, uid } from '../utils/helpers.js';

export function usePrompts() {
  const [prompts, setPrompts] = useLocalStorage(KEYS.prompts, [], validPrompts);

  const addPrompt = useCallback((data) => {
    const t = nowISO();
    setPrompts((ps) => [{ ...data, id: uid(), isFavorite: false, createdAt: t, updatedAt: t }, ...ps]);
  }, [setPrompts]);

  const updatePrompt = useCallback((id, data) =>
    setPrompts((ps) => ps.map((p) => (p.id === id ? { ...p, ...data, updatedAt: nowISO() } : p))), [setPrompts]);

  const removePrompt = useCallback((id) => setPrompts((ps) => ps.filter((p) => p.id !== id)), [setPrompts]);

  const duplicatePrompt = useCallback((p) => {
    const t = nowISO();
    setPrompts((ps) => [{ ...p, id: uid(), title: `${p.title} (copy)`, isFavorite: false, createdAt: t, updatedAt: t }, ...ps]);
  }, [setPrompts]);

  const toggleFavorite = useCallback((id) =>
    setPrompts((ps) => ps.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p))), [setPrompts]);

  return { prompts, setPrompts, addPrompt, updatePrompt, removePrompt, duplicatePrompt, toggleFavorite };
}

/** Pure filter + search + sort. view: 'all' | 'fav' | categoryId */
export function useFilteredPrompts(prompts, { view, query, sort }) {
  return useMemo(() => {
    const q = query.trim().toLowerCase();
    return prompts
      .filter((p) => view === 'all' || (view === 'fav' ? p.isFavorite : p.categoryId === view))
      .filter((p) => !q || [p.title, p.content, p.description, (p.tags || []).join(' ')].join('\n').toLowerCase().includes(q))
      .sort(SORTS[sort] || SORTS.created);
  }, [prompts, view, query, sort]);
}
