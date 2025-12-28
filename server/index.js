import express from 'express';
import cors from 'cors';
import db from './db.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Get all machines
app.get('/api/machines', async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM machines');
        // Convert boolean fields if needed (pg handles boolean natively, but just in case)
        const machines = rows.map(m => ({
            ...m,
            // Ensure numbers are numbers (BIGINT comes as string in pg sometimes)
            accumulatedTime: parseInt(m.accumulatedTime),
            targetTime: parseInt(m.targetTime),
            startTime: m.startTime ? parseInt(m.startTime) : null
        }));
        res.json({ machines });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Sync all machines (Bulk Update/Upsert)
app.post('/api/machines/sync', async (req, res) => {
    const { machines } = req.body;

    if (!machines || !Array.isArray(machines)) {
        return res.status(400).json({ error: "Invalid data format" });
    }

    const client = await db.connect();
    try {
        await client.query('BEGIN');

        const queryText = `
            INSERT INTO machines (id, "displayId", status, "startTime", "accumulatedTime", "targetTime", "wasRunningBeforeOutage")
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (id) DO UPDATE SET
                status = EXCLUDED.status,
                "startTime" = EXCLUDED."startTime",
                "accumulatedTime" = EXCLUDED."accumulatedTime",
                "wasRunningBeforeOutage" = EXCLUDED."wasRunningBeforeOutage"
        `;

        for (const m of machines) {
            await client.query(queryText, [
                m.id,
                m.displayId,
                m.status,
                m.startTime,
                m.accumulatedTime,
                m.targetTime,
                m.wasRunningBeforeOutage
            ]);
        }

        await client.query('COMMIT');
        res.json({ message: "Synced successfully" });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Transaction failed", err);
        res.status(500).json({ error: "Failed to save data" });
    } finally {
        client.release();
    }
});

// Login Endpoint
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
    }

    try {
        const { rows } = await db.query("SELECT * FROM users WHERE username = $1 AND password = $2", [username, password]);
        if (rows.length > 0) {
            const row = rows[0];
            res.json({ message: "Login success", userId: row.id, username: row.username });
        } else {
            res.status(401).json({ error: "Invalid credentials" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
