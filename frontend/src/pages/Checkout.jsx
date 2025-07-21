import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const navigate = useNavigate();

const Checkout = () => {
  const handleCheckout = async () => {
    try {
      const response = await axios.post("/create-checkout-session", {
        price: "price_1Rn5B7H5LyhPAXseZCZR7mjf",
        quantity: 1,
      });
      navigate(response.data.url);
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };

  return (
    <>
      <div>
        <h1>Checkout</h1>
        <button onClick={handleCheckout}>Zum Checkout</button>
      </div>
    </>
  );
};
