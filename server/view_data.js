import pool from './db.js';

const viewData = async () => {
    try {
        console.log("Fetching machines from PostgreSQL...");
        const res = await pool.query('SELECT * FROM machines');

        if (res.rows.length === 0) {
            console.log("No machines found in database.");
        } else {
            console.table(res.rows.map(m => ({
                ID: m.id,
                Status: m.status,
                Accumulated: (m.accumulatedTime / 3600000).toFixed(2) + 'h',
                Target: (m.targetTime / 3600000).toFixed(2) + 'h',
                RunningBeforeOutage: m.wasRunningBeforeOutage
            })));
        }

        console.log("\nUsers:");
        const users = await pool.query('SELECT id, username FROM users');
        console.table(users.rows);

    } catch (err) {
        console.error("Error fetching data:", err);
    } finally {
        pool.end();
    }
};

viewData();
