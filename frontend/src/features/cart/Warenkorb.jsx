import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchCart, removeFromCart, updateItemQuantity } from "./cartSlice";
import { LogIn } from "lucide-react";
import { useEffect } from "react";
import { removeItemFromCart } from "./cartSlice";
import { updateItemQuantity } from "./cartSlice";
import CartItems from "../../components/common/modals/CartItems";
import CartSummary from "../../components/common/modals/CartSummary";

export default function Main() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.items);
  const orderCompleted = useSelector((state) => state.order.orderCompleted);

  useEffect(() => {
    console.log("Warenkorb nach Update:", cartItems);
  }, [cartItems]);

  const handleRemoveFromCart = (item) => {
    if (!user) {
      navigate("/login");
      return;
    }
    dispatch(
      removeItemFromCart({ user_id: user.idUser, product_id: item.product_id })
    );
  };

  const handleUpdateQuantity = (product_id, newMenge) => {
    const maxMenge = 10;
    if (newMenge < 1 || newMenge > maxMenge) return;

    dispatch(
      updateItemQuantity({
        user_id: user.idUser,
        product_id,
        menge: newMenge,
      })
    );
  };

  useEffect(() => {
    if (user && !orderCompleted) {
      dispatch(fetchCart(user.idUser));
    }
  }, [dispatch, user, orderCompleted]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center mt-36 px-6">
        <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center border border-gray-200">
          <div className="flex justify-center mb-4">
            <LogIn className="h-12 w-12 text-red-600" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            Du bist nicht eingeloggt
          </h1>
          <p className="text-gray-600 mb-6">
            Bitte melde dich an, um deinen Warenkorb anzusehen.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-md transition-all"
          >
            Zum Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col md:flex-row gap-6 px-6 mt-10 max-w-6xl mx-auto">
        <div className="w-full md:w-2/3">
          <CartItems
            cartItems={cartItems}
            user={user}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveFromCart}
          />
        </div>
        <div className="w-full md:w-1/3">
          <CartSummary cartItems={cartItems} />
        </div>
      </div>
    </>
  );
}
