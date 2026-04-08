import express, { Request, Response } from "express";
import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";
dotenv.config({path: path.resolve(__dirname, "..", ".env")});
const app = express();
const PORT = 3000;

// Exportar variables de entorno ejecuntado el .sh o .bat
const pool = new Pool({
	user: process.env.PGUSER,
	host: process.env.PGHOST,
	database: process.env['PGDATABASE'],
	port: Number(process.env['PGPORT']),
	password: process.env['PGPASSWORD'],
});

pool.on("connect", () => {
	console.log("Connected to Ping Pong");
});



app.get("/", async (req: Request, res: Response) => {
  const matches =  await pool.query('SELECT * FROM ping_pong_sport.matches');
  return res.json(matches.rows)  
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
