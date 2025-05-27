import React, {useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { updateEmail } from "../features/userSlice";
import { setUser, fetchUserById } from "../features/userSlice";

export default function EmailChangeModal({ isOpen, onClose, idUser, vorname}) {
    const [email, setEmail] = useState("");
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const { user } = useSelector((state) => state.auth);
    const [waitingForVerification, setWaitingForVerification] = useState(false);

    useEffect(() => {
    if (!waitingForVerification) return;

     const interval = setInterval(() => {
      dispatch(fetchUserById(user.idUser)).then((res) => {
        if (res.payload?.isVerifiedEmail === 1) {
          dispatch(setUser(res.payload)); 
          clearInterval(interval); 
          toast.success("E-Mail erfolgreich verifiziert");
          setWaitingForVerification(false);
          onClose();
        }
      });
    }, 3000);

    return () => clearInterval(interval);
    }, [waitingForVerification]);


    const handleChange = (e) => {
        setEmail(e.target.value)
    }

    const handleSubmit = async () => {
        if (!email || !email.includes("@") || !email.includes(".")) {
            toast.error("Bitte geben Sie eine gültige Email-Adresse ein.");
            return;
        }
        setLoading(true);
        dispatch(updateEmail({
            id: idUser,
            email: email,
            vorname: vorname
        }))
        .unwrap()
        .then((res) => {
            toast.success("E-Mail erfolgreich geändert");
            dispatch(setUser({ ...res.updatedUser })); // Redux aktualisieren
            localStorage.setItem("user", JSON.stringify(res.updatedUser)); // lokal speichern
            setEmail(res.updatedUser.email); 
            setWaitingForVerification(true); 
        })
        .catch((err) => {
            toast.error(err.message || "Fehler beim Ändern der Email");
        })
        .finally(() => {
            setLoading(false);
        })
    }

    return (
    <>
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Email ändern</h2>

            <div className="flex flex-col gap-4">
            <input
                type="email"
                name="email"
                placeholder="Neue Email"
                className="inputStyle"
                value={email}
                onChange={handleChange}
            />

            {waitingForVerification && (
                <p className="text-sm text-red-600">
                Bitte überprüfen Sie Ihre E-Mail-Adresse und bestätigen Sie den Link.
                </p>
            )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
            <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            >
                Abbrechen
            </button>
            <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
                {loading ? "Speichern..." : "Speichern"}
            </button>
            </div>
        </div>
        </div>
    </>
);

}

