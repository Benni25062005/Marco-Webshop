import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getOrder } from "../features/order/orderSlice";

function fmtMoney(val, currency = "CHF") {
  const n = Number(val ?? 0);
  return `${n.toFixed(2)} ${currency}`;
}

export default function Bestellungen() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { orders, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    if (user?.idUser) dispatch(getOrder(user.idUser));
  }, [user?.idUser, dispatch]);

  const groupedOrders = useMemo(() => {
    const acc = {};
    for (const row of orders || []) {
      const id = row.order_id;
      if (!acc[id]) {
        acc[id] = {
          order_id: id,
          order_no: row.order_no,
          created_at: row.created_at,
          status: row.status,
          payment_status: row.payment_status,
          currency: row.currency || "CHF",
          shipping_cost: row.shipping_cost ?? 0,
          total_amount: row.total_amount ?? null,
          shipping: {
            name: row.shipping_name,
            street: row.shipping_street,
            zip: row.shipping_zip,
            city: row.shipping_city,
            country: row.shipping_country,
          },
          items: [],
        };
      }
      acc[id].items.push(row);
    }
    return Object.values(acc).sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at),
    );
  }, [orders]);

  if (!user?.idUser) {
    return (
      <p className="text-center text-gray-700">
        Bitte einloggen, um Bestellungen zu sehen.
      </p>
    );
  }

  return (
    <>
      {loading && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <div className="mx-2 mt-1 h-[2px] bg-gray-300 opacity-80 rounded-full animate-pulse" />
        </div>
      )}

      {error && (
        <p className="text-center text-red-600 font-medium">
          Fehler:{" "}
          {typeof error === "string"
            ? error
            : "Bestellungen konnten nicht geladen werden."}
        </p>
      )}

      {!loading && (!orders || orders.length === 0) ? (
        <p className="text-gray-700 font-medium text-center text-lg">
          Noch keine Bestellungen vorhanden.
        </p>
      ) : (
        <div className="max-w-4xl mx-auto p-4">
          <h2 className="text-2xl font-semibold mb-6">Meine Bestellungen</h2>

          {groupedOrders.map((o) => (
            <div
              key={o.order_id}
              className="border rounded-xl p-4 mb-6 shadow-sm bg-white"
            >
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between mb-4">
                <div className="font-semibold">
                  Bestellung {o.order_no} –{" "}
                  {new Date(o.created_at).toLocaleDateString("de-DE")}
                </div>

                <div className="text-sm text-gray-600 flex gap-3">
                  <span>
                    Status: <b>{o.status}</b>
                  </span>
                  <span>
                    Zahlung: <b>{o.payment_status}</b>
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {o.items.map((item) => (
                  <div
                    key={item.order_items_id}
                    className="flex justify-between items-center border-b py-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.Bild}
                        alt={item.Name}
                        className="w-12 h-12 object-scale-down rounded-md"
                      />
                      <div>
                        <div className="font-medium">{item.Name}</div>
                        <div className="text-sm text-gray-600">
                          Menge: {item.quantity} · Stück:{" "}
                          {fmtMoney(item.unit_price, o.currency)}
                        </div>
                      </div>
                    </div>

                    <div className="text-right font-semibold text-red-600">
                      {fmtMoney(item.line_total, o.currency)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t flex flex-col gap-1 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Versand</span>
                  <span>{fmtMoney(o.shipping_cost, o.currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Gesamt</span>
                  <span className="font-semibold">
                    {o.total_amount != null
                      ? fmtMoney(o.total_amount, o.currency)
                      : "—"}
                  </span>
                </div>
              </div>

              {(o.shipping?.street || o.shipping?.city) && (
                <div className="mt-4 text-sm text-gray-600">
                  <div className="font-semibold text-gray-700 mb-1">
                    Lieferadresse
                  </div>
                  <div>{o.shipping?.name}</div>
                  <div>{o.shipping?.street}</div>
                  <div>
                    {o.shipping?.zip} {o.shipping?.city}
                  </div>
                  <div>{o.shipping?.country}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
