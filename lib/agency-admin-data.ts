import { onAuthStateChanged, type User } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  where
} from "firebase/firestore";
import { getFirebaseAuth, getFirestoreDb } from "@/lib/firebase";
import type { UserProfile } from "@/types/agency-admin";

function toUserProfile(data: Record<string, unknown>, fallbackUid: string): UserProfile {
  return {
    uid: (data.uid as string) ?? fallbackUid,
    email: (data.email as string | null) ?? null,
    role: (data.role as UserProfile["role"]) ?? "user",
    agencyId: (data.agencyId as string | null) ?? null,
    status: (data.status as UserProfile["status"]) ?? "active",
    displayName: (data.displayName as string | null) ?? null,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  };
}

export function waitForCurrentUser(): Promise<User | null> {
  const auth = getFirebaseAuth();
  if (!auth) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
}

export async function getCurrentAdminProfile(uid: string): Promise<UserProfile | null> {
  const db = getFirestoreDb();
  if (!db) {
    return null;
  }

  const snapshot = await getDoc(doc(db, "users", uid));
  if (!snapshot.exists()) {
    return null;
  }

  return toUserProfile(snapshot.data() as Record<string, unknown>, uid);
}

export async function listAgencyUsers(agencyId: string): Promise<UserProfile[]> {
  const db = getFirestoreDb();
  if (!db) {
    return [];
  }

  const usersRef = collection(db, "users");
  const usersQuery = query(usersRef, where("agencyId", "==", agencyId), limit(100));
  const snapshots = await getDocs(usersQuery);

  return snapshots.docs.map((item) =>
    toUserProfile(item.data() as Record<string, unknown>, item.id)
  );
}
