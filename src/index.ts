import express, { Request, Response } from "express";
import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";
import { appendFileSync } from "fs";
dotenv.config({path: path.resolve(__dirname, "..", ".env")});
const app = express();
app.use(express.json());
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "..", "src/views"));

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

const schema = "ping_pong_sport"

app.get("/matches", (_: Request, res: Response) => {
	return res.render("matches");
})

app.post("/matches", async (req: Request, res: Response) => {
	const player_1: string = req.body.player_1;
	const player_2: string = req.body.player_2;
	const columns = 'player_1, player_2';	

	await pool.query(`INSERT INTO ${schema}.matches (${columns}) VALUES ('${player_1}', '${player_2}')`);
	return res.status(201).json({message: "todo zarpado"});
});
/*app.get("/matches/:match_id", async (req: Request, res: Response) => {
  const match_id: Number = Number(req.params.match_id);
  const matches =  await pool.query(`SELECT * FROM ping_pong_sport.matches WHERE match_id = ${match_id}`);
  return res.json(matches.rows)  
});*/

app.get("/sets/:match_id", async (req: Request, res: Response) => {
  const match_id = req.params.match_id;
  const matches =  await pool.query(`SELECT * FROM ping_pong_sport.sets WHERE match_id = ${match_id}`);
  return res.json(matches.rows)  
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
