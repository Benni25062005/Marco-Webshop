import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createOrder } from "./orderSlice";
import { clearCart } from "../cart/cartSlice";

export default function CheckoutResult() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const { user } = useSelector((state) => state.auth);

  console.log(cartItems[0]);

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

          await dispatch(clearCartDB(user.idUser)).unwrap();
          await dispatch(clearCart());

          dispatch(setOrderCompleted(true)); // Setze Flag erst ganz zum Schluss

          navigate("/bestellungen");
        } catch (err) {
          console.error("Fehler im CheckoutResult:", err);
          navigate("/warenkorb", {
            state: { message: "Fehler bei der Bestellung" },
          });
        }
      }
    };

    placeOrder();
  }, [params, navigate, dispatch, user]); // ohne cartItems

  return <div>Chekcout</div>;
}
