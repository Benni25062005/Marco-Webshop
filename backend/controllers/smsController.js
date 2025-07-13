import { sendVerificationCode, storeCode, verifyStoredCode } from "../services/smsService.js";

export const sendCode = async (req, res) => {
    const {phone, idUser} = req.body;

    if(!phone || !idUser) {
        return res.status(400).json({message: "Telefonnummer oder Benutzer ID fehlt"});
    }

    try {
        const code = await sendVerificationCode(phone);
        await storeCode(idUser, code);
        return res.status(200).json({message: "Code wurde erfolgreich gesendet!"});
    } catch (err) {
        console.error("SMS-Fehler:", err);
        return res.status(500).json({message: "Fehler beim Senden der SMS"});
    }
};

export const verifyCode = async (req, res) => {
    const {idUser, code} = req.body;

    if(!idUser || !code){
        return res.status(400).json({message:"Fehlende Daten"});
    }

    try {
        const valid = await verifyStoredCode(idUser, code);
        if (!valid) {
        return res.status(401).json({ message: "Falscher Code" });
        }
        return res.status(200).json({ message: "Telefonnummer verifiziert" });
    } catch (err) {
        console.error("Fehler bei Verifizierung:", err);
        return res.status(500).json({ message: "Interner Fehler" });
    }
}