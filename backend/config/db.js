import mysql from "mysql";
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
  multipleStatements: false,
  connectTimeout: 20000, // 20 Sekunden
  acquireTimeout: 20000, // 20 Sekunden
  ...(process.env.MYSQL_SSL === "true"
    ? { ssl: { minVersion: "TLSv1.2", rejectUnauthorized: true } }
    : {}),
});

export default pool;
