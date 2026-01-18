// IndexedDB-based video storage for persistent video uploads

const DB_NAME = 'sluggram_videos';
const DB_VERSION = 1;
const STORE_NAME = 'videos';

let dbPromise: Promise<IDBDatabase> | null = null;

function openDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });

  return dbPromise;
}

export interface StoredVideo {
  id: string;
  blob: Blob;
  mimeType: string;
  createdAt: number;
}

export async function saveVideo(id: string, file: File): Promise<string> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const video: StoredVideo = {
      id,
      blob: file,
      mimeType: file.type,
      createdAt: Date.now(),
    };

    const request = store.put(video);

    request.onsuccess = () => {
      // Return a special URL scheme that we'll handle
      resolve(`indexeddb://${id}`);
    };

    request.onerror = () => reject(request.error);
  });
}

export async function getVideo(id: string): Promise<string | null> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => {
      const video = request.result as StoredVideo | undefined;
      if (video) {
        // Create a blob URL from the stored blob
        const url = URL.createObjectURL(video.blob);
        resolve(url);
      } else {
        resolve(null);
      }
    };

    request.onerror = () => reject(request.error);
  });
}

export async function deleteVideo(id: string): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function clearAllVideos(): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Check if a URL is an IndexedDB reference
export function isIndexedDBUrl(url: string): boolean {
  return url.startsWith('indexeddb://');
}

// Extract the ID from an IndexedDB URL
export function getIdFromIndexedDBUrl(url: string): string {
  return url.replace('indexeddb://', '');
}
