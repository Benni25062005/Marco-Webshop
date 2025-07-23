import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createOrder, setOrderCompleted } from "./orderSlice";
import { clearCart, clearCartDB } from "../cart/cartSlice";

export default function CheckoutResult() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) return;

    const placeOrder = async () => {
      if (params.get("success") === "false") {
        navigate("/warenkorb", { state: { message: "Bezahlung abgelehnt" } });
        return;
      }

      if (params.get("success") === "true") {
        try {
          console.log("Starte Bestellung");
          await dispatch(
            createOrder({
              idUser: user.idUser,
              items: cartItems.map((item) => ({
                product_id: item.product_id,
                quantity: item.menge,
              })),
            })
          ).unwrap();

          try {
            await dispatch(clearCartDB(user.idUser)).unwrap();
          } catch (err) {
            console.warn(
              "Warenkorb konnte nicht gelöscht werden (ignoriert):",
              err?.response?.data || err.message || err
            );
          }

          dispatch(clearCart());

          dispatch(setOrderCompleted(true));

          navigate("/bestellungen");
        } catch (err) {
          console.error(
            "Fehler im CheckoutResult:",
            err?.response?.data || err.message || err
          );

          navigate("/bestellungen", {
            state: { message: "Fehler bei der Bestellung" },
          });
        }
      }
    };

    placeOrder();
  }, [params, navigate, dispatch, user]);

  return <div>Chekcout</div>;
}
