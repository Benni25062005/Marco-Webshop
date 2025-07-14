import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import { useSelector, useDispatch } from "react-redux";
import { registerUser } from "../user/userSlice";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { GeoapifyGeocoderAutocomplete, GeoapifyContext } from '@geoapify/react-geocoder-autocomplete';
import '@geoapify/geocoder-autocomplete/styles/minimal.css';

const open = new URL("../../../assets/eye_open.png", import.meta.url).href;
const closed = new URL("../../../assets/eye_close.png", import.meta.url).href;

export default function Main() {
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [vorname, setVorname] = useState("");
    const [nachname, setNachname] = useState("");
    const [strasse, setStrasse] = useState("");
    const [plz, setPlz] = useState("");
    const [ort, setOrt] = useState("");
    const [land, setLand] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleRegistration = (e) => {
        e.preventDefault();
        
        if (!email || !password || !vorname || !nachname || !phone) {
            toast.error("Bitte füllen Sie alle Felder aus.");
            return;
        }

        if(password.length < 8) {
            toast.error("Passwort muss mindestens 8 Zeichen lang sein!")
            return;
        }

        const user = {
            email,
            password,
            vorname,
            nachname,
            telefonnummer: phone,
            strasse,
            plz,
            ort,
            land
            };
        dispatch(registerUser(user))
        .unwrap()
        .then(() => {
            navigate("/verify-email")
        })
        .catch((err) => {
            toast.error(err.message || "Email bereits verwendet");
        })

        setEmail("");
    };


    return(<>

    
       <div className="flex flex-col justify-center items-center mt-36 px-4 max-w-2xl mx-auto">
        <h1 className="text-3xl font-medium mb-8 text-center">Erstelle jetzt einen Account</h1>

        <form onSubmit={handleRegistration} className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Linke Seite */}
            <div className="flex flex-col gap-4 ">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input className="inputStyle" value={vorname} onChange={(e) => setVorname(e.target.value)} placeholder="Vorname" />
                    <input className="inputStyle" value={nachname} onChange={(e) => setNachname(e.target.value)} placeholder="Nachname" />
                </div>

                <PhoneInput
                country={"ch"}
                onlyCountries={["ch","at","de"]}
                preferredCountries={['ch']}
                value={phone}
                onChange={setPhone}
                inputClass="phoneInputStyle"
                dropdownClass="!shadow-md !border-none"
                />
                <input className="inputStyle" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-Mail" />

                <div className="relative">
                    <input className="inputStyle" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Passwort" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                        <img src={showPassword ? open : closed} alt="Toggle password" className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Rechte Seite */}
            <div className="flex flex-col gap-4">
                <input className="inputStyle" value={strasse} onChange={(e) => setStrasse(e.target.value)} placeholder="Straße" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input className="inputStyle" value={plz} onChange={(e) => setPlz(e.target.value)} placeholder="PLZ" />
                    <input className="inputStyle" value={ort} onChange={(e) => setOrt(e.target.value)} placeholder="Ort" />
                </div>

                <select className="inputStyle" value={land} onChange={(e) => setLand(e.target.value)}>
                <option value="Schweiz">Schweiz</option>
                <option value="Deutschland">Deutschland</option>
                <option value="Österreich">Österreich</option>
                </select>

                
                <button type="submit" className="bg-red-600 text-lg text-white font-medium py-2 px-8 rounded-xl shadow-md hover:scale-[1.02] hover:shadow-lg transition duration-300">
                    Registrieren
                </button>
                
                
            </div>
            </div>

            {/* Button mittig unterhalb */}
            
        </form>
    </div>
    
    </>)
}


