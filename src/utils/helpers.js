export const UNCATEGORIZED_ID = 'uncategorized';
export const COLORS = ['#6366F1', '#0EA5E9', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#8B5CF6', '#475569'];
export const ICON_KEYS = ['folder', 'code', 'brain', 'database', 'graduation', 'pen', 'briefcase', 'star'];

export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
export const nowISO = () => new Date().toISOString();

export const formatDate = (d) =>
  new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

export const wordCount = (s) => (s.trim() ? s.trim().split(/\s+/).length : 0);

export const parseTags = (s) => [...new Set(s.split(',').map((t) => t.trim()).filter(Boolean))];

export async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) return await navigator.clipboard.writeText(text);
    throw new Error('no clipboard api');
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    if (!ok) throw new Error('copy failed');
  }
}

export function downloadJSON(obj, filename) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

export const SORTS = {
  created: (a, b) => b.createdAt.localeCompare(a.createdAt),
  updated: (a, b) => b.updatedAt.localeCompare(a.updatedAt),
  az: (a, b) => a.title.localeCompare(b.title),
  za: (a, b) => b.title.localeCompare(a.title),
};
