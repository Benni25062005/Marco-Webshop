import React from "react";
import { useState, useRef, useEffect } from "react";

export default function CodeInputModal( {onCodeChange} ) {
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
    }

    useEffect(() => {
        onCodeChange(code.join(""));
    }, [code]);

    return (<>
        <div className="flex gap-3 justify-center mt-4"> 
            {code.map((digit, index) => (
                <input 
                    key={index}
                    ref={(el) => (inputsRef.current[index] = el)}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-12 h-12 text-center text-xl border border-gray-400 rounded-xl p-2 mb-4"
                
                
                />
            ))}
        </div>
    </>)
}