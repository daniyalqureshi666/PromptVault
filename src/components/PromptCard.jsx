import { memo, useEffect, useState } from 'react';
import { Copy, Eye, MoreVertical, Pencil, Star, Trash2 } from 'lucide-react';
import { CategoryIcon } from '../utils/icons.jsx';
import { formatDate } from '../utils/helpers.js';

const ACTIONS = [['view', Eye, 'View Prompt'], ['edit', Pencil, 'Edit Prompt'], ['duplicate', Copy, 'Duplicate Prompt'], ['delete', Trash2, 'Delete Prompt']];

function PromptCard({ prompt: p, category: c, onCopy, onFavorite, onAction }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [open]);
  const stop = (fn) => (e) => { e.stopPropagation(); fn(); };

  return (
    <article className="pc" onClick={() => onAction('view', p)}>
      <div className="row">
        <h3>{p.title}</h3>
        <button className={`ib${p.isFavorite ? ' fav' : ''}`} aria-pressed={p.isFavorite} aria-label={p.isFavorite ? 'Remove from favorites' : 'Add to favorites'} onClick={stop(() => onFavorite(p.id))}>
          <Star size={18} />
        </button>
        <div className="menu" onClick={(e) => e.stopPropagation()}>
          <button className="ib" aria-label="More options" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}><MoreVertical size={18} /></button>
          {open && (
            <div className="pop" role="menu">
              {ACTIONS.map(([key, Icon, label]) => (
                <button key={key} role="menuitem" className={key === 'delete' ? 'danger' : ''} onClick={() => { setOpen(false); onAction(key, p); }}><Icon size={16} />{label}</button>
              ))}
            </div>
          )}
        </div>
      </div>
      <span className="badge" style={{ background: c.color }}><CategoryIcon name={c.icon} size={12} />{c.name}</span>
      <div className="pv">{p.description || p.content}</div>
      {p.tags?.length > 0 && <div className="tags">{p.tags.map((t) => <span className="tag" key={t}>#{t}</span>)}</div>}
      <div className="foot">
        <span>Updated {formatDate(p.updatedAt)}</span>
        <button className="btn p" aria-label={`Copy ${p.title}`} onClick={stop(() => onCopy(p))}><Copy size={16} />Copy</button>
      </div>
    </article>
  );
}
export default memo(PromptCard);
