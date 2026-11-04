import { Check, X } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

export default function Toast() {
  const { toasts } = useApp();
  return (
    <div className="toasts" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div className="toast" key={t.id}>
          {t.ok ? <Check size={18} color="var(--ok)" /> : <X size={18} color="var(--danger)" />}
          {t.message}
        </div>
      ))}
    </div>
  );
}
