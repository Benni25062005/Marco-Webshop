import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const navigate = useNavigate();

const Checkout = () => {
  const handleCheckout = async () => {
    
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
