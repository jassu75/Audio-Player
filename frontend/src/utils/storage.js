// A stale cache or blocked browser storage must not prevent the app from loading.
export const readStoredJson = (storage, key, fallback = null) => {
  try {
    const value = storage.getItem(key);
    return value === null ? fallback : JSON.parse(value) ?? fallback;
  } catch {
    return fallback;
  }
};

export const writeStoredJson = (storage, key, value) => {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // The in-memory Redux state still works when the cache is unavailable.
  }
};
