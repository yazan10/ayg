// Cloud sync for aygram - real-time persistence with cloud + localStorage fallback
import { db } from './firebase';
import { doc, setDoc, getDoc, collection, onSnapshot } from 'firebase/firestore';

const isFirebaseAvailable = () => {
  return typeof window !== 'undefined' && db !== null;
};

// Generic sync helper
export const syncToFirestore = async (collectionName: string, docId: string, data: unknown) => {
  if (!isFirebaseAvailable() || !db) return false;
  try {
    await setDoc(doc(db, collectionName, docId), {
      data,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    return true;
  } catch (e) {
    console.warn(`[Firestore Sync] Failed to sync ${collectionName}/${docId}:`, e);
    return false;
  }
};

export const syncStoresToFirestore = async (stores: unknown) => {
  return syncToFirestore('aygram', 'stores', stores);
};

export const syncProductsToFirestore = async (products: unknown) => {
  return syncToFirestore('aygram', 'products', products);
};

export const syncUsersToFirestore = async (users: unknown) => {
  return syncToFirestore('aygram', 'users', users);
};

export const syncOrdersToFirestore = async (orders: unknown) => {
  return syncToFirestore('aygram', 'orders', orders);
};

// Subscribe to real-time updates (for multi-device sync)
export const subscribeToCollection = (collectionName: string, docId: string, callback: (data: unknown) => void) => {
  if (!isFirebaseAvailable() || !db) return () => {};
  try {
    const unsub = onSnapshot(doc(db, collectionName, docId), (snap) => {
      if (snap.exists()) {
        const d = snap.data() as { data?: unknown };
        if (d?.data) callback(d.data);
      }
    });
    return unsub;
  } catch {
    return () => {};
  }
};

// Check cloud connection
export const checkFirebaseConnection = async (): Promise<boolean> => {
  if (!isFirebaseAvailable() || !db) return false;
  try {
    const testRef = doc(db, 'aygram', '_health');
    await getDoc(testRef);
    return true;
  } catch {
    return false;
  }
};
