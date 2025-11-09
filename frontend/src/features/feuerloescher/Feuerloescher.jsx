import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { fetchFeuerloescher } from "../products/productsSlice";
import FeuerloescherCard from "../../components/common/cards/FeuerloescherCard.jsx";
import { addItemToCart } from "../cart/cartSlice.js";

export default function Main() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { items, status } = useSelector((state) => state.products);

  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchFeuerloescher("feuerloescher"));
    }
    console.log("Items", items, Array.isArray(items));
  }, [dispatch, items.length]);

  const handleClick = (idProdukt, kategorie) => {
    navigate(`/feuerloescher/${idProdukt}?kategorie=${kategorie}`);
  };

  const handleAddToCart = (item) => {
    if (!user) {
      toast.error(
        "Bitte melden Sie sich an, um einen Artikel in den Warenkorb zu legen."
      );
      navigate("/login", { replace: true });
      return;
    }

    dispatch(
      addItemToCart({
        user_id: user.idUser,
        product: item,
        menge: 1,
      })
    );
    toast.success(`Wurde zum Warenkorb hinzugefügt`);
  };

  if (status === "loading") {
    return (
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-400 animate-pulse z-50" />
    );
  }

  return (
    <>
      <h1 className="mb-24 mt-14 text-center text-4xl sm:text-5xl md:text-6xl font-medium">
        Feuerlöscher
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-24 gap-x-12 justify-items-center px-4 sm:px-8 md:px-16 lg:px-32 xl:px-64">
        {Array.isArray(items) ? (
          items.map((item, i) => (
            <FeuerloescherCard
              key={item.idProdukt}
              item={item}
              onClick={handleClick}
              onAddToCart={() => handleAddToCart(item)}
              delay={i * 0.15}
            />
          ))
        ) : (
          <p>Fehler beim Laden oder keine Produkte gefunden</p>
        )}
      </div>
    </>
  );
}
