const tiles = [
  { title: "Analytics", value: "2,418", subtitle: "24h views" },
  { title: "Orders", value: "318", subtitle: "+12 today" },
  { title: "Uptime", value: "99.98%", subtitle: "last 30 days" },
  { title: "Queue", value: "17", subtitle: "pending jobs" }
];

export default function Page() {
  return (
    <main className="desktop">
      <header className="topbar tile">
        <h1>Admin Tiles</h1>
        <p>Next.js App Router + TypeScript</p>
      </header>

      <section className="tile-grid">
        {tiles.map((tile) => (
          <article key={tile.title} className="tile panel">
            <h2>{tile.title}</h2>
            <p className="value">{tile.value}</p>
            <p className="sub">{tile.subtitle}</p>
          </article>
        ))}

        <article className="tile panel wide">
          <h2>Activity</h2>
          <ul>
            <li>Deploy completed (3 min ago)</li>
            <li>3 new user signups</li>
            <li>Backup succeeded</li>
          </ul>
        </article>

        <article className="tile panel tall">
          <h2>Quick Actions</h2>
          <button>Refresh Data</button>
          <button>Run Health Check</button>
          <button>Create Report</button>
        </article>
      </section>
    </main>
  );
}
