import React from "react";
import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { verifySms } from "../../../features/user/userSlice";

export default function CodeNumberModal({ onCodeChange }) {
  const [code, setCode] = useState(["", "", "", ""]);
  const inputsRef = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 3) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  useEffect(() => {
    onCodeChange(code.join(""));
  }, [code]);

 return (
  <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
      <h2 className="text-2xl font-medium mb-4 ">Code eingeben</h2>

      <div className="flex gap-3 justify-center mt-4 mb-6">
        {code.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputsRef.current[index] = el)}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="w-12 h-12 text-center text-xl border border-gray-400 rounded-xl"
          />
        ))}
      </div>

      <div className="flex justify-between gap-4">
        <button
          
          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Code bestätigen
        </button>

        <button
          
          className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
        >
          Code erneut senden
        </button>
      </div>
    </div>
  </div>
);

}
