export type UserRole = "hq_admin" | "agency_admin" | "user";

export type UserStatus = "active" | "suspended";

export type UserProfile = {
  uid: string;
  email: string | null;
  role: UserRole;
  agencyId: string | null;
  status?: UserStatus;
  displayName?: string | null;
  createdAt?: unknown;
  updatedAt?: unknown;
};

export type AuditAction =
  | "user.create"
  | "user.update"
  | "user.suspend"
  | "user.activate"
  | "user.delete";

export type AuditLogInput = {
  action: AuditAction;
  agencyId: string;
  actor: {
    uid: string;
    email: string | null;
    role: UserRole;
  };
  target: {
    uid: string;
    email?: string | null;
  };
  changes?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
};
