import { useCallback } from 'react';
import { KEYS, validCategories } from '../utils/storage.js';
import { useLocalStorage } from './useLocalStorage.js';
import { UNCATEGORIZED_ID, nowISO, uid } from '../utils/helpers.js';

const DEFAULT_UNCAT = { id: UNCATEGORIZED_ID, name: 'Uncategorized', icon: 'folder', color: '#475569', createdAt: nowISO() };

export function useCategories() {
  const [stored, setCategories] = useLocalStorage(KEYS.categories, [DEFAULT_UNCAT], validCategories);
  const categories = stored.some((c) => c.id === UNCATEGORIZED_ID) ? stored : [DEFAULT_UNCAT, ...stored];

  const isDuplicate = useCallback(
    (name, ignoreId) => categories.some((c) => c.id !== ignoreId && c.name.toLowerCase() === name.trim().toLowerCase()),
    [categories]
  );

  const addCategory = useCallback((data) => {
    const cat = { ...data, id: uid(), createdAt: nowISO() };
    setCategories((cs) => [...cs, cat]);
    return cat;
  }, [setCategories]);

  const updateCategory = useCallback((id, data) => setCategories((cs) => cs.map((c) => (c.id === id ? { ...c, ...data } : c))), [setCategories]);
  const removeCategory = useCallback((id) => setCategories((cs) => cs.filter((c) => c.id !== id)), [setCategories]);

  return { categories, setCategories, isDuplicate, addCategory, updateCategory, removeCategory };
}
