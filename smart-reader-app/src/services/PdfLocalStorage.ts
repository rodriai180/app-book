/**
 * PdfLocalStorage
 * Guarda y recupera archivos PDF localmente.
 *   - Web:    IndexedDB  (persiste hasta que el usuario borre datos del navegador)
 *   - Nativo: expo-file-system (persiste en el directorio de documentos de la app)
 */

const DB_NAME = 'smart-reader-pdfs';
const STORE_NAME = 'pdfs';
const DB_VERSION = 1;

// ─── IndexedDB helpers (solo web) ────────────────────────────────────────────

function openDb(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = () => {
            req.result.createObjectStore(STORE_NAME);
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

function idbPut(db: IDBDatabase, key: string, value: Blob): Promise<void> {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).put(value, key);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

function idbGet(db: IDBDatabase, key: string): Promise<Blob | undefined> {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const req = tx.objectStore(STORE_NAME).get(key);
        req.onsuccess = () => resolve(req.result as Blob | undefined);
        req.onerror = () => reject(req.error);
    });
}

function idbDelete(db: IDBDatabase, key: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).delete(key);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

// ─── API pública ──────────────────────────────────────────────────────────────

export class PdfLocalStorage {
    /**
     * Guarda el PDF localmente dado el bookId y el URI del archivo.
     */
    static async save(bookId: string, uri: string): Promise<void> {
        if (typeof window !== 'undefined' && window.indexedDB) {
            // Web: fetch blob → IndexedDB
            const response = await fetch(uri);
            const blob = await response.blob();
            const db = await openDb();
            await idbPut(db, bookId, blob);
        } else {
            // Nativo: copiar archivo al directorio permanente de la app
            const FileSystem = await import('expo-file-system');
            const dir = `${FileSystem.documentDirectory}pdfs/`;
            const dirInfo = await FileSystem.getInfoAsync(dir);
            if (!dirInfo.exists) {
                await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
            }
            const dest = `${dir}${bookId}.pdf`;
            await FileSystem.copyAsync({ from: uri, to: dest });
        }
    }

    /**
     * Devuelve el URI del PDF guardado, o null si no existe.
     * En web retorna un blob URL (válido solo durante la sesión actual).
     */
    static async getUri(bookId: string): Promise<string | null> {
        if (typeof window !== 'undefined' && window.indexedDB) {
            // Web: IndexedDB → blob URL
            const db = await openDb();
            const blob = await idbGet(db, bookId);
            if (!blob) return null;
            return URL.createObjectURL(blob);
        } else {
            // Nativo: devolver ruta del archivo si existe
            const FileSystem = await import('expo-file-system');
            const path = `${FileSystem.documentDirectory}pdfs/${bookId}.pdf`;
            const info = await FileSystem.getInfoAsync(path);
            return info.exists ? path : null;
        }
    }

    /**
     * Elimina el PDF guardado localmente.
     */
    static async delete(bookId: string): Promise<void> {
        if (typeof window !== 'undefined' && window.indexedDB) {
            const db = await openDb();
            await idbDelete(db, bookId);
        } else {
            const FileSystem = await import('expo-file-system');
            const path = `${FileSystem.documentDirectory}pdfs/${bookId}.pdf`;
            const info = await FileSystem.getInfoAsync(path);
            if (info.exists) await FileSystem.deleteAsync(path);
        }
    }
}
