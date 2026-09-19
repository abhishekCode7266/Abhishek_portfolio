// Client-side persistent storage using IndexedDB with fallback to localStorage
const DB_NAME = 'portfolio_db';
const STORE_NAME = 'portfolio_store';
const DB_VERSION = 1;

function getIDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported'));
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveToStorage<T>(key: string, data: T): Promise<void> {
  if (typeof window === 'undefined') return;

  // 1. Try IndexedDB first (huge storage limit, easily handles 20+ certificates)
  try {
    const db = await getIDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(data, key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('IndexedDB write error:', err);
  }

  // 2. Also try localStorage as secondary backup
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // If localStorage quota is exceeded, IndexedDB already has the data safely!
  }
}

export async function loadFromStorage<T>(key: string): Promise<T | null> {
  if (typeof window === 'undefined') return null;

  // 1. Try IndexedDB first
  try {
    const db = await getIDB();
    const result = await new Promise<T | null>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => resolve((req.result as T) ?? null);
      req.onerror = () => reject(req.error);
    });
    if (result) return result;
  } catch (err) {
    console.warn('IndexedDB read error:', err);
  }

  // 2. Fallback to localStorage
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved) as T;
    }
  } catch (err) {
    console.error('Failed to parse from localStorage:', err);
  }

  return null;
}
