"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { logUserAction } from "@/lib/audit-logs";
import {
  getCurrentAdminProfile,
  listAgencyUsers,
  waitForCurrentUser
} from "@/lib/agency-admin-data";
import type { UserProfile } from "@/types/agency-admin";

type ViewState = "loading" | "unauthenticated" | "forbidden" | "ready" | "error";

export default function AgencyAdminDashboard() {
  const [state, setState] = useState<ViewState>("loading");
  const [currentAdmin, setCurrentAdmin] = useState<UserProfile | null>(null);
  const [agencyUsers, setAgencyUsers] = useState<UserProfile[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const load = useCallback(async () => {
    try {
      setState("loading");
      const firebaseUser = await waitForCurrentUser();
      if (!firebaseUser) {
        setState("unauthenticated");
        return;
      }

      const profile = await getCurrentAdminProfile(firebaseUser.uid);
      if (!profile || profile.role !== "agency_admin" || !profile.agencyId) {
        setState("forbidden");
        return;
      }

      const users = await listAgencyUsers(profile.agencyId);
      setCurrentAdmin(profile);
      setAgencyUsers(users);
      setState("ready");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setErrorMessage(message);
      setState("error");
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [load]);

  const activeCount = useMemo(
    () => agencyUsers.filter((user) => user.status !== "suspended").length,
    [agencyUsers]
  );

  const suspendedCount = agencyUsers.length - activeCount;

  async function demoAudit(action: "user.create" | "user.update" | "user.suspend" | "user.activate" | "user.delete") {
    if (!currentAdmin) {
      return;
    }

    const target = agencyUsers[0] ?? {
      uid: currentAdmin.uid,
      email: currentAdmin.email
    };

    await logUserAction(action, currentAdmin, target, {
      source: "agency-admin-ui",
      note: "manual smoke test"
    });

    await load();
  }

  if (state === "loading") {
    return <main className="desktop"><section className="tile panel">Loading...</section></main>;
  }

  if (state === "unauthenticated") {
    return (
      <main className="desktop">
        <section className="tile panel">
          <h1>Agency Admin</h1>
          <p>ログインが必要です。認証後に再読み込みしてください。</p>
        </section>
      </main>
    );
  }

  if (state === "forbidden") {
    return (
      <main className="desktop">
        <section className="tile panel">
          <h1>404</h1>
          <p>この画面にアクセスできるのは agency_admin のみです。</p>
        </section>
      </main>
    );
  }

  if (state === "error") {
    return (
      <main className="desktop">
        <section className="tile panel">
          <h1>Agency Admin</h1>
          <p>読み込みに失敗しました: {errorMessage}</p>
        </section>
      </main>
    );
  }

  return (
    <main className="desktop">
      <header className="topbar tile">
        <h1>Agency Admin</h1>
        <p>agencyId: {currentAdmin?.agencyId}</p>
      </header>

      <section className="tile-grid">
        <article className="tile panel">
          <h2>Total Users</h2>
          <p className="value">{agencyUsers.length}</p>
          <p className="sub">Current agency scope</p>
        </article>

        <article className="tile panel">
          <h2>Active</h2>
          <p className="value">{activeCount}</p>
          <p className="sub">status != suspended</p>
        </article>

        <article className="tile panel">
          <h2>Suspended</h2>
          <p className="value">{suspendedCount}</p>
          <p className="sub">status == suspended</p>
        </article>

        <article className="tile panel">
          <h2>Role Check</h2>
          <p className="value">OK</p>
          <p className="sub">agency_admin only</p>
        </article>

        <article className="tile panel wide">
          <h2>Agency Users (agencyId filtered)</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>uid</th>
                  <th>email</th>
                  <th>role</th>
                  <th>agencyId</th>
                  <th>status</th>
                </tr>
              </thead>
              <tbody>
                {agencyUsers.map((user) => (
                  <tr key={user.uid}>
                    <td>{user.uid}</td>
                    <td>{user.email ?? "-"}</td>
                    <td>{user.role}</td>
                    <td>{user.agencyId ?? "-"}</td>
                    <td>{user.status ?? "active"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="tile panel tall">
          <h2>Audit Log Smoke Test</h2>
          <button onClick={() => void demoAudit("user.create")}>Log user.create</button>
          <button onClick={() => void demoAudit("user.update")}>Log user.update</button>
          <button onClick={() => void demoAudit("user.suspend")}>Log user.suspend</button>
          <button onClick={() => void demoAudit("user.activate")}>Log user.activate</button>
          <button onClick={() => void demoAudit("user.delete")}>Log user.delete</button>
        </article>
      </section>
    </main>
  );
}
