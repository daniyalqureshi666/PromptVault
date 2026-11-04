import { useEffect, useState } from 'react';
import { readJSON, writeJSON } from '../utils/storage.js';

/** useState that persists to Local Storage and falls back to `fallback` if data is missing/invalid. */
export function useLocalStorage(key, fallback, validate = () => true) {
  const [value, setValue] = useState(() => {
    const stored = readJSON(key);
    return stored !== undefined && validate(stored) ? stored : fallback;
  });
  useEffect(() => writeJSON(key, value), [key, value]);
  return [value, setValue];
}
