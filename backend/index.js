import express from "express"
import mysql from "mysql"
import cors from "cors"
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';


import dotenv from "dotenv"
dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())


const db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
})

app.get("/", (req,res)=>{
    res.json("hello this is the backend")
})

app.get("/produkte", (req,res)=>{
    const kategorie = req.query.kategorie;
    const q = kategorie ? "SELECT * FROM produkte WHERE kategorie = ?" : "SELECT * FROM produkte";

    const values = kategorie ? [kategorie] : [];

    db.query(q, values, (err,data)=>{
        if(err) return res.json(err);

        const transformed = data.map((item) => {
            let image = null;

            if(item.Bild) {
                const base64Image = Buffer.from(item.Bild).toString("base64");
                image = `data:image/jpeg;base64,${base64Image}`;
            }

            return {
                ...item,
                Bild: image,
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
                let image = null;
    
                if(item.Bild) {
                    const base64Image = Buffer.from(item.Bild).toString("base64");
                    image = `data:image/jpeg;base64,${base64Image}`;
                }
    
                return {
                    ...item,
                    Bild: image,
                    Details: item.Details ? JSON.parse(item.Details) : null,
                };
            
            });
            return res.json(transformed[0])
        }else{
            return res.json({})
        }
        
    })
})

app.post("/user", async (req,res) => {
    const { email, password, vorname, nachname, telefonnummer } = req.body;

    try{
        const hashedPassword = await bcrypt.hash(password, 10);
        const emailToken = crypto.randomBytes(64).toString('hex');
        const q = "INSERT INTO `user`(`email`, `password`, `vorname`, `nachname`, `telefonnummer`, `emailToken`, `isVerifiedEmail`) VALUES (?, ?, ?, ?, ?, ?, ?)"

        const values = [email, hashedPassword, vorname, nachname, telefonnummer, emailToken, 0];
        
        db.query(q, values, (err,data) => {
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
                `
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error("Fehler beim Senden der E-Mail:", error);
                    return res.status(500).json({ message: "Fehler beim Senden der E-Mail", error });
                }

                console.log("Verifizierungs-E-Mail gesendet:", info.messageId);
                return res.status(201).json({ message: "User erfolgreich erstellt. Bitte überprüfen Sie Ihre E-Mail, um Ihre Adresse zu bestätigen." });
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

    const q = "SELECT idUser, email, vorname, nachname, telefonnummer, password, isVerifiedEmail FROM user WHERE email = ?";

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
            }
        });

    }) 
})


const port = process.env.PORT || 8800

app.listen(port, ()=>{
    console.log("Connected to backend!")
});