import React from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getOrder } from "../features/order/orderSlice";

export default function Bestellungen() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { orders, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    if (user?.idUser) {
      dispatch(getOrder(user.idUser));
    }
  }, [user, dispatch]);

  const groupedOrders = orders.reduce((acc, item) => {
    if (!acc[item.order_id]) {
      acc[item.order_id] = {
        order_no: item.order_no,
        created_at: item.created_at,
        items: [],
      };
    }
    acc[item.order_id].items.push(item);
    return acc;
  }, {});

  return (
    <>
      {orders.length === 0 ? (
        <p className=" text-red-600 font-medium text-center text-lg ">
          Noch keine Bestellungen vorhanden.
        </p>
      ) : (
        <div className="max-w-4xl mx-auto p-4">
          <h2 className="text-2xl font-semibold mb-6">Meine Bestellungen</h2>

          {Object.entries(groupedOrders).map(([orderId, data]) => (
            <div
              key={orderId}
              className="border rounded-xl p-4 mb-6 shadow-sm bg-white"
            >
              <div className="mb-2 font-semibold">
                Bestellung {data.order_no} –{" "}
                {new Date(data.created_at).toLocaleDateString("de-DE")}
              </div>

              {data.items.map((item) => (
                <div
                  key={`${orderId}-${item.product_id}`}
                  className="flex justify-between items-center border-b py-2"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.Bild}
                      alt={item.name}
                      className="w-12 h-12 object-scale-down rounded-md"
                    />
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-600">
                        Menge: {item.quantity}
                      </div>
                    </div>
                  </div>
                  <div className="text-right font-semibold text-red-600">
                    {item.Preis_brutto} CHF
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
