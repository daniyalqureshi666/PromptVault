import { useApp } from '../context/AppContext.jsx';

export default function SortBar({ count }) {
  const { sort, setSort, query } = useApp();
  return (
    <div className="bar">
      <span aria-live="polite">{count} prompt{count === 1 ? '' : 's'}{query ? ` matching “${query}”` : ''}</span>
      <label>Sort{' '}
        <select aria-label="Sort prompts" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="created">Recently Created</option>
          <option value="updated">Recently Updated</option>
          <option value="az">Alphabetical (A–Z)</option>
          <option value="za">Alphabetical (Z–A)</option>
        </select>
      </label>
    </div>
  );
}
