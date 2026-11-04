import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useCategories } from '../hooks/useCategories.js';
import { usePrompts } from '../hooks/usePrompts.js';
import { KEYS, bootstrap, validCategories, validPrompts } from '../utils/storage.js';
import { UNCATEGORIZED_ID, copyText, downloadJSON, nowISO, uid } from '../utils/helpers.js';

bootstrap(); // seed demo data on first launch only (before hooks read storage)

const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

function initialTheme() {
  try {
    const t = localStorage.getItem(KEYS.theme);
    if (t === 'light' || t === 'dark') return t;
  } catch { /* ignore */ }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function AppProvider({ children }) {
  const cat = useCategories();
  const pr = usePrompts();
  const [view, setView] = useState('all'); // 'all' | 'fav' | 'settings' | categoryId
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('created');
  const [modal, setModal] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [drawer, setDrawer] = useState(false);
  const [theme, setTheme] = useState(initialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem(KEYS.theme, theme); } catch { /* ignore */ }
  }, [theme]);

  const toast = useCallback((message, ok = true) => {
    const id = uid();
    setToasts((t) => [...t, { id, message, ok }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2200);
  }, []);

  const counts = useMemo(() => {
    const o = {};
    pr.prompts.forEach((p) => { o[p.categoryId] = (o[p.categoryId] || 0) + 1; });
    return o;
  }, [pr.prompts]);

  const categoryMap = useMemo(() => Object.fromEntries(cat.categories.map((c) => [c.id, c])), [cat.categories]);
  const favoriteCount = useMemo(() => pr.prompts.filter((p) => p.isFavorite).length, [pr.prompts]);

  const copyPrompt = useCallback((p) =>
    copyText(p.content).then(() => toast('Copied!')).catch(() => toast('Copy failed. Select the text manually.', false)), [toast]);

  const savePrompt = (data, existing) => {
    if (existing) { pr.updatePrompt(existing.id, data); toast('Prompt updated'); }
    else { pr.addPrompt(data); toast('Prompt saved'); }
    setModal(null);
  };

  const saveCategory = (data, existing) => {
    if (existing) cat.updateCategory(existing.id, data);
    else setView(cat.addCategory(data).id);
    toast('Category saved');
    setModal(null);
  };

  /** mode: 'move' (to targetId) or 'delete' (delete its prompts too) */
  const deleteCategory = (c, mode, targetId = UNCATEGORIZED_ID) => {
    pr.setPrompts((ps) => (mode === 'move' ? ps.map((p) => (p.categoryId === c.id ? { ...p, categoryId: targetId } : p)) : ps.filter((p) => p.categoryId !== c.id)));
    cat.removeCategory(c.id);
    if (view === c.id) setView('all');
    toast('Category deleted');
    setModal(null);
  };

  const exportData = () => {
    downloadJSON({ app: 'PromptVault', version: 1, exportedAt: nowISO(), categories: cat.categories, prompts: pr.prompts }, 'promptvault-export.json');
    toast('Exported JSON');
  };

  const readImportFile = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const j = JSON.parse(reader.result);
        const cats = j.categories ?? j.cats;
        if (!validCategories(cats) || !Array.isArray(j.prompts) || !j.prompts.every((p) => p && typeof p.title === 'string' && typeof p.content === 'string')) throw new Error('bad');
        setModal({ type: 'import', data: { categories: cats, prompts: j.prompts } });
      } catch { toast('Invalid PromptVault file', false); }
    };
    reader.onerror = () => toast('Could not read file', false);
    reader.readAsText(file);
  };

  /** Merge: categories matched by name, prompts always get new ids. Nothing existing is overwritten. */
  const mergeImport = ({ categories, prompts }) => {
    const idMap = {};
    const added = [];
    categories.forEach((c) => {
      const existing = [...cat.categories, ...added].find((x) => x.name.toLowerCase() === c.name.toLowerCase());
      if (existing) idMap[c.id] = existing.id;
      else {
        const nc = { icon: 'folder', color: '#6366F1', createdAt: nowISO(), ...c, id: uid() };
        idMap[c.id] = nc.id; added.push(nc);
      }
    });
    cat.setCategories((cs) => [...cs, ...added]);
    const t = nowISO();
    const imported = prompts.map((p) => ({ description: '', tags: [], isFavorite: false, createdAt: t, updatedAt: t, ...p, id: uid(), categoryId: idMap[p.categoryId] || UNCATEGORIZED_ID }));
    pr.setPrompts((ps) => [...imported, ...ps]);
    toast(`Imported ${imported.length} prompt${imported.length === 1 ? '' : 's'}`);
    setModal(null);
  };

  const value = {
    ...cat, ...pr, view, setView, query, setQuery, sort, setSort, modal, setModal, closeModal: () => setModal(null),
    toasts, toast, drawer, setDrawer, theme, toggleTheme: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), setTheme,
    counts, categoryMap, favoriteCount, copyPrompt, savePrompt, saveCategory, deleteCategory, exportData, readImportFile, mergeImport,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
