import React from "react";
import { useNavigate} from "react-router-dom";
import { useSelector, useDispatch   } from "react-redux";
import { logout } from "./features/authSlice";
import { Pencil, LogOut } from "lucide-react";
 
export default function Main() {
    const { user, token } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    }


    



    if (!user) {
        return (
            <div className="flex flex-col justify-center items-center mt-36 w-full">
                <h1 className="text-2xl font-medium">Bitte melden Sie sich an, um Ihr Profil zu sehen.</h1>
            </div>
        )
    }

    return (<>
        

        <div className="flex flex-col justify-center mt-16 ">
            <h1 className="text-3xl text-center font-medium">Willkommen, {user.vorname}!</h1>

            <div className="flex flex-col justif-center items-center">
                {/* Kontaktdaten */}
                <div className="mt-8 border border-red-600 rounded-xl p-6 w-full max-w-4xl mx-auto relative">
                    <Pencil className="h-6 w-6 text-red-600 cursor-pointer absolute top-4 right-4"></Pencil>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6">
                        <div>
                            <p className="text-sm text-gray-500">Vorname</p>
                            <p className="text-md font-medium">{user.vorname}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Nachname</p>
                            <p className="text-md font-medium">{user.nachname}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">E-Mail</p>
                            <p className="text-md font-medium">{user.email}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Telefonnummer</p>
                            <p className="text-md font-medium">{user.telefonnummer}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Passwort</p>
                            <p className="text-md font-medium">********</p>
                        </div>
                    </div>
                </div>

                {/* Adresse */}
                <div className="mt-8 border border-red-600 rounded-xl p-6 w-full max-w-4xl mx-auto relative">
                    <Pencil className="h-6 w-6 text-red-600 cursor-pointer absolute top-4 right-4"></Pencil>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6">
                        <div>
                            <p className="text-sm text-gray-500">Land</p>
                            <p className="text-md font-medium">{user.land}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Ort</p>
                            <p className="text-md font-medium">{user.ort}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Strasse</p>
                            <p className="text-md font-medium">{user.strasse}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">PLZ</p>
                            <p className="text-md font-medium">{user.plz}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}
