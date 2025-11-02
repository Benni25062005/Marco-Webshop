import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function OrdersPage() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const ac = new AbortController();

    async function loadOrders() {
      setLoading(true);
      setErr("");
      try {
        const res = await fetch(`${process.env.BACKEND_URL}/api/admin/orders`, {
          credentials: "include",
          signal: ac.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setData(Array.isArray(json) ? json : []);
      } catch (e) {
        if (e.name !== "AbortError") {
          setErr("Konnte Bestellungen nicht laden");
          toast.error("Konnte Bestellungen nicht laden");
        }
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
    return () => ac.abort();
  }, []);

  const handleEdit = (id) => {
    navigate(`${id}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Bestellungen</h2>
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
                  <th className="text-left p-2">Bestellung-ID</th>
                  <th className="text-left p-2">User-ID</th>
                  <th className="text-left p-2">Vorname</th>
                  <th className="text-left p-2">Nachname</th>
                  <th className="text-left p-2">Email</th>
                  <th className="text-left p-2">Erstellt am</th>
                  <th className="text-left p-2">Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {data.map((o) => (
                  <tr key={o.order_id} className="border-t">
                    <td className="p-2">{o.order_id}</td>
                    <td className="p-2">{o.idUser}</td>
                    <td className="p-2">{o.user_vorname ?? "-"}</td>
                    <td className="p-2">{o.user_nachname ?? "-"}</td>
                    <td className="p-2">{o.user_email ?? "-"}</td>
                    <td className="p-2">
                      {o.created_at
                        ? new Date(o.created_at).toLocaleString()
                        : "-"}
                    </td>
                    <td>
                      <button onClick={() => handleEdit(o.order_id)}>
                        Details
                      </button>
                    </td>
                  </tr>
                ))}

                {data.length === 0 && (
                  <tr>
                    <td className="p-3" colSpan={5}>
                      Keine Bestellungen gefunden.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
