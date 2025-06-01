import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateContact, updateAdress, setUser, fetchUserById } from "./features/userSlice";
import toast from "react-hot-toast";
import { Pencil, Check} from "lucide-react"
import NewPasswordModal from "./components/Modals/NewPasswordModal";
import EmailChangeModal from "./components/Modals/ChangeEmailModal";
import ChangeNumberModal from "./components/Modals/ChangeNumberModal";

export default function Main() {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [editMode, setEditMode] = useState(false);
  const [editAddressMode, setEditAddressMode] = useState(false);
  const [invalidFields, setInvalidFields] = useState([]);
  const [invalidAddressFields, setInvalidAddressFields] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);


  const [formData, setFormData] = useState({
    vorname: user.vorname,
    nachname: user.nachname,
    email: user.email,
    telefonnummer: user.telefonnummer,
    land: user.land,
    ort: user.ort,
    strasse: user.strasse,
    plz: user.plz,
  });

  const countryDialCodes = {
    ch: "+41",
    at: "+43",
    de: "+49"
  }

  const getCountryCode = (land) => {
    switch (land.toLowerCase()) {
      case "schweiz":
        return "ch";
      case "österreich":
        return "at";
      case "deutschland":
        return "de";

    }
  }

  const countryCode = getCountryCode(user.land);
  const dialCode = countryDialCodes[countryCode];


 useEffect(() => {
  if (!user) {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      dispatch(setUser(JSON.parse(savedUser)));
    }
  }
}, []);

useEffect(() => {
  if (!user) return;


  if (user) {
    setFormData({
      vorname: user.vorname,
      nachname: user.nachname,
      email: user.email,
      telefonnummer: user.telefonnummer,
      land: user.land,
      ort: user.ort,
      strasse: user.strasse,
      plz: user.plz,
    });
  }
}, [user?.isVerifiedEmail]);



  const validateForm = (data, requiredFields) => {
    const invalidFields = [];

    requiredFields.forEach((field) => {
      const value = data[field];

      if (field === "telefonnummer") {
        if (!value || isNaN(value) || String(value).trim().length < 6) {
          invalidFields.push(field);
        }
      } else {
        if (typeof value !== "string" || value.trim() === "") {
          invalidFields.push(field);
        }
      }
    });

    return invalidFields;
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactSave = () => {
    const required = ["vorname", "nachname", "email", "telefonnummer"];
    const invalid = validateForm(formData, required);


    setInvalidFields(invalid);

    if (invalid.length > 0) {
      toast.error("Bitte füllen Sie alle Kontaktfelder korrekt aus.");
      return;
    }
    
      setEditMode(false);
      dispatch(
      updateContact({
        id: user.idUser,
        vorname: formData.vorname,
        nachname: formData.nachname,
        email: formData.email,
        telefonnummer: formData.telefonnummer,
      })
      )
        .unwrap()
        .then((res) => {
          dispatch(setUser(res.updatedUser)); 
          localStorage.setItem("user", JSON.stringify(res.updatedUser)); 
          setFormData(res.updatedUser);
          toast.success("Kontakt gespeichert");
        })
        .catch(() => toast.error("Fehler beim Speichern der Daten"));
    
  };

  const handleAddressSave = () => {
    const required = ["land", "ort", "strasse", "plz"];
    const invalid = validateForm(formData, required);

    setInvalidAddressFields(invalid); // 👈 speichere ungültige Felder

    if (invalid.length > 0) {
      toast.error("Bitte füllen Sie alle Adressfelder korrekt aus.");
      return;
    }

    setEditAddressMode(false);
    dispatch(
      updateAdress({
        id: user.idUser,
        land: formData.land,
        ort: formData.ort,
        strasse: formData.strasse,
        plz: formData.plz,
      })
    )
      .unwrap()
      .then((res) => {
        dispatch(setUser(res.updatedUser));
        localStorage.setItem("user", JSON.stringify(res.updatedUser));
        setFormData(res.updatedUser);
        toast.success("Adresse gespeichert");
      })
      .catch(() => toast.error("Fehler beim Speichern der Daten"));
  };


  if (!user) {
    return (
      <div className="flex justify-center items-center mt-36 w-full">
        <h1 className="text-2xl font-medium">Bitte melden Sie sich an.</h1>
      </div>
    );
  }

  return (
  <>
    {modalOpen && (
      <NewPasswordModal
      isOpen={modalOpen}
      onClose={() => setModalOpen(false)}
      idUser={user.idUser}
    />
    )}

    {emailModalOpen && (
      <EmailChangeModal 
      isOpen={emailModalOpen}
      onClose={() => setEmailModalOpen(false)}
      idUser={user.idUser}
      vorname={user.vorname}
      />
    )}

    {phoneModalOpen && (
      <ChangeNumberModal 
      isOpen={phoneModalOpen}
      onClose={() => setPhoneModalOpen(false)}
      
      />
    )}
    

    <div className="flex flex-col justify-center mt-16 px-4 w-full">
      <h1 className="text-3xl text-center font-medium mb-4">
        Willkommen, {user.vorname}!
      </h1>

      <div className="flex flex-col items-center w-full">
        {/* Kontaktinformationen */}
        <div className="mt-8 border border-red-600 rounded-xl px-4 py-6 sm:px-6 w-full max-w-4xl relative">
          {editMode ? (
            <Check
              onClick={handleContactSave}
              className="h-8 w-8 text-red-600 cursor-pointer absolute top-4 right-4"
            />
          ) : (
            <Pencil
              onClick={() => setEditMode(true)}
              className="h-6 w-6 text-red-600 cursor-pointer absolute top-4 right-4"
            />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
            {["vorname", "nachname", "email", "telefonnummer"].map((field) => (
              <div key={field} className="w-full">
                <p className="text-sm text-gray-500">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </p>

                {field === "email" ? (
                  <>
                    <p className="text-md font-medium break-words">{formData[field]}</p>
                    <button onClick={() => setEmailModalOpen(true)} className="text-sm text-blue-600 hover:underline">
                      E-Mail ändern
                    </button>
                  </>
                ) : field === "telefonnummer" && dialCode ? (
                    <>
                    <p className="text-md font-medium break-words">{dialCode} {formData[field]}</p>
                    <button onClick={() => setPhoneModalOpen(true)} className="text-sm text-blue-600 hover:underline">
                      Telefonnummer ändern
                    </button>
                    </>
                ) : editMode ? (
                    <input
                      type="text"
                      name={field}
                      className={`ProfileInputyStyle w-full max-w-md ${
                        invalidFields.includes(field) && editMode ? "border-red-500" : ""
                      }`}
                      value={formData[field]}
                      onChange={handleChange}
                  />
                ) : (
                    <p className="text-md font-medium break-words">
                      {formData[field]}
                    </p>
                )}
              </div>
            ))}
            
            <div className="w-full">
              <div className="items-center justify-between"> 
                <div>
                  <p className="text-sm text-gray-500">Passwort</p>
                  <p className="text-md font-medium">********</p>
                </div>
                
                <button onClick={() => setModalOpen(true)} className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 duration-300 transition-colors">
                  Passwort ändern
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Adresse */}
        <div className="mt-8 border border-red-600 rounded-xl px-4 py-6 sm:px-6 w-full max-w-4xl relative">
          {editAddressMode ? (
            <Check
              onClick={handleAddressSave}
              className="h-8 w-8 text-red-600 cursor-pointer absolute top-4 right-4"
            />
          ) : (
            <Pencil
              onClick={() => setEditAddressMode(true)}
              className="h-6 w-6 text-red-600 cursor-pointer absolute top-4 right-4"
            />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
            {["land", "ort", "strasse", "plz"].map((field) => (
              <div key={field} className="w-full">
                <p className="text-sm text-gray-500">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </p>
                {editAddressMode ? (
                  <input
                    type="text"
                    name={field}
                    className={`ProfileInputyStyle w-full max-w-md ${
                      invalidAddressFields.includes(field) && editAddressMode ? "border-red-500" : ""
                    }`}
                    value={formData[field]}
                    onChange={handleChange}
                  />
                ) : (
                  <p className="text-md font-medium break-words">{formData[field]}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </>
);

}
