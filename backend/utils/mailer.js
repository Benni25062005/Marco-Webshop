import nodemailer from "nodemailer";

export const sendVerificationEmail = (to, vorname, token) => {
  if (!to || !vorname || !token) {
    console.error("Ungültige Parameter für sendVerificationEmail:", {
      email,
      vorname,
      token,
    });
    throw new Error("Ungültige Parameter für sendVerificationEmail");
  }

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const verificationLink = `${process.env.BACKEND_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL,
    to,
    subject: "Bitte bestätigen Sie Ihre E-Mail-Adresse",
    html: `
      <div style="font-family:Arial, sans-serif; max-width:600px; margin:auto; padding:24px; border:1px solid #e5e7eb; border-radius:12px; background:#ffffff;">
        <div style="text-align:center; margin-bottom:32px;">
          <img src="https://res.cloudinary.com/dv6cae2zi/image/upload/v1752425831/Logo_Marco_rfkt2g.png" alt="Knapp Kaminfeger" style="max-width:120px;" />
        </div>

        <h2 style="color:#dc2626;">Hallo ${vorname},</h2>
        <p style="font-size:16px; color:#111827;">Vielen Dank für deine Registrierung!</p>

        <p style="margin:24px 0;">Um deine Registrierung abzuschließen, bestätige bitte deine E-Mail-Adresse über den folgenden Button:</p>

        <div style="text-align:center; margin:32px 0;">
          <a href="${verificationLink}"
            style="display:inline-block; padding:14px 28px; background-color:#dc2626; color:#ffffff; text-decoration:none; border-radius:8px; font-weight:600; font-size:16px;">
            Jetzt bestätigen
          </a>
        </div>

        <p style="font-size:12px; color:#6b7280; text-align:center;">Falls du dich nicht registriert hast, kannst du diese E-Mail ignorieren.</p>
      </div>
    `,
    text: `Bitte bestätigen Sie Ihre E-Mail-Adresse: ${verificationLink}`,
  };

  console.log("Vor Mailversnad", to, vorname, token);

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) return reject(error);
      resolve(info);
    });
  });
};
