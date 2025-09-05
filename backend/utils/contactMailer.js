import nodemailer from "nodemailer";

export const sendContactEmail = ({ vorname, nachname, email, nachricht }) => {
  if (!vorname || !nachname || !email || !nachricht) {
    console.error("Ungültige Parameter für sendContactEmail:", {
      vorname,
      nachname,
      email,
      nachricht,
    });
  }

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: { name: "Webbshop Kontaktformular", address: process.env.EMAIL },
    to: process.env.EMAIL,
    replyTo: email,
    subject: `Neue Kontaktanfrage von ${vorname} ${nachname}`,
    html: `
     <div style="font-family:Arial, sans-serif; max-width:600px; margin:auto; padding:24px; border:1px solid #e5e7eb; border-radius:12px; background:#ffffff;">
        <h2 style="color:#dc2626;">Neue Nachricht vom Kontaktformular</h2>
        <p><strong>Name:</strong> ${vorname} ${nachname}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p style="margin-top:16px;"><strong>Nachricht:</strong></p>
        <p>${nachricht}</p>
      </div>
    `,
    text: `Neue Kontaktanfrage von ${vorname} ${nachname}: ${nachricht}`,
  };

  return transporter.sendMail(mailOptions);
};
