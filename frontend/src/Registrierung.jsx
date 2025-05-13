import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import open from "../assets/eye_open.png";
import closed from "../assets/eye_close.png";
import { useSelector, useDispatch } from "react-redux";
import { registerUser } from "./features/userSlice";
import { useNavigate } from "react-router-dom";


export default function Main() {
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [vorname, setVorname] = useState("");
    const [nachname, setNachname] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleRegistration = (e) => {
        e.preventDefault();

        if (!email || !password || !vn || !nn || !phone) {
            alert("Bitte fülle alle Felder aus.");
            return;
        }

        const user = {
            email,
            password,
            vorname: vorname,
            nachname: nachname,
            telefonnummer: phone,
        };
        dispatch(registerUser(user))
        navigate("/profile")

        setPhone("");
        setEmail("");
        setPassword("");
        setVorname("");
        setNachname("");
    };


    return(<>

    
        <div className="flex flex-col justify-center items-center mt-36 max-w-sm mx-auto">
            <h1 className="text-2xl font-medium mb-8">Erstelle jetzt einen Account</h1>

            <form className="w-full max-w-sm flex flex-col gap-4" onSubmit={handleRegistration}>
                <div className="flex flex-row gap-4">
                    <input className="inputStyle" value={vorname} onChange={(e) => setVorname(e.target.value)} placeholder="Vorname" type="text" id="vn"></input>
                    <input className="inputStyle" value={nachname} onChange={(e) => setNachname(e.target.value)} placeholder="Nachname" type="text" id="nn"></input>
                </div>
                
                <PhoneInput
                    country={"ch"}
                    onlyCountries={["ch","at","de"]}
                    preferredCountries={['ch']}
                    value={phone} //die gesamte telefonnummer kann ich mit der variable "phone" aufrufen!
                    onChange={setPhone}
                    inputClass="phoneInputStyle"
                    dropdownClass="!shadow-md !border-none"
                    containerClass=""
                />

                <input onChange={(e) => setEmail(e.target.value)} value={email} className="inputStyle" placeholder="Email" type="email" id="email"></input>
            
                <div className="relative">
                    <input onChange={(e) => setPassword(e.target.value)} value={password} className="inputStyle" placeholder="Passwort" type={showPassword ? "text" : "password"} id="password"></input>
                    <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2" onClick={() => setShowPassword(!showPassword)}><img src={showPassword ? open : closed} alt="Toggle password" className="h-5 w-5"/></button>
                </div>

                <div className="grid grid-cols-1 gap-y-4  lg:w-full ">
                    <button className="bg-orange-600 text-white text-md font-medium py-2 px-6 rounded-xl shadow-md hover:scale-[1.02] hover:shadow-lg transition duration-300">Registrieren</button>
                </div>
                
            </form>
        </div>
    
    </>)
}