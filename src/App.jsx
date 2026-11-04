import { Plus } from 'lucide-react';
import { useApp } from './context/AppContext.jsx';
import Sidebar from './components/Sidebar.jsx';
import Toast from './components/Toast.jsx';
import PromptForm from './components/PromptForm.jsx';
import PromptPreview from './components/PromptPreview.jsx';
import ConfirmDialog from './components/ConfirmDialog.jsx';
import { CategoryForm, DeleteCategoryDialog } from './components/CategoryManager.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Favorites from './pages/Favorites.jsx';
import Settings from './pages/Settings.jsx';
import { UNCATEGORIZED_ID } from './utils/helpers.js';

function Modals() {
  const { modal, closeModal, view, categoryMap, removePrompt, toast, mergeImport } = useApp();
  if (!modal) return null;
  switch (modal.type) {
    case 'prompt': return <PromptForm defaultCategoryId={categoryMap[view] ? view : UNCATEGORIZED_ID} />;
    case 'edit': return <PromptForm prompt={modal.prompt} />;
    case 'view': return <PromptPreview promptId={modal.prompt.id} />;
    case 'delete':
      return <ConfirmDialog title="Delete prompt?" message={`“${modal.prompt.title}” will be permanently deleted.`} confirmLabel="Delete" danger onClose={closeModal}
        onConfirm={() => { removePrompt(modal.prompt.id); closeModal(); toast('Prompt deleted'); }} />;
    case 'category': return <CategoryForm category={modal.category} />;
    case 'deleteCategory': return <DeleteCategoryDialog category={modal.category} />;
    case 'import': {
      const { categories, prompts } = modal.data;
      return <ConfirmDialog title="Import data" confirmLabel="Merge import" onClose={closeModal} onConfirm={() => mergeImport(modal.data)}
        message={`This file has ${categories.length} categories and ${prompts.length} prompts. They will be merged into your library. Nothing existing will be overwritten.`} />;
    }
    default: return null;
  }
}

export default function App() {
  const { view, setModal } = useApp();
  return (
    <div className="app">
      <Sidebar />
      <main className="main">
        {view === 'settings' ? <Settings /> : view === 'fav' ? <Favorites /> : <Dashboard />}
      </main>
      <button className="btn p fab" onClick={() => setModal({ type: 'prompt' })}><Plus size={18} />Create Prompt</button>
      <Modals />
      <Toast />
    </div>
  );
}
