import dotenv from "dotenv";
dotenv.config();


import express from "express";
import { sendVerificationCode } from "../services/smsService.js";
import db from "../config/db.js";


const router = express.Router();

router.post("/send-sms-code", async (req, res)  => {
     console.log(req.body)

    const {phone, idUser} = req.body;
   
    

    if (!phone) {
        console.error("Keine Telefonnummer gefunden");
        return res.status(400).json({message: "Telefonnummer fehlt"})
    }

    try {
        const code = await sendVerificationCode(phone)

        const q = "UPDATE user SET phoneCode = ?, phoneCodeCreatedAt = NOW() WHERE idUser = ?";
        db.query(q, [code, idUser], (err) => {
            if(err){
                console.error("Fehler beim Speichern des Codes");
                return res.status(500).json({message: "Fehler beim Speichern des Codes"});
            }
            return res.status(200).json({message: "Code wurde erfolgreich gesendet!"})
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: "SMS konnte nicht gesendet werden"});
    }

})

export default router;
