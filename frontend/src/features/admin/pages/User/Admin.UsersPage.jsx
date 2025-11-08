import { useEffect, useMemo, useState } from "react";

export default function UsersPage() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ data: [], page: 1, limit: 20, total: 0 });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const query = useMemo(
    () => new URLSearchParams({ search: q, page, limit: 20 }).toString(),
    [q, page]
  );

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const res = await fetch(
          `${process.env.BACKEND_URL}/api/admin/users?${query}`,
          { credentials: "include" }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (alive) setData(json);
      } catch {
        if (alive) setErr("Konnte Nutzer nicht laden");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [query]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Nutzer</h2>
        <input
          className="border rounded-md px-3 py-2"
          placeholder="Suchen (Name/Email)…"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {err && <div className="text-red-600">{err}</div>}
      {loading ? (
        <div className="fixed top-0 left-0 right-0 z-50">
          <div className="mx-2 mt-1 h-[2px] bg-gray-300 opacity-80 rounded-full animate-pulse" />
        </div>
      ) : (
        <>
          <div className="overflow-x-auto border rounded-md">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-2">ID</th>
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Email</th>
                  <th className="text-left p-2">Rolle</th>
                  <th className="text-left p-2">Erstellt</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((u) => (
                  <tr key={u.idUser} className="border-t">
                    <td className="p-2">{u.idUser}</td>
                    <td className="p-2">
                      {u.vorname} {u.nachname}
                    </td>
                    <td className="p-2">{u.email}</td>
                    <td className="p-2">{u.role}</td>
                    <td className="p-2">{u.createdAt?.slice(0, 10)}</td>
                  </tr>
                ))}
                {data.data.length === 0 && (
                  <tr>
                    <td className="p-3" colSpan={5}>
                      Keine Nutzer gefunden.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="border rounded px-3 py-1 disabled:opacity-40"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              Zurück
            </button>
            <span>Seite {data.page}</span>
            <button
              className="border rounded px-3 py-1 disabled:opacity-40"
              onClick={() => setPage((p) => p + 1)}
              disabled={data.page * data.limit >= data.total}
            >
              Weiter
            </button>
            <span className="text-sm text-gray-500">{data.total} gesamt</span>
          </div>
        </>
      )}
    </div>
  );
}
