export const readStoredJson = <T,>(storage: Pick<Storage, "getItem">, key: string, fallback: T | null = null): T | null => {
    try {
        const value = storage.getItem(key);
        return value === null ? fallback : (JSON.parse(value) as T | null) ?? fallback;
    }
    catch {
        return fallback;
    }
};
export const writeStoredJson = (storage: Pick<Storage, "setItem">, key: string, value: unknown) => {
    try {
        storage.setItem(key, JSON.stringify(value));
    }
    catch {
        return;
    }
};
