import React, { use, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { updatePassword } from "../../../features/user/userSlice";


export default function PasswordChangeModal({ isOpen, onClose, idUser }) {
    const [form, setForm] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value}));
    }

    const handleSubmit = async () => {
        if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
            toast.error("Bitte füllen Sie alle Felder aus.");
            return;
        }

        if (form.newPassword !== form.confirmPassword) {
            toast.error("Passwörter stimmen nicht überein");
            return;
        }

        setLoading(true);
        
        dispatch(updatePassword({
            id: idUser,
            oldPassword: form.oldPassword,
            newPassword: form.newPassword
        }))
        .unwrap()
        .then(() => {
            toast.success("Passwort erfolgreich geändert");
            onClose();
            setForm({
            oldPassword: "",
            newPassword: "",
            confirmPassword: ""
            });
        })
        .catch((err) => {
            toast.error(err.message || "Fehler beim Ändern des Passworts");
        })
        .finally(() => {
            setLoading(false);
        });
    }


    return(<>
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Passwort ändern</h2>

        <div className="flex flex-col gap-4">
          <input
            type="password"
            name="oldPassword"
            placeholder="Aktuelles Passwort"
            className="inputStyle"
            value={form.oldPassword}
            onChange={handleChange}
          />
          <input
            type="password"
            name="newPassword"
            placeholder="Neues Passwort"
            className="inputStyle"
            value={form.newPassword}
            onChange={handleChange}
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Neues Passwort wiederholen"
            className="inputStyle"
            value={form.confirmPassword}
            onChange={handleChange}
          />
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
    
    
    
    </>)
}