import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchCart, removeFromCart, updateItemQuantity} from "./features/cartSlice";
import { LogIn } from "lucide-react";
import { useEffect } from "react";
import { removeItemFromCart } from "./features/cartSlice";
import { updateItemQuantity } from "./features/cartSlice";

import { Plus, Minus} from "lucide-react";


export default function Main() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const cartItems = useSelector((state) => state.cart.items);

    const handleRemoveFromCart = (item) => {
        if (!user) {
            navigate("/login");
            return;
        }
        dispatch(removeItemFromCart({ user_id: user.idUser, product_id: item.product_id }));
    }

    const handleUpdateQuantity = (product_id, newMenge) => {
        const maxMenge = 10;
        if(newMenge < 1 || newMenge > maxMenge)  return;

        dispatch(updateItemQuantity({
          user_id: user.idUser,
          product_id,
          menge: newMenge,
        }))
    }

    useEffect(() => {
      
      if (user) {
       dispatch(fetchCart(user.idUser)); 
      }
      
    }, [dispatch, user]);


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

    return(<>
    
      {cartItems.length === 0 ? (
        <p className="text-center mt-10 text-gray-600 text-lg">Warenkorb ist leer.</p>
      ) : (
        <div className="space-y-6 px-4 max-w-3xl mx-auto mt-10">
          {cartItems.map(item => (
            <div key={item.product_id} className="flex items-center justify-between bg-white shadow-md rounded-xl p-4 border">
              
              <div className="flex items-center gap-4">
                <img src={item.Bild} alt={item.Name} className="h-16 w-16 object-contain border rounded-md p-1 bg-gray-50" />
                <div>
                  <h2 className="font-semibold text-gray-800">{item.Name}</h2>
                  <p className="text-sm text-gray-500">CHF {Number(item.Preis_brutto).toFixed(2)}</p>
                  <p className="text-sm text-gray-400">Menge: {item.menge}</p>
                </div>
              </div>


              <div className="flex items-center gap-4">
                <div className="flex items-center gap-x-4 border border-gray-300 rounded-xl px-2 py-1">
                  <button onClick={() => handleUpdateQuantity(item.product_id, item.menge - 1)}> 
                    <Minus className="h-4 w-4" />
                  </button>
                  <p className="text-md">{item.menge}</p>
                  <button onClick={() => handleUpdateQuantity(item.product_id, item.menge + 1)}>
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <button
                  onClick={() => handleRemoveFromCart(item)}
                  className="text-sm text-red-600 hover:text-red-700 hover:underline"
                >
                  Entfernen
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>)
}