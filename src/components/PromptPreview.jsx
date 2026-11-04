import { Copy, Pencil, Star } from 'lucide-react';
import Modal from './Modal.jsx';
import { useApp } from '../context/AppContext.jsx';
import { CategoryIcon } from '../utils/icons.jsx';
import { UNCATEGORIZED_ID, formatDate } from '../utils/helpers.js';

export default function PromptPreview({ promptId }) {
  const { prompts, categoryMap, copyPrompt, toggleFavorite, setModal, closeModal } = useApp();
  const p = prompts.find((x) => x.id === promptId);
  if (!p) return null;
  const c = categoryMap[p.categoryId] || categoryMap[UNCATEGORIZED_ID];
  return (
    <Modal title={p.title} onClose={closeModal}>
      <span className="badge" style={{ background: c.color, marginBottom: 10 }}><CategoryIcon name={c.icon} size={12} />{c.name}</span>
      {p.description && <p className="muted" style={{ margin: '8px 0' }}>{p.description}</p>}
      <div className="full" tabIndex={0}>{p.content}</div>
      {p.tags?.length > 0 && <div className="tags" style={{ marginTop: 10 }}>{p.tags.map((t) => <span className="tag" key={t}>#{t}</span>)}</div>}
      <small className="muted" style={{ display: 'block', marginTop: 10 }}>Created {formatDate(p.createdAt)} · Updated {formatDate(p.updatedAt)}</small>
      <div className="acts">
        <button className="btn" onClick={() => toggleFavorite(p.id)}><Star size={18} className={p.isFavorite ? 'fav-icon' : ''} />{p.isFavorite ? 'Unfavorite' : 'Favorite'}</button>
        <button className="btn" onClick={() => setModal({ type: 'edit', prompt: p })}><Pencil size={18} />Edit</button>
        <button className="btn p" onClick={() => copyPrompt(p)}><Copy size={18} />Copy</button>
      </div>
    </Modal>
  );
}
