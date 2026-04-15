import express, { Request, Response } from "express";
import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";
import { PingPongSet } from "./types/pingPong";

dotenv.config({ path: path.resolve(__dirname, "..", ".env") });
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "src/public")));
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "..", "src/views"));

const PORT = 3000;
const schema = "ping_pong_sport"

function match_winner_by_sets(player_1_id: number, player_2_id: number, sets: PingPongSet[]): number {
	let setsWonByP1 = 0;
	let setsWonByP2 = 0;

	for (const set of sets) {
		if (set.points_p1 > set.points_p2) {
			setsWonByP1++;
		}
		else {
			setsWonByP2++;
		}
	}

	return setsWonByP1 > setsWonByP2 ? player_1_id : player_2_id;
}

// Env Variables
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


// MATCHES POST
app.post("/matches", async (req: Request, res: Response) => {
	const { player_1_id, player_2_id, sets } = req.body;

	// Hardcoded.
	const winner_id = match_winner_by_sets(player_1_id, player_2_id, sets);
	const client = await pool.connect();

	try {
		await client.query('BEGIN');
		const insert_match_id = `
			INSERT INTO ping_pong_sport.matches (player_1_id, player_2_id, winner_id) 
			VALUES ($1, $2, $3) RETURNING match_id
		`;
		const match_result = await client.query(insert_match_id, [player_1_id, player_2_id, winner_id]);
		const new_match_id = match_result.rows[0].match_id;

		let set_number = 1;
		for (const set of sets) {
			const insert_set_query = `
				INSERT INTO ping_pong_sport.sets (set_number, match_id, points_player_1, points_player_2)
				VALUES ($1, $2, $3, $4)
			`;
			await client.query(insert_set_query, [set_number, new_match_id, set.points_p1, set.points_p2]);
			set_number++;
		}

		// Commit
		await client.query('COMMIT');
		res.status(201).json({ message: "Match and sets saved succesfully", match_id: new_match_id });

	} catch (error) {
		// Rollback everything
		await client.query('ROLLBACK');
		console.error("Abort:", error);
		res.status(500).json({ error: "Can't save match" });
	} finally {
		// Free pool
		client.release();
	}
});
// MATCHES GET
app.get("/matches", (_: Request, res: Response) => {
	return res.render("matches");
})

app.get("/sets/:match_id", async (req: Request, res: Response) => {
	const match_id = req.params.match_id;
	const matches = await pool.query(`SELECT * FROM ping_pong_sport.sets WHERE match_id = ${match_id}`);
	return res.json(matches.rows)
});

app.listen(PORT, () => {
	console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
