import react, {useState} from "react";
import toast from "react-hot-toast";
import CodeNumberModal from "./CodeNumberModal";
import { useDispatch, useSelector } from "react-redux";
import { sendSms } from "../../../features/user/userSlice";

export default function ChangeNumberModal({onClose, isOpen }) {
    const [number, SetNumber] = useState("");
    const [step, setStep] = useState(1); 
    const [code, setCode] = useState("");
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth)
    

    const handleChange = async () => {
        if(!number) {
            toast.error("Bitte geben Sie eine Telefonnummer ein");
            return;
        }

        console.log(number)

        // try{
        //     const idUser = user.idUser;

        //     await dispatch(sendSms({phone: number, idUser})).unwrap();
        //     toast.success("Code wurde gesendet");
        //     setStep(2)
        // } catch (err) {
        //     toast.error("Fehler beim Senden der SMS");
        // } 

        setStep(2)

       

    }

    return(<>

    {step === 2 && (
        <CodeNumberModal 
        onCodeChange={setCode}        
        />
    )}
    
    {step === 1 && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
            <div className="flex flex-col justify-center gap-2">
                    <h2 className="text-2xl font-medium mb-4">Telefonnummer eingeben</h2>
            </div>

            
            <div className="flex flex-col gap-4">
                <input 
                    type="tel"
                    placeholder="Telefonnummer"
                    className="inputStyle"
                    value={number}
                    onChange={(e) => SetNumber(e.target.value)}
                />
            </div>

            <div className="flex flex-col w-full items-center justify-center mt-6 gap-4">
                <div className="flex justify-center gap-3 w-full">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                        >
                        Abbrechen
                    </button>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        onClick={handleChange}
                        >
                        Code senden
                    </button>
                </div>

                
                
            </div>
        </div>
    </div>
    )}
    

    
    
    </>)
}