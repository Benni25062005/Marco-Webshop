import {
  saveCodeToDB,
  getCodeFromDB,
  markPhoneAsVerified,
} from "../models/smsModel.js";
import dotenv from "dotenv";
import twilio from "twilio";

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export async function sendVerificationCode(phone) {
  const code = Math.floor(1000 + Math.random() * 9000).toString();

  await client.messages.create({
    body: `Ihr Code lautet: ${code}. Geben Sie diesen zur Bestätigung in der App ein.`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phone,
  });

  console.log(`Verifizierungscode ${code} an ${phone} gesendet`);

  return code;
}

export async function storeCode(idUser, code) {
  await saveCodeToDB(idUser, code);
}

export async function verifyStoredCode(idUser, code) {
  const storedCode = await getCodeFromDB(idUser);
  if (storeCode === code) {
    await markPhoneAsVerified(idUser);
    return true;
  }
  return false;
}
