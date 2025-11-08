import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

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

  const handleDelete = async (id) => {
    if (!window.confirm("Produkt wirklich löschen?")) return;

    setLoading(true);
    setErr("");

    try {
      const res = await fetch(
        `${process.env.BACKEND_URL}/api/admin/products/delete/${id}`,
        { method: "DELETE", credentials: "include" }
      );

      if (res.status === 204 || res.ok) {
        setData((d) => {
          const newItems = d.data.filter((p) => p.idProdukt !== id);
          const newTotal = Math.max(0, d.total - 1);

          if (newItems.length === 0 && page > 1) {
            setPage(page - 1);
            return d;
          }
          toast.success("Produkt wurde erfolgreich gelöscht");
          return { ...d, data: newItems, total: newTotal };
        });

        return;
      }

      if (res.status === 409)
        throw new Error(
          "Produkt kann nicht gelöscht werden (verknüpfte Datensätze vorhanden)."
        );

      const msg = await res.text();
      throw new Error(msg || `HTTP ${res.status}`);
    } catch (e) {
      if (e.name !== "AbortError")
        setErr(e.message || "Löschen fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Produkte</h2>
        <div className="flex gap-3">
          <button
            className="border rounded-md px-3 py-2 cursor-pointer"
            onClick={() => navigate("/admin/products/add")}
          >
            Neues Produkt
          </button>
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
                  <th className="text-left p-2">Kategorie</th>
                  <th className="text-left p-2">Preis netto</th>
                  <th className="text-left p-2">Preis brutto</th>
                  <th className="text-left p-2">Bearbeiten</th>
                  <th className="text-left p-2">Löschen</th>
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
                    <td className="">
                      <button onClick={() => handleDelete(p.idProdukt)}>
                        Löschen
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
