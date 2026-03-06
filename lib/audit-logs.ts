import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getFirestoreDb } from "@/lib/firebase";
import type { AuditAction, AuditLogInput, UserProfile } from "@/types/agency-admin";

export async function writeAuditLog(input: AuditLogInput): Promise<void> {
  const db = getFirestoreDb();
  if (!db) {
    return;
  }

  await addDoc(collection(db, "auditLogs"), {
    action: input.action,
    tenantType: "agency",
    agencyId: input.agencyId,
    actor: input.actor,
    target: input.target,
    changes: input.changes ?? {},
    metadata: input.metadata ?? {},
    createdAt: serverTimestamp()
  });
}

export async function logUserAction(
  action: AuditAction,
  actor: UserProfile,
  target: { uid: string; email?: string | null },
  changes?: Record<string, unknown>
): Promise<void> {
  if (!actor.agencyId) {
    return;
  }

  await writeAuditLog({
    action,
    agencyId: actor.agencyId,
    actor: {
      uid: actor.uid,
      email: actor.email,
      role: actor.role
    },
    target,
    changes
  });
}
