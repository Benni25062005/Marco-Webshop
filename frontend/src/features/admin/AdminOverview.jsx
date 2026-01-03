import React, { useEffect, useState } from "react";

export default function AdminOverview() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);
      setErr("");

      try {
        const [usersRes, ordersRes, productsRes] = await Promise.all([
          fetch(`${process.env.BACKEND_URL}/api/admin/users`, {
            credentials: "include",
          }),
          fetch(`${process.env.BACKEND_URL}/api/admin/orders`, {
            credentials: "include",
          }),
          fetch(`${process.env.BACKEND_URL}/api/admin/products`, {
            credentials: "include",
          }),
        ]);

        if (!usersRes.ok) throw new Error(`Users HTTP ${usersRes.status}`);
        if (!ordersRes.ok) throw new Error(`Orders HTTP ${ordersRes.status}`);
        if (!productsRes.ok)
          throw new Error(`Products HTTP ${productsRes.status}`);

        const usersJson = await usersRes.json();
        const ordersJson = await ordersRes.json();
        const productsJson = await productsRes.json();

        if (!alive) return;

        setUsers(Array.isArray(usersJson) ? usersJson : usersJson?.data ?? []);
        setOrders(
          Array.isArray(ordersJson) ? ordersJson : ordersJson?.data ?? []
        );
        setProducts(
          Array.isArray(productsJson) ? productsJson : productsJson?.data ?? []
        );
      } catch (e) {
        if (alive) setErr("Konnte Admin-Daten nicht laden");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const userById = React.useMemo(() => {
    const m = new Map();
    for (const u of users) {
      m.set(u.idUser ?? u.id ?? u.user_id, u);
    }
    return m;
  }, [users]);

  const userLabel = (id) => {
    const u = userById.get(id);
    if (!u) return "—";
    return `${u.vorname ?? ""} ${u.nachname ?? ""}`.trim();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-600">
              Übersicht über Nutzer, Bestellungen und Produkte
            </p>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="rounded-lg border bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-100"
          >
            Neu laden
          </button>
        </div>

        {loading && (
          <div className="mt-6 rounded-xl border bg-white p-4 text-gray-700 shadow-sm">
            Lade…
          </div>
        )}

        {err && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {err}
          </div>
        )}

        {!loading && !err && (
          <>
            {/* KPI Cards */}
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <div className="text-sm text-gray-600">Nutzer</div>
                <div className="mt-2 text-3xl font-semibold text-gray-900">
                  {users.length}
                </div>
                <div className="mt-1 text-xs text-gray-500">Gesamt</div>
              </div>

              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <div className="text-sm text-gray-600">Bestellungen</div>
                <div className="mt-2 text-3xl font-semibold text-gray-900">
                  {orders.length}
                </div>
                <div className="mt-1 text-xs text-gray-500">Gesamt</div>
              </div>

              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <div className="text-sm text-gray-600">Produkte</div>
                <div className="mt-2 text-3xl font-semibold text-gray-900">
                  {products.length}
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  Aktuell geladen
                </div>
              </div>
            </div>

            {/* Lists */}
            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-base font-semibold text-gray-900">
                    Letzte Bestellungen
                  </h3>
                  <span className="text-xs text-gray-500">
                    Top {Math.min(5, orders.length)}
                  </span>
                </div>

                {orders.length === 0 ? (
                  <div className="text-sm text-gray-600">
                    Keine Bestellungen vorhanden.
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-xl border">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 text-left text-gray-600">
                        <tr>
                          <th className="px-3 py-2">ID</th>
                          <th className="px-3 py-2">Status</th>
                          <th className="px-3 py-2 text-right">User</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 5).map((o, idx) => (
                          <tr key={o.order_id} className="border-t">
                            <td className="px-3 py-2 font-medium text-gray-900">
                              {o.order_id ?? "—"}
                            </td>
                            <td className="px-3 py-2 text-gray-700">
                              {o.created_at ?? "—"}
                            </td>
                            <td className="px-3 py-2 text-right text-gray-900">
                              {userLabel(o.idUser)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-base font-semibold text-gray-900">
                    Top Produkte (nach Preis)
                  </h3>
                  <span className="text-xs text-gray-500">
                    Top {Math.min(5, products.length)}
                  </span>
                </div>

                {products.length === 0 ? (
                  <div className="text-sm text-gray-600">
                    Keine Produkte vorhanden.
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-xl border">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 text-left text-gray-600">
                        <tr>
                          <th className="px-3 py-2">Produkt</th>
                          <th className="px-3 py-2">Kategorie</th>
                          <th className="px-3 py-2 text-right">
                            Preis (netto)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.slice(0, 5).map((p, idx) => (
                          <tr
                            key={p.idProdukt ?? p.id ?? idx}
                            className="border-t"
                          >
                            <td className="px-3 py-2 font-medium text-gray-900">
                              {p.Name ?? p.name ?? "—"}
                            </td>
                            <td className="px-3 py-2 text-gray-700">
                              {p.Kategorie ?? p.category ?? "—"}
                            </td>
                            <td className="px-3 py-2 text-right text-gray-900">
                              {p.Preis_netto ?? p.priceNetto ?? "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
