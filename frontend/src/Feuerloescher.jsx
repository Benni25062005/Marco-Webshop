import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { fetchFeuerloescher } from "./features/productsSlice";
import FeuerloescherCard from "./components/FeuerloescherCard";
import { addItemToCart } from "./features/cartSlice";



export default function Main(){
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth)
    const { items, status} = useSelector(state => state.products);

    useEffect(() => {
      if (items.length === 0) {
        dispatch(fetchFeuerloescher("feuerloescher"));
      }
    }, [dispatch, items.length]);


    

    const handleClick = (idProdukt, kategorie) => {
        navigate(`/feuerloescher/${idProdukt}?kategorie=${kategorie}`);
    }

    const handleAddToCart = (item) => {   
        if(!user) {
          toast.error("Bitte melden Sie sich an, um einen Artikel in den Warenkorb zu legen.");
          navigate("/login", {replace: true});
          return;
        }


        dispatch(addItemToCart({
            user_id: user.idUser,
            product: item,
            menge: 1, 
        }))
        toast.success(`Wurde zum Warenkorb hinzugefügt!`)
    }

    if (status ==="loading") {
      return (
        <div className="text-center">
          <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full text-blue-500" role="status">
              <span className="visually-hidden">Lädt...</span>
          </div>
        </div>
      )
      
    }


    return (<>

        <h1 className="mb-24 mt-14 text-center text-4xl sm:text-5xl md:text-6xl font-medium">Feuerlöscher</h1>
            
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-24 gap-x-12 justify-items-center px-4 sm:px-8 md:px-16 lg:px-32 xl:px-64">
          {items.map((item, i) => (
            <FeuerloescherCard
              key={item.idProdukt}
              item={item}
              onClick={handleClick}
              onAddToCart={() => handleAddToCart(item)}
              delay={i * 0.15}
            />
          ))}
        </div>
    </>)

}