// config/db.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : 3306,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 20_000,
  ssl: {
    minVersion: "TLSv1.2",
    rejectUnauthorized: false, // <-- PRAGMATISCH: akzeptiere self-signed (Railway)
    // Wenn du später ein CA-Zertifikat hast:
    // ca: process.env.MYSQL_CA?.replace(/\\n/g, "\n"),
  },
});

export default pool;
