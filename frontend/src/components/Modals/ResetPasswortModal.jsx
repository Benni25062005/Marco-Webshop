import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import CodeInputModal from "./CodeInputModal";
import ChangePasswordModal from "./ChangePasswordModal"; 
import { requestReset } from "../../features/authSlice";

export default function ResetPasswortModal({ isOpen, onClose}) {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [step, setStep] = useState(1); // 1 = Email, 2 = Code, 3 = Passwort ändern
    const [code, setCode] = useState("");
    const dispatch = useDispatch();

    

    const handleReset = async () =>{
        if (!email || !email.includes("@") || !email.includes(".")) {
            toast.error("Bitte geben Sie eine gültige Email-Adresse ein.");
            return;
        }

        setLoading(true);

        dispatch(requestReset({ email }))
        .unwrap()
        .then(() => {
            toast.success("Code wurde an Ihre Email gesendet.")
            setStep(2);
        })
        .catch((err) => {
            toast.error(err.message || "Fehler beim Senden der E-Mail");
        })
        .finally(() => setLoading(false));
    }

    const handleCodeSubmit = () => {
        if (code.length !== 4) {
            toast.error("Bitte Code eingeben")
            return;
        }

        setStep(3);            
    }


    return(
    <>
        {step === 3 ? (
            <ChangePasswordModal 
                email={email}
                code={code}
                onClose={onClose}
            />
        ): (
            <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
                    <div className="flex flex-col items-center justify-center gap-2">
                        {step === 1 ? (
                            <h2 className="text-2xl font-medium mb-4">E-Mail eingeben</h2>
                        ) : (
                            <>
                                <h1 className="text-2xl font-medium">E-Mail verifizieren</h1>
                                <p className="text-md mb-6">Wir haben Ihnen einen Bestätigungscode geschickt!</p>
                            </>
                        )}
                    </div>

                    {step === 1 ? (
                        <div className="flex flex-col gap-4">
                            <input 
                                type="email"
                                placeholder="Email"
                                className="inputStyle"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    ) : (
                        <CodeInputModal onCodeChange={setCode}/>
                    )}

                    <div className="flex flex-col w-full items-center justify-center mt-6 gap-4">
                        <div className="flex justify-center gap-3 w-full">
                            <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                            >
                            Abbrechen
                            </button>
                            <button
                            onClick={step === 1 ? handleReset : handleCodeSubmit}
                            disabled={loading}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                            {loading
                                ? "Wird gesendet..."
                                : step === 1
                                ? "Code anfordern"
                                : "Code bestätigen"}
                            </button>
                        </div>

                        {step === 2 &&(
                        <div className="flex gap-1 text-center">
                            <p>Keinen Code erhalten?</p>
                            <a className="text-blue-600 hover:underline cursor-pointer">Erneut senden</a>
                        </div>
                        )}        
                        
                    </div>
                </div>
            </div>
    
        )}
        
         
    
    
    </>)
}