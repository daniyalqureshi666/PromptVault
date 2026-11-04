# PromptVault

Personal prompt management system. React + Vite, Local Storage only (no backend).

## Run
```
npm install
npm run dev      # development
npm run build    # production build in dist/
npm run preview
```

## Structure
- `src/context/AppContext.jsx` – global state (data, view, search, sort, modals, toasts, theme)
- `src/hooks/` – `useLocalStorage`, `usePrompts`, `useCategories`
- `src/utils/` – storage bootstrap/seed, helpers, icon map
- `src/components/` – UI building blocks
- `src/pages/` – Dashboard, Favorites, Settings

Data keys: `pv.categories`, `pv.prompts`, `pv.theme`, `pv.init`. Sample data is seeded only on first launch.
