import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const enableSsl = process.env.MYSQL_SSL === "true";
const strict = process.env.MYSQL_SSL_STRICT === "true";
const caFromEnv = process.env.MYSQL_CA?.replace(/\\n/g, "\n");

let ssl;
if (enableSsl) {
  ssl = { minVersion: "TLSv1.2" };
  if (strict) {
    if (caFromEnv) ssl.ca = caFromEnv;
    // default: rejectUnauthorized true, wenn CA gesetzt
  } else {
    ssl.rejectUnauthorized = false; // Railway-kompatibel
  }
}

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : 3306,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  ssl: enableSsl ? ssl : undefined,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 20_000,
});

export default pool;
