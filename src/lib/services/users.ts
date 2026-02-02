import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import type { User, UserRole } from '../../types/admin';

const COLLECTION = 'users';

// Get user by ID
export async function getUserById(id: string): Promise<User | null> {
  if (!db) return null;

  try {
    const docRef = doc(db, COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as User;
    }
    return null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

// Get user by email
export async function getUserByEmail(email: string): Promise<User | null> {
  if (!db) return null;

  try {
    const q = query(collection(db, COLLECTION), where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as User;
    }
    return null;
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
}

// Get all users
export async function getAllUsers(): Promise<User[]> {
  if (!db) return [];

  try {
    const q = query(collection(db, COLLECTION), orderBy('name'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as User[];
  } catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
}

// Get active users
export async function getActiveUsers(): Promise<User[]> {
  if (!db) return [];

  try {
    const q = query(
      collection(db, COLLECTION),
      where('active', '==', true),
      orderBy('name')
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as User[];
  } catch (error) {
    console.error('Error getting active users:', error);
    return [];
  }
}

// Create user
export async function createUser(
  id: string,
  data: {
    name: string;
    email: string;
    role: UserRole;
  }
): Promise<User | null> {
  if (!db) return null;

  try {
    const userData = {
      name: data.name,
      email: data.email,
      role: data.role,
      active: true,
      createdAt: Timestamp.now(),
    };

    await setDoc(doc(db, COLLECTION, id), userData);

    return { id, ...userData } as User;
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}

// Update user
export async function updateUser(
  id: string,
  data: Partial<Omit<User, 'id' | 'createdAt'>>
): Promise<boolean> {
  if (!db) return false;

  try {
    const docRef = doc(db, COLLECTION, id);
    await updateDoc(docRef, data);
    return true;
  } catch (error) {
    console.error('Error updating user:', error);
    return false;
  }
}

// Toggle user active status
export async function toggleUserActive(id: string, active: boolean): Promise<boolean> {
  return updateUser(id, { active });
}

// Update user role
export async function updateUserRole(id: string, role: UserRole): Promise<boolean> {
  return updateUser(id, { role });
}
