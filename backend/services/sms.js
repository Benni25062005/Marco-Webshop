import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export async function sendVerificationCode(phone) {
  const code = Math.floor(1000 + Math.random() * 9000).toString();

  await client.messages.create({
    body: `Ihr Code lautet: ${code}. Geben Sie diesen zur Bestätigung in der App ein.`,
    from: fromNumber,
    to: phone,
  });

  return code;
}
