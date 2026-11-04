import { UNCATEGORIZED_ID, nowISO, uid } from './helpers.js';

export const KEYS = { categories: 'pv.categories', prompts: 'pv.prompts', theme: 'pv.theme', init: 'pv.init' };

export function readJSON(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw == null ? undefined : JSON.parse(raw);
  } catch {
    return undefined; // missing or corrupted
  }
}

export function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or unavailable */
  }
}

export function buildSeed() {
  const t = nowISO();
  const c = (id, name, icon, color) => ({ id, name, icon, color, createdAt: t });
  const p = (title, description, categoryId, tags, content, isFavorite = false) => ({
    id: uid(), title, description, content, categoryId, tags, isFavorite, createdAt: t, updatedAt: t,
  });
  return {
    categories: [
      c(UNCATEGORIZED_ID, 'Uncategorized', 'folder', '#475569'),
      c('dev', 'Development', 'code', '#6366F1'),
      c('ai', 'Artificial Intelligence', 'brain', '#8B5CF6'),
      c('ds', 'Data Science', 'database', '#0EA5E9'),
      c('acad', 'Academic', 'graduation', '#10B981'),
      c('write', 'Writing', 'pen', '#EC4899'),
      c('biz', 'Business', 'briefcase', '#F59E0B'),
    ],
    prompts: [
      p('React Component Generator', 'Generate reusable React components.', 'dev', ['React', 'Frontend'],
        'Act as a senior React engineer. Create a reusable, accessible functional component for: [describe component].\nRequirements:\n- Hooks only, no class components\n- PropTypes or JSDoc for props\n- Keyboard accessible\nReturn the code followed by a short usage example.', true),
      p('Code Review Assistant', 'Structured review feedback.', 'dev', ['Review', 'Quality'],
        'Review the following code. List issues by severity (bug, risk, style), explain why each matters, and propose a concrete fix.\n\n[paste code]'),
      p('Explain Like a Tutor', 'Teach a concept step by step.', 'acad', ['Study'],
        'Explain [topic] to a university student. Start with an intuition, then the formal definition, a worked example, and 3 practice questions with answers at the end.'),
      p('Dataset EDA Plan', 'Exploratory analysis checklist.', 'ds', ['Python', 'Pandas'],
        'I have a dataset with columns: [columns]. Propose an exploratory data analysis plan: cleaning steps, key visualizations, hypotheses to test, and pandas code for each step.'),
      p('Blog Post Outliner', 'Turn an idea into an outline.', 'write', ['Content'],
        'Create a detailed outline for a blog post titled "[title]" aimed at [audience]. Include a hook, 5 sections with key points, and a call to action.'),
      p('Meeting Summary', 'Action-item focused summary.', 'biz', ['Productivity'],
        'Summarize these meeting notes into: decisions made, action items (owner + due date), and open questions.\n\n[notes]'),
      p('Prompt Improver', 'Refine any prompt.', 'ai', ['Meta'],
        'Rewrite the following prompt to be clearer and more specific. Add role, context, constraints, and output format. Explain what you changed.\n\n[prompt]', true),
    ],
  };
}

/** Runs once per browser: seeds demo data on first launch only, never overwrites existing data. */
export function bootstrap() {
  try {
    if (localStorage.getItem(KEYS.init)) return;
    const hasData = localStorage.getItem(KEYS.categories) != null || localStorage.getItem(KEYS.prompts) != null;
    if (!hasData) {
      const seed = buildSeed();
      writeJSON(KEYS.categories, seed.categories);
      writeJSON(KEYS.prompts, seed.prompts);
    }
    localStorage.setItem(KEYS.init, '1');
  } catch {
    /* ignore */
  }
}

export const validCategories = (v) => Array.isArray(v) && v.every((c) => c && typeof c.id === 'string' && typeof c.name === 'string');
export const validPrompts = (v) => Array.isArray(v) && v.every((p) => p && typeof p.id === 'string' && typeof p.title === 'string' && typeof p.content === 'string');
