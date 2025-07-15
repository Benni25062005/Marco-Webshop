import react, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProducts } from "../features/products/productsSlice";
import { addItemToCart } from "../features/cart/cartSlice.js";
import GeneralProductCard from "../components/common/cards/GeneralProductCard.jsx";


export default function ProduktListe() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.auth)
    const {items, status} = useSelector(state => state.products)

    useEffect(() => {
        if (items.length === 0) {
            dispatch(fetchAllProducts());
        }
        console.log("products: ", items, Array.isArray(items));
    }, [dispatch, items.length]);

    const handleClick = (id, kategorie) => {
        navigate(`/produkt/${id}?kategorie=${kategorie}`);
    };



    const handleAddToCart = (item) => {
        console.log("Füge hnzu:", item)
        dispatch(addItemToCart({
            user_id: user.idUser,
            product: item,
            menge: 1, 
        }))

        toast.success("Add to cart");
    }


    return (<>

        <div>
            <h1 className="mb-24 mt-14 text-center text-4xl sm:text-5xl md:text-6xl font-medium">Produkte</h1>
            <input type="text" placeholder="Produkte suchen..."  />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-24 gap-x-12 justify-items-center px-4 sm:px-8 md:px-16 lg:px-32 xl:px-64">
          {Array.isArray(items) ? (
            items
            .filter(item => item && item.Bild && item.Name)
            .map((item, i) => (
                <GeneralProductCard
                key={item.idProdukt}
                item={item}
                onClick={handleClick}
                onAddToCart={() => handleAddToCart(item)}
                delay={i * 0.15}
                />
            ))

          ): (
            <p>Fehler beim Laden oder keine Produkte gefunden</p>
          )}
          
        </div>    
    </>)
}