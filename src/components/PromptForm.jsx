import { useState } from 'react';
import Modal from './Modal.jsx';
import { useApp } from '../context/AppContext.jsx';
import { parseTags, wordCount } from '../utils/helpers.js';

export default function PromptForm({ prompt, defaultCategoryId }) {
  const { categories, savePrompt, closeModal } = useApp();
  const [f, setF] = useState(() => prompt
    ? { ...prompt, tags: (prompt.tags || []).join(', ') }
    : { title: '', description: '', content: '', categoryId: defaultCategoryId, tags: '' });
  const [errors, setErrors] = useState({});
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (!f.title.trim()) er.title = 'Title is required.';
    if (!f.content.trim()) er.content = 'Prompt content is required.';
    if (!f.categoryId) er.categoryId = 'Choose a category.';
    setErrors(er);
    if (Object.keys(er).length) return;
    savePrompt({ title: f.title.trim(), description: f.description.trim(), content: f.content, categoryId: f.categoryId, tags: parseTags(f.tags) }, prompt);
  };

  return (
    <Modal title={prompt ? 'Edit Prompt' : 'Create Prompt'} onClose={closeModal}>
      <form onSubmit={submit} noValidate>
        <div className="f">
          <label htmlFor="pt">Title *</label>
          <input id="pt" value={f.title} onChange={set('title')} aria-invalid={!!errors.title} placeholder="e.g. React Component Generator" />
          {errors.title && <div className="err" role="alert">{errors.title}</div>}
        </div>
        <div className="f">
          <label htmlFor="pc">Category *</label>
          <select id="pc" value={f.categoryId} onChange={set('categoryId')}>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          {errors.categoryId && <div className="err" role="alert">{errors.categoryId}</div>}
        </div>
        <div className="f">
          <label htmlFor="pd">Description</label>
          <input id="pd" value={f.description} onChange={set('description')} placeholder="Optional short summary" />
        </div>
        <div className="f">
          <label htmlFor="pb">Prompt content *</label>
          <textarea id="pb" rows="9" value={f.content} onChange={set('content')} aria-invalid={!!errors.content} placeholder="Write your prompt here…" />
          <div className="row between">
            {errors.content ? <div className="err" role="alert">{errors.content}</div> : <span />}
            <small className="muted">{wordCount(f.content)} words · {f.content.length} chars</small>
          </div>
        </div>
        <div className="f">
          <label htmlFor="pg">Tags</label>
          <input id="pg" value={f.tags} onChange={set('tags')} placeholder="Comma separated: React, Frontend" />
        </div>
        <div className="acts">
          <button type="button" className="btn" onClick={closeModal}>Cancel</button>
          <button type="submit" className="btn p">Save Prompt</button>
        </div>
      </form>
    </Modal>
  );
}
