import express from "express"
import mysql from "mysql"
import cors from "cors"
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import db from "./config/db.js";
import dotenv from "dotenv"
import smsRoutes from "./routes/smsRoutes.js";


dotenv.config()

const app = express()
app.use(cors());
app.use(express.json())

app.get("/", (req,res)=>{
    res.json("hello this is the backend")
})

//#region Produkte


app.get("/produkte", (req,res)=>{
    const kategorie = req.query.kategorie;
    const q = kategorie ? "SELECT * FROM produkte WHERE kategorie = ?" : "SELECT * FROM produkte";

    const values = kategorie ? [kategorie] : [];

    db.query(q, values, (err,data)=>{
        if(err) return res.json(err);

        const transformed = data.map((item) => {
            

            return {
                ...item,
                Details: item.Details ? JSON.parse(item.Details) : null,
            };
        
        });

        return res.json(transformed)
    })
})

app.get("/produkte/:id", (req,res)=>{
    const id = req.params.id;
    const kategorie = req.query.kategorie;
    const q = kategorie ? "SELECT * FROM produkte WHERE idProdukt = ? AND kategorie = ?" : "SELECT * FROM produkte WHERE idProdukt = ?";

    const values = kategorie ? [id, kategorie] : [id];

    db.query(q, values, (err,data)=> {
        if(err) return res.json(err);

        if(data.length > 0) {
            const transformed = data.map((item) => {
                
    
                return {
                    ...item,
                    Details: item.Details ? JSON.parse(item.Details) : null,
                };
            
            });
            return res.json(transformed[0])
        }else{
            return res.json({})
        }
        
    })
})
//#endregion Produkte

//#region user 

app.post("/user", async (req, res) => {
    const { email, password, vorname, nachname, telefonnummer, strasse, plz, ort, land } = req.body;

    try {
        const checkQuery = "SELECT idUser FROM user WHERE email = ?";
        db.query(checkQuery, [email], async (err, result) => {
            if (err) {
                console.error("Fehler beim Abfragen", err);
                return res.status(500).json({ message: "Fehler beim Abfragen des Users", error: err });
            }

            if (result.length > 0) {
                return res.status(400).json({ message: "E-Mail ist bereits registriert!" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const emailToken = crypto.randomBytes(64).toString('hex');
            const q = `INSERT INTO user (email, password, vorname, nachname, telefonnummer, strasse, plz, ort, land, emailToken, isVerifiedEmail)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const values = [email, hashedPassword, vorname, nachname, telefonnummer, strasse, plz, ort, land, emailToken, 0];

            db.query(q, values, (err, data) => {
                if (err) {
                    console.error("Fehler beim Einfügen des Users:", err);
                    return res.status(500).json({ message: "Fehler beim Einfügen des Users", error: err });
                }

                const transporter = nodemailer.createTransport({
                    service: "Gmail",
                    auth: {
                        user: process.env.EMAIL,
                        pass: process.env.EMAIL_PASSWORD
                    },
                });

                const verificationLink = `http://localhost:8800/verify-email?token=${emailToken}`;
                const mailOptions = {
                    from: process.env.EMAIL,
                    to: email,
                    subject: "Bitte bestätigen Sie Ihre E-Mail-Adresse",
                    html: `<div style="font-family:Arial, sans-serif; max-width:600px; margin:auto; padding:24px; border:1px solid #e5e7eb; border-radius:12px; background:#ffffff;">
                    <div style="text-align:center; margin-bottom:32px;">
                    <img src="https://res.cloudinary.com/dv6cae2zi/image/upload/v1752425831/Logo_Marco_rfkt2g.png" alt="Knapp Kaminfeger" style="max-width:120px;" />
                    </div>

                    <h2 style="color:#dc2626;">Hallo ${vorname},</h2>
                    <p style="font-size:16px; color:#111827;">Vielen Dank für deine Registrierung!.</p>

                    <p style="margin:24px 0;">Um deine Registrierung abzuschließen, bestätige bitte deine E-Mail-Adresse über den folgenden Button:</p>

                    <div style="text-align:center; margin:32px 0;">
                    <a href="${verificationLink}"
                        style="display:inline-block; padding:14px 28px; background-color:#dc2626; color:#ffffff; text-decoration:none; border-radius:8px; font-weight:600; font-size:16px;">
                        Jetzt bestätigen
                    </a>
                    </div>

                    <p style="font-size:12px; color:#6b7280; text-align:center;">Falls du dich nicht registriert hast, kannst du diese E-Mail ignorieren.</p>
                </div>`, // dein HTML
                    text: `Bitte bestätigen Sie Ihre E-Mail-Adresse: ${verificationLink}`
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error("Fehler beim Senden der E-Mail:", error);
                        return res.status(500).json({ message: "Fehler beim Senden der E-Mail", error });
                    }

                    console.log("Verifizierungs-E-Mail gesendet:", info.messageId);
                    return res.status(201).json({ message: "User erfolgreich erstellt. Bitte bestätigen Sie Ihre E-Mail." });
                });
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Fehler beim Erstellen des Users", error });
    }
});

app.get("/verify-email", (req, res) => {
    const token = req.query.token;
    if(!token) {
        return res.status(400).send("Kein Token übergeben");
    }

    const q = "UPDATE user SET isVerifiedEmail = 1, emailToken = NULL WHERE emailToken = ?";

    db.query(q, [token], (err, result) => {
        if (err) return res.status(500).send("Fehler beim Verifizieren der E-Mail");
        if (result.affectedRows === 0) {
            return res.status(400).send("Ungültiger Token oder E-Mail bereits verifiziert");
        }

        return res.send("E-Mail erfolgreich verifiziert. Sie können sich jetzt anmelden.");
    });
});

app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    const q = "SELECT idUser, email, vorname, nachname, telefonnummer, password, strasse, plz, ort, land, isVerifiedEmail FROM user WHERE email = ?";

    db.query(q, [email], async (err, data) => {
        if (err) { 
            console.error("SQL Fehler:", err); 
            return res.status(500).json({message: "Serverfehler", error: err}); 
        }
        if (data.length === 0) {
            return res.status(404).json({message: "User nicht gefunden"});
        } 

        const user = data[0];


        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) return res.status(400).json({message: "Falsches Passwort"});
        if (!user.isVerifiedEmail) {
            return res.status(403).json({message: "Bitte bestätigen Sie Ihre E-Mail-Adresse, bevor Sie sich anmelden."});
        }

       const token = jwt.sign(
        { idUser: user.idUser, email: user.email },
        process.env.JWT_SECRET,
        {expiresIn: "1h"}
       );

       res.status(200).json({ 
            token, 
            user: {
                idUser: user.idUser,
                email: user.email,
                vorname: user.vorname,
                nachname: user.nachname,
                telefonnummer: user.telefonnummer,
                strasse: user.strasse,
                plz: user.plz,
                ort: user.ort,
                land: user.land,
            }
        });

    }) 
})

app.put("/user/:id/contact", (req, res) => {
  const { vorname, nachname, email, telefonnummer } = req.body;
  const idUser = req.params.id;

  const q = `
    UPDATE user 
    SET vorname = ?, nachname = ?, email = ?, telefonnummer = ? 
    WHERE idUser = ?
  `;

    

  db.query(q, [vorname, nachname, email, telefonnummer, idUser], (err, result) => {
    if (err) {
      console.error("SQL Fehler:", err);
      return res.status(500).json({ error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User nicht gefunden" });
    }

    const selectQuery = "SELECT * FROM user WHERE idUser = ?";
    db.query(selectQuery, [idUser], (err, result) => {
        if (err) {
            console.error("Fehler beim Abrufen des aktualisierten Users:", err);
            return res.status(500).json({message: "Fehler beim Abrufen", error: err});
        }

        return res.status(200).json({message: "Kontakt wurde erfolgreich gespeichert", updatedUser: result[0]})
    })
  });
});


app.put("/user/:id/address", (req,res) => {
    const { strasse, plz, ort, land} = req.body;
    const idUser = req.params.id;

    const q = "UPDATE user SET strasse = ?, plz = ?, ort = ?, land = ? WHERE idUser = ?"
    const values = [strasse, plz, ort, land, idUser];

    db.query(q, values, (err, data) => {
        if(err) {
            console.error("Fehler beim Aktualisieren der Adresse:", err);
            return res.status(500).json({ message: "Fehler beim Aktualisieren der Adresse", error: err });
        }
        if (data.affectedRows === 0) {
            return res.status(404).json({ message: "User nicht gefunden"});
        }

        const selectQuery = "SELECT * FROM user WHERE idUser = ?";
        db.query(selectQuery, [idUser], (err, result) => {
            if (err) {
                console.error("Fehler beim Abrufen des aktualisierten Users:", err);
                return res.status(500).json({message: "Fehler beim Abrufen", error: err});
            }


            return res.status(200).json({message: "Adresse wurde erfolgreich gespeichert", updatedUser: result[0]})
        })
    })
})

app.get("/user/:id", (req, res) => {
  const idUser = req.params.id;
  db.query("SELECT * FROM user WHERE idUser = ?", [idUser], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length === 0) return res.status(404).json({ message: "User nicht gefunden" });
    res.status(200).json({ user: result[0] });
  });
});

app.put("/user/:id/password", async (req, res) => {
    const idUser = req.params.id;
    const { oldPassword, newPassword } = req.body;

    const q = "SELECT password FROM user WHERE idUser = ?";
    db.query(q, [idUser], async (err, result) => {
        if (err) {
            console.error("Fehler beim Abrufen des Users:", err);
            return res.status(500).json({ message: "Fehler beim Abrufen des Users", error: err});
        }
        if (result.length === 0) {
            return res.status(404).json({ message: "User nicht gefunden"});
        }
        const valid = await bcrypt.compare(oldPassword, result[0].password);
        if(!valid) return res.status(400).json({message: "Aktuelles Passwort ist falsch"});

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updateQuery = "UPDATE user SET password = ? WHERE idUser = ?";

        db.query(updateQuery, [hashedPassword, idUser], (err, data) => {
            if(err) {
                console.error("Fehler beim Aktualisieren des Passworts:", err);
                return res.status(500).json({ message: "Fehler beim Aktualisieren des Passworts", error: err });
            }
            res.status(200).json({ message: "Passwort erfolgreich aktualisiert"});
        });
    });
});

app.put("/user/:id/email", async (req, res) => {
    const idUser = req.params.id;
    const { email, vorname } = req.body;

    const emailToken = crypto.randomBytes(64).toString('hex');
    const q = "UPDATE user SET email = ?, emailToken = ?, isVerifiedEmail = 0 WHERE idUser = ?";

    db.query(q, [email, emailToken, idUser], (err, result) => {
        if(err) {
            console.error("Fehler beim Aktualisieren der E-Mail:", err);
            return res.status(500).json({ message: "Fehler beim Aktualisieren der E-Mail", error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User nicht gefunden"});
        }
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            },
        })

        const verificationLink = `http://localhost:8800/verify-email?token=${emailToken}`;
        const mailOptions = {
                from : process.env.EMAIL,
                to: email,
                subject: "Bitte bestätigen Sie Ihre E-Mail-Adresse",
                html: `
                <div style="font-family:Arial, sans-serif; max-width:600px; margin:auto; padding:24px; border:1px solid #e5e7eb; border-radius:12px; background:#ffffff;">
                    <div style="text-align:center; margin-bottom:32px;">
                    <img src="" alt="FeuerTech Logo" style="max-width:120px;" />
                    </div>

                    <h2 style="color:#dc2626;">Hallo ${vorname},</h2>
                    <p style="font-size:16px; color:#111827;">Vielen Dank für deine Registrierung!.</p>

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
                text: `Bitte bestätigen Sie Ihre E-Mail-Adresse, indem Sie auf den folgenden Link klicken: ${verificationLink}`
            };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Fehler beim Senden der E-Mail:", error);
                return res.status(500).json({ message: "Fehler beim Senden der E-Mail", error });
            }

            console.log("Verifizierungs-E-Mail gesendet:", info.messageId);

            const selectQuery = "SELECT * FROM user WHERE idUser = ?";
            db.query(selectQuery, [idUser], (err, result) => {
                if (err) {
                    console.error("Fehler beim Abrufen des aktualisierten Users:", err);
                    return res.status(500).json({message: "Fehler beim Abrufen", error: err});
                }

                return res.status(200).json({ message: "E-Mail erfolgreich aktualisiert. Bitte überprüfen Sie Ihre E-Mail, um Ihre Adresse zu bestätigen.", updatedUser: result[0] });
            })


           
        });
    });
});

app.post("/api/request-reset", (req, res) => {
    const { email } = req.body;
    const code = Math.floor(1000 + Math.random() * 9000).toString();

    const selectQuery = "SELECT vorname FROM user WHERE email = ?";
    db.query(selectQuery, [email], (err, userResult) => {
        if (err || userResult.length === 0) {
            return res.status(404).json({ message: "E-Mail wurde nicht gefunden" });
        }

        const vorname = userResult[0].vorname;

        const updateQuery = "UPDATE user SET resetCode = ?, resetCodeCreatedAt = NOW() WHERE email = ?";
        db.query(updateQuery, [code, email], (err, result) => {
            if (err) {
                console.error("Fehler beim Setzen des Codes", err);
                return res.status(500).json({ message: "Fehler beim Setzen des Codes", err });
            }

            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                post: 465,
                secure: true,
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.EMAIL_PASSWORD,
                },
            });

            const mailOptions = {
                from: process.env.EMAIL,
                to: email,
                subject: "Passwort zurücksetzen",
                html: `
                    <div style="font-family:sans-serif; max-width:600px; margin:auto; padding:24px; border:1px solid #e5e7eb; border-radius:12px; background:#f9fafb;">
                        <div style="text-align:center; margin-bottom:32px;">
                            <h1 style="color:#dc2626;">Knapp Kaminkehrer</h1>
                        </div>

                        <h2 style="color:#111827;">Hallo ${vorname},</h2>

                        <p style="margin:20px 0; font-size:16px">du hast angefordert, dein Passwort zurückzusetzen. Gib den folgenden Bestätigungscode in der App ein:</p>

                        <div style="text-align:center; margin:30px 0;">
                            <span style="font-size:32px; font-weight:bold; letter-spacing:4px; color:#dc2626;">${code}</span>
                        </div>

                        <p style="color:#6b7280;">Wenn du das nicht warst, kannst du diese E-Mail ignorieren.</p>

                        <p style="margin-top:40px; font-size:12px; color:#9ca3af; text-align:center;">© 2025 Knapp Kaminkehrer</p>
                    </div>
                `
            };

            transporter.sendMail(mailOptions, (error) => {
                if (error) {
                    console.error("E-Mail konnte nicht gesendet werden", error);
                    return res.status(500).json({ message: "E-Mail konnte nicht gesendet werden", error });
                }

                res.status(200).json({ message: "Code wurde gesendet!" });
            });
        });
    });
});


app.post("/api/reset-password", async (req, res) => {
    const { email, code, newPassword } = req.body;

    const q = "SELECT resetCode, resetCodeCreatedAt FROM user WHERE email = ?";
    db.query(q, [email], async (err, result) => {
        if (err) {
            console.error("Fehler beim Abrufen", err);
            return res.status(500).json({ message: "Fehler beim Abrufen", err });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: "User nicht gefunden" });
        }

        const user = result[0];
        const now = new Date();
        const created = new Date(user.resetCodeCreatedAt);
        if ((now - created) / 1000 > 600) {
            return res.status(400).json({ message: "Code abgelaufen" });
        }

        if (user.resetCode !== code) {
            return res.status(400).json({ message: "Falscher Code" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updateQ = "UPDATE user SET password = ?, resetCode = NULL, resetCodeCreatedAt = NULL WHERE email = ?";

        db.query(updateQ, [hashedPassword, email], (err) => {
            if (err) {
                console.error("Fehler beim Ändern des Passworts", err);
                return res.status(500).json({ message: "Fehler beim Speichern", err });
            }
            res.json({ message: "Passwort erfolgreich geändert" });
        });
    });
});

app.use("/api/sms", smsRoutes);

//#endregion user

//#region Warenkorb
app.get("/api/cartItems", (req, res) => {
    const user_id = req.query.user_id;

    const q = `
        SELECT w.product_id, w.menge, p.Name, p.Preis_brutto, p.Bild
        FROM warenkorb w
        JOIN produkte p ON w.product_id = p.idProdukt
        WHERE w.user_id = ?
    `

    db.query(q, [user_id], (err, data) => {
        if (err) {
            console.error("Fehler beim Abrufen des Warenkorbs:", err);
            return res.status(500).json({ message: "Fehler beim Abrufen des Warenkorbs", error: err });
        }

        const transformed = data.map((item) => {
            

            return {
                ...item,
            }
        });
        return res.status(200).json(transformed);
    })
})

app.post("/api/cart", (req, res) => {
    const { user_id, product_id, menge} = req.body;

    const q = `
        INSERT INTO warenkorb (user_id, product_id, menge)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE menge = menge + VALUES(menge)
    `;
    const values = [user_id, product_id, menge];

    db.query(q, values, (err, data) => {
        if (err) {
            console.error("Fehler beim Hinzufügen zum Warenkorb:", err);
            return res.status(500).json({ message: "Fehler beim Hinzufügen zum Warenkorb", error: err });
        }
        
        return res.status(201).json({ message:"Produkt wurde erfolgreich zum Warenkorb hinzugefügt" });
    });
});

app.delete("/api/cart/:user_id/:product_id", (req, res) => {
  const { user_id, product_id } = req.params;

  const q = "DELETE FROM warenkorb WHERE user_id = ? AND product_id = ?";
  const values = [user_id, product_id];

  db.query(q, values, (err, data) => {
    if (err) {
      console.error("Fehler beim Entfernen aus dem Warenkorb:", err);
      return res.status(500).json({ message: "Fehler beim Entfernen aus dem Warenkorb", error: err });
    }

    if (data.affectedRows === 0) {
      return res.status(404).json({ message: "Produkt nicht im Warenkorb gefunden" });
    }

    return res.status(200).json({ message: "Produkt wurde erfolgreich aus dem Warenkorb entfernt" });
  });
});

app.put("/api/cart/:user_id/:product_id", (req, res) => {
    const { user_id, product_id} = req.params;
    const { menge} = req.body;
    const q = "UPDATE warenkorb SET menge = ? WHERE user_id = ? AND product_ID = ?";
    const values = [menge, user_id, product_id];

    db.query(q, values, (err, data) => {
        if (err) {
            console.error("Fehler beim Aktualisieren der Menge:", err);
            return res.status(500).json({ message: "Fehler beim Aktualisieren den Menge", error: err});
        }
        if (data.affectedRows === 0) {
            return res.status(400).json({ message: "Produkt nicht im Warenkorb gefunden"});
        }

        return res.status(200).json({ message: "Menge erfolgreich aktualisiert"});
    })
})
//#endregion Warenkorb


const port = process.env.PORT || 8800

app.listen(port, ()=>{
    console.log("Connected to backend!")
});