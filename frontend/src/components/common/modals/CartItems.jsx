import react from "react";
import { Plus, Minus, Trash2 } from "lucide-react";

export default function CartItems({ cartItems, user, onUpdateQuantity, onRemoveItem }) {



    return (<>
    
        <div className="bg-white shadow-md rounded-xl p-6">
            <h2 className="border-b pb-2 mb-4 text-2xl font-semibold">Warenkorb</h2>

            <div className="space-y-6">
                {cartItems.map(item => (
                    <div key={`${item.product_id || item.idProdukt}_${item.Name || Math.random()}`} className="flex justify-between items-center bg-white shadow-md rounded-xl p-4 border">
    
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                            <img
                            src={item.Bild}
                            alt={item.Name}
                            className="h-16 w-16 object-contain border rounded-md p-1 bg-gray-50 shrink-0"
                            />
                            <h2 className="font-semibold text-gray-800 truncate lg:break-words lg:whitespace-normal">
                            {item.Name}
                            </h2>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 border border-gray-300 rounded-xl px-2 py-1">
                                <button onClick={() => onUpdateQuantity(item.product_id || item.idProdukt, item.menge - 1)}>
                                    <Minus className="h-4 w-4" />
                                </button>
                                <span className="w-6 text-center">{item.menge}</span>
                                <button onClick={() => onUpdateQuantity(item.product_id || item.idProdukt, item.menge + 1)}>
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>
                            <p className="whitespace-nowrap font-medium">CHF {Number(item.Preis_brutto).toFixed(2)}</p>
                            <Trash2 className="h-4 w-4 cursor-pointer text-red-500" onClick={() => onRemoveItem(item)} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
        
    </>
    )
}