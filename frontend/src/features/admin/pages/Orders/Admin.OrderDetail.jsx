import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

export default function OrderItems() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const ac = new AbortController();
    async function load() {
      setLoading(true);
      setErr("");
      try {
        const res = await fetch(
          `${process.env.BACKEND_URL}/api/admin/orders/${id}/items`,
          { credentials: "include", signal: ac.signal }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setRows(Array.isArray(json) ? json : []);
      } catch (e) {
        if (e.name !== "AbortError") {
          setErr("Konnte Positionen nicht laden");
          toast.error("Konnte Positionen nicht laden");
        }
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => ac.abort();
  }, [id]);

  const totalNetto = rows.reduce((s, r) => s + (r.subtotal_netto ?? 0), 0);
  const totalBrutto = rows.reduce((s, r) => s + (r.subtotal_brutto ?? 0), 0);

  return (
    <div className="space-y-4">
      <ArrowLeft
        className="cursor-pointer"
        onClick={() => navigate("/admin/orders")}
      />
      <h2 className="text-xl font-semibold">Bestellung #{id}</h2>

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
                  <th className="text-left p-2">Item-ID</th>
                  <th className="text-left p-2">Produkt</th>
                  <th className="text-left p-2">Menge</th>
                  <th className="text-left p-2">Netto</th>
                  <th className="text-left p-2">Brutto</th>
                  <th className="text-left p-2">Zwischensumme</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.order_items_id} className="border-t">
                    <td className="p-2">{r.order_items_id}</td>
                    <td className="p-2">
                      <div className="flex items-center gap-3">
                        {r.product?.image ? (
                          <img
                            src={r.product.image}
                            alt={r.product?.name || "Produkt"}
                            className="h-10 w-10 rounded object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded bg-gray-200" />
                        )}
                        <div>
                          <div className="font-medium">
                            {r.product?.name ?? "-"}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID {r.product_id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-2">{r.quantity}</td>
                    <td className="p-2">
                      {r.product?.price_netto != null
                        ? r.product.price_netto.toFixed(2)
                        : "-"}
                    </td>
                    <td className="p-2">
                      {r.product?.price_brutto != null
                        ? r.product.price_brutto.toFixed(2)
                        : "-"}
                    </td>
                    <td className="p-2">
                      {r.subtotal_brutto != null
                        ? r.subtotal_brutto.toFixed(2)
                        : "-"}
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td className="p-3" colSpan={6}>
                      Keine Positionen vorhanden.
                    </td>
                  </tr>
                )}
              </tbody>
              {rows.length > 0 && (
                <tfoot>
                  <tr className="border-t bg-gray-50">
                    <td className="p-2 font-semibold" colSpan={3}>
                      Summe
                    </td>
                    <td className="p-2 font-semibold">
                      {totalNetto.toFixed(2)}
                    </td>
                    <td className="p-2 font-semibold">
                      {totalBrutto.toFixed(2)}
                    </td>
                    <td className="p-2 font-semibold">
                      {totalBrutto.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </>
      )}
    </div>
  );
}
