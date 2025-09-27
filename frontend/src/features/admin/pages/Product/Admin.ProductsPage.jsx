import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProductsPage() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ data: [], page: 1, limit: 20, total: 0 });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const ac = new AbortController();

    async function load() {
      setLoading(true);
      setErr("");

      try {
        const query = new URLSearchParams({ q, page: String(page) }).toString();

        const res = await fetch(
          `${process.env.BACKEND_URL}/api/admin/products?${query}`,
          { credentials: "include", signal: ac.signal }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();
        setData(json);
      } catch (e) {
        if (e.name !== "AbortError") setErr("Konnte Produkte nicht laden");
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => ac.abort();
  }, [q, page]);

  const handleEdit = (id) => {
    navigate(`${id}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Produkte</h2>
        <input
          className="border rounded-md px-3 py-2"
          placeholder="Suchen (Name/Kategorie)…"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {err && <div className="text-red-600">{err}</div>}

      {loading ? (
        <div>Lade…</div>
      ) : (
        <>
          <div className="overflow-x-auto border rounded-md">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-2">ID</th>
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Kategorie</th>
                  <th className="text-left p-2">Preis netto</th>
                  <th className="text-left p-2">Preis brutto</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((p) => (
                  <tr key={p.idProdukt} className="border-t">
                    <td className="p-2">{p.idProdukt}</td>
                    <td className="p-2">{p.Name}</td>
                    <td className="p-2">{p.Kategorie}</td>
                    <td className="p-2">{p.Preis_netto}</td>
                    <td className="p-2">{p.Preis_brutto}</td>
                    <td className="">
                      <button onClick={() => handleEdit(p.idProdukt)}>
                        Bearbeiten
                      </button>
                    </td>
                  </tr>
                ))}
                {data.data.length === 0 && (
                  <tr>
                    <td className="p-3" colSpan={5}>
                      Keine Produkte gefunden.
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
