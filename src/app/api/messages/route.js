import db from "@/db";

export async function POST(req) {
    const { username, message } = await req.json();
    const [result] = await db.execute(
        'INSERT INTO messages (username, message) VALUES (?, ?)',
        [username, message]
    );
    return new Response(JSON.stringify({ id: result.insertId }), { status: 201 });
}

export async function GET(req) {
    const [rows] = await db.execute(
        'SELECT * FROM messages WHERE created_at > NOW() - INTERVAL 10 MINUTE ORDER BY created_at DESC'
    );
    return new Response(JSON.stringify(rows), { status: 200 });
}