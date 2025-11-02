import React from "react";
import { Link } from "react-router-dom";

export default function verifyEmail() {
  return (
    <>
      <div className="flex items-center justify-center py-24">
        <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">
            E-Mail Bestätigung
          </h2>
          <p className="text-gray-700 mb-6">
            Wir haben Ihnen eine E-Mail zur Bestätigung Ihres Kontos gesendet.
            Bitte überprüfen Sie Ihren Posteingang und folgen Sie den
            Anweisungen in der E-Mail, um Ihre Registrierung abzuschließen.
          </p>

          <Link to="/login">
            <button className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md shadow-md self-center">
              Zurück zum Login
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
