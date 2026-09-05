// Safe localStorage wrapper that gracefully handles SecurityError in sandboxed iframes,
// third-party cookie restrictions, and private browsing modes without throwing exceptions.

const inMemoryStore = new Map<string, string>();

let isLocalStorageAvailable = false;
try {
  if (typeof window !== 'undefined' && 'localStorage' in window) {
    const testKey = '__petcans_test_storage__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    isLocalStorageAvailable = true;
  }
} catch {
  isLocalStorageAvailable = false;
}

export const safeStorage = {
  getItem: (key: string): string | null => {
    if (isLocalStorageAvailable) {
      try {
        return window.localStorage.getItem(key);
      } catch {
        // Fallback to memory
      }
    }
    return inMemoryStore.get(key) ?? null;
  },

  setItem: (key: string, value: string): void => {
    if (isLocalStorageAvailable) {
      try {
        window.localStorage.setItem(key, value);
        return;
      } catch {
        // Fallback to memory
      }
    }
    inMemoryStore.set(key, value);
  },

  removeItem: (key: string): void => {
    if (isLocalStorageAvailable) {
      try {
        window.localStorage.removeItem(key);
        return;
      } catch {
        // Fallback to memory
      }
    }
    inMemoryStore.delete(key);
  },

  clear: (): void => {
    if (isLocalStorageAvailable) {
      try {
        window.localStorage.clear();
      } catch {
        // Fallback to memory
      }
    }
    inMemoryStore.clear();
  },
};
