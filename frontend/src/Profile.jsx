import React from "react";
import { useNavigate} from "react-router-dom";
import { useSelector, useDispatch   } from "react-redux";
import { logout } from "./features/authSlice";

export default function Main() {
    const { user, token } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    }



    console.log("User:", user);

    if (!user) {
        return (
            <div className="flex flex-col justify-center items-center mt-36 w-full">
                <h1 className="text-2xl font-medium">Bitte melden Sie sich an, um Ihr Profil zu sehen.</h1>
            </div>
        )
    }

    return (<>
    
        <h1>Willkommen, {user.vorname}!</h1>
        <button onClick={handleLogout} className="mt-6 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700">Logout</button>

    </>)

}
