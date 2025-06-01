import React, {useState} from "react";
import { useDispatch } from "react-redux";
import { resetPassword } from "../../features/authSlice";
import toast from "react-hot-toast";


const eyeOpen = new URL("../../../assets/eye_open.png", import.meta.url).href;
const eyeClose = new URL("../../../assets/eye_close.png", import.meta.url).href;


export default function ChangePasswordModal({ email, code, onClose,  }) {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const dispatch = useDispatch();

    const handleChange = () => {
        if(newPassword.length < 8) {
            toast.error("Passwort muss mindestens 8 Zeichen lang sein!");
            return;
        } 

        if(!newPassword || !confirmPassword){
            toast.error("Bitte füllen Sie alle Felder aus!");
        }

        if (newPassword !== confirmPassword){
            toast.error("Passwörter stimmen nicht überein!");
            return;
        }

        dispatch(resetPassword({ email, code, newPassword }))
        .unwrap()
        .then(() => {
            toast.success("Password erfolgreich geändert");
            onClose();
        })
        .catch((err) => {
            toast.error(err.message || "Fehler beim ändern des Passworts");
        });
    };

    return(
    <>
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
                <h2 className="text-xl font-medium mb-4 text-center">Neues Passwort eingeben</h2>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Neues Passwort"
                        className="inputStyle w-full "
                    />
                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 " onClick={() => setShowPassword(!showPassword)}>
                        <img src={showPassword ? eyeOpen : eyeClose} className="h-5 w-5" alt="Toggle Password"></img>
                    </button>
                </div>
                
                <div className="relative">
                    <input 
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Neues Passwort wiederholen"
                        className="inputStyle w-full mb-4 mt-4"
                    />
                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 " onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                        <img src={showConfirmPassword ? eyeOpen : eyeClose} className="h-5 w-5" alt="Toggle Password"></img>
                    </button>
                </div>
                

                <div className="flex justify-between">
                    <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Abbrechen</button>
                    <button onClick={handleChange} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Bestätigen</button>
                </div>
            </div>
        </div>

    </>)
}