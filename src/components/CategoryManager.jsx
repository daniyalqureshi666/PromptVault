import { useState } from 'react';
import { Check } from 'lucide-react';
import Modal from './Modal.jsx';
import ConfirmDialog from './ConfirmDialog.jsx';
import { useApp } from '../context/AppContext.jsx';
import { CategoryIcon } from '../utils/icons.jsx';
import { COLORS, ICON_KEYS, UNCATEGORIZED_ID } from '../utils/helpers.js';

export function CategoryForm({ category }) {
  const { isDuplicate, saveCategory, closeModal } = useApp();
  const [name, setName] = useState(category?.name || '');
  const [icon, setIcon] = useState(category?.icon || 'folder');
  const [color, setColor] = useState(category?.color || COLORS[0]);
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const v = name.trim();
    if (!v) return setError('Name is required.');
    if (isDuplicate(v, category?.id)) return setError('A category with this name already exists.');
    saveCategory({ name: v, icon, color }, category);
  };

  return (
    <Modal title={category ? 'Edit Category' : 'New Category'} onClose={closeModal}>
      <form onSubmit={submit} noValidate>
        <div className="f">
          <label htmlFor="cn">Name *</label>
          <input id="cn" value={name} onChange={(e) => { setName(e.target.value); setError(''); }} aria-invalid={!!error} placeholder="e.g. Machine Learning" />
          {error && <div className="err" role="alert">{error}</div>}
        </div>
        <div className="f">
          <label>Icon</label>
          <div className="sw" role="radiogroup" aria-label="Icon">
            {ICON_KEYS.map((k) => (
              <button type="button" key={k} role="radio" aria-checked={icon === k} aria-label={k} className={icon === k ? 'on' : ''} style={{ background: color }} onClick={() => setIcon(k)}><CategoryIcon name={k} size={16} /></button>
            ))}
          </div>
        </div>
        <div className="f">
          <label>Color</label>
          <div className="sw" role="radiogroup" aria-label="Color">
            {COLORS.map((c) => (
              <button type="button" key={c} role="radio" aria-checked={color === c} aria-label={c} className={color === c ? 'on' : ''} style={{ background: c }} onClick={() => setColor(c)}>{color === c && <Check size={16} />}</button>
            ))}
          </div>
        </div>
        <div className="acts">
          <button type="button" className="btn" onClick={closeModal}>Cancel</button>
          <button type="submit" className="btn p">Save Category</button>
        </div>
      </form>
    </Modal>
  );
}

export function DeleteCategoryDialog({ category }) {
  const { categories, counts, deleteCategory, closeModal } = useApp();
  const n = counts[category.id] || 0;
  const others = categories.filter((c) => c.id !== category.id);
  const [target, setTarget] = useState(UNCATEGORIZED_ID);

  if (n === 0) {
    return <ConfirmDialog title={`Delete “${category.name}”?`} message="This category is empty and will be removed." confirmLabel="Delete category" danger onConfirm={() => deleteCategory(category, 'move')} onClose={closeModal} />;
  }
  return (
    <Modal title={`Delete “${category.name}”?`} onClose={closeModal}>
      <p>This category contains <b>{n}</b> prompt{n > 1 ? 's' : ''}. What should happen to them?</p>
      <div className="f">
        <label htmlFor="mv">Move prompts to</label>
        <select id="mv" value={target} onChange={(e) => setTarget(e.target.value)}>
          {others.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div className="acts">
        <button className="btn" onClick={closeModal}>Cancel</button>
        <button className="btn" onClick={() => deleteCategory(category, 'move', target)}>Move &amp; delete category</button>
        <button className="btn d" onClick={() => deleteCategory(category, 'delete')}>Delete everything</button>
      </div>
    </Modal>
  );
}
