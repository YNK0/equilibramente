const DB_NAME = 'equilibramente-offline';
const DB_VERSION = 1;

type Store = 'checkins' | 'tasks' | 'reflections' | 'pending-mutations';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('checkins')) {
        db.createObjectStore('checkins', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('tasks')) {
        db.createObjectStore('tasks', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('reflections')) {
        db.createObjectStore('reflections', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('pending-mutations')) {
        db.createObjectStore('pending-mutations', { keyPath: 'id', autoIncrement: true });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export const offlineDB = {
  async put(store: Store, value: Record<string, unknown>): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, 'readwrite');
      tx.objectStore(store).put(value);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  },

  async getAll<T>(store: Store): Promise<T[]> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, 'readonly');
      const req = tx.objectStore(store).getAll();
      req.onsuccess = () => resolve(req.result as T[]);
      req.onerror = () => reject(req.error);
    });
  },

  async get<T>(store: Store, id: string): Promise<T | undefined> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, 'readonly');
      const req = tx.objectStore(store).get(id);
      req.onsuccess = () => resolve(req.result as T | undefined);
      req.onerror = () => reject(req.error);
    });
  },

  async addMutation(mutation: { endpoint: string; method: string; body: unknown }): Promise<void> {
    await this.put('pending-mutations', mutation as unknown as Record<string, unknown>);
  },

  async getPendingMutations(): Promise<{ endpoint: string; method: string; body: unknown }[]> {
    return this.getAll('pending-mutations');
  },

  async clearMutations(): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('pending-mutations', 'readwrite');
      tx.objectStore('pending-mutations').clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  },

  async syncPendingMutations(): Promise<void> {
    const mutations = await this.getPendingMutations();
    if (mutations.length === 0) return;

    const synced: number[] = [];
    for (let i = 0; i < mutations.length; i++) {
      const m = mutations[i] as Record<string, unknown>;
      try {
        const res = await fetch(m.endpoint as string, {
          method: m.method as string,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(m.body),
        });
        if (res.ok) synced.push(i);
      } catch {
        // Stop syncing — network still unavailable
        break;
      }
    }

    // Remove synced mutations
    const db = await openDB();
    const tx = db.transaction('pending-mutations', 'readwrite');
    const store = tx.objectStore('pending-mutations');
    for (const idx of synced.reverse()) {
      // Get the key at that auto-increment position
      const all = await new Promise<unknown[]>((resolve) => {
        const r = store.getAllKeys();
        r.onsuccess = () => resolve(r.result);
      });
      if (all[idx] !== undefined) store.delete(all[idx] as IDBValidKey);
    }
    await new Promise<void>((resolve) => {
      tx.oncomplete = () => resolve();
    });
  },
};

export function isOnline(): boolean {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}
