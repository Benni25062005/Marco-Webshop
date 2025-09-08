import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const useSsl = process.env.MYSQL_SSL === "true";

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
  ...(useSsl ? { ssl: { minVersion: "TLSv1.2" } } : {}), // i. d. R. reicht das bei Railway
});

export default pool;
