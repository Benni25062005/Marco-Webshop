import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser} from "./features/authSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ResetPasswortModal from "./components//Modals/ResetPasswortModal";

const open = new URL("../assets/eye_open.png", import.meta.url).href;
const closed = new URL("../assets/eye_close.png", import.meta.url).href;

export default function Main() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [resetPassword, setResetPassword] = useState(false);
    const { loading } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const handleLogin = (e) => {
        e.preventDefault();
        
        if (!email || !password) {            
            toast.error("Bitte füllen Sie alle Felder aus.");
            return;
        }

        const userData = {
            email: email,
            password: password,
        }

        dispatch(loginUser(userData))
            .unwrap()
            .then((result) => {
                navigate("/profile");
            })
            .catch((error) => {
                console.error("Login fehlgeschlagen:", error);
                toast.error(error.message ||"Email oder Passwort falsch");
            });

    }
    

    return(<>

    {resetPassword && ( 
        <div className="flex items-center justify-center gap-2">
            <ResetPasswortModal 
                isOpen={resetPassword}
                onClose={() => setResetPassword(false)}
            
            />
        </div>
    )}
    
    <div className="flex flex-col justify-center items-center mt-36 w-full">
        
        <h1 className="text-2xl font-medium">Sign In to Marcos Webshop</h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-4 mt-8 max-w-sm w-full px-4">
            <input onChange={(e) => setEmail(e.target.value)} className="bg-gray-100 rounded-xl p-1 shadow-sm focus:shadow-md focus:border  focus:border-red-600 p-2 focus:ring-bgorange focus:outline-none transition duration-300 " placeholder="Email" type="email" id="email"></input>
            
            <div className="relative">
                <input onChange={(e) => setPassword(e.target.value)} className="bg-gray-100 rounded-xl p-2 shadow-sm w-full pr-10 focus:shadow-md focus:border focus:border-red-600 focus:ring-bgorange focus:outline-none transition duration-300" placeholder="Passwort" type={showPassword ? "text" : "password"} id="password"></input>
                <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2" onClick={() => setShowPassword(!showPassword)}><img src={showPassword ? open : closed} alt="Toggle password" className="h-5 w-5"/></button>
            </div>
            
            
            <div className="grid grid-cols-1 gap-y-4  lg:w-full ">
                <button className="bg-red-600 text-white text-md font-bold py-2 px-6 rounded-xl shadow-md hover:scale-[1.02] hover:shadow-lg transition duration-300">Login</button>
            </div>
            <div className="flex items-center justify-center gap-2">
                <p>Noch kein Konto?</p>
                <Link to="/registrierung" className="text-red-600 font-medium">Jetzt registrieren</Link>
            </div>
            <div className="flex items-center justify-center gap-2 -mt-4">
                <button onClick={() => setResetPassword(true)} className="text-red-600 font-medium">Passwort vergessen</button>
            </div>
            
        </form>
        
    </div>
    
    
    </>)
}