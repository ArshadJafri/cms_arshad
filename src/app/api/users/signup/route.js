import db from "@/db";
import bcrypt from "bcryptjs";

export async function POST(req) {
  console.log("Received SignUp POST Request");
  const body = await req.json();
  const { username, email, password } = body;
  if (!username || !password) {
    return new Response(
      JSON.stringify({ message: "Email and password are required" }),
      { status: 400 }
    );
  }
  const connection = await db.getConnection();
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await connection.beginTransaction();
    const [user] = await connection.query(
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
      [username, email, hashedPassword, "user"]
    );
    await connection.commit();
    return new Response(
      JSON.stringify({ message: "Your account created successfully!" }),
      { status: 201 }
    );
  } catch (err) {
    await connection.rollback();
    console.log(err);
    return new Response(
      JSON.stringify({ message: "Error creating Account. Please Try Again" }),
      { status: 500 }
    );
  } finally {
    await connection.release();
  }
}
