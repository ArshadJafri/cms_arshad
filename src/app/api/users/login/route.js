import db from "@/db";
import bcrypt from "bcryptjs";

export async function GET(req) {
    try {
      const [users] = await db.query("SELECT * FROM users");
      
      return new Response(JSON.stringify(users), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      return new Response(
        JSON.stringify({ message: "Error fetching users" }),
        {
          status: 500,
        }
      );
    }
  }

export async function POST(req) {
  console.log("Received Login POST Request");
  const body = await req.json();
  const { username, password } = body;
  if (!username || !password) {
    return new Response(
      JSON.stringify({ error: "Email and password are required" }),
      { status: 400 }
    );
  }
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const [user] = await connection.query(
      "SELECT * from users WHERE email = ?",
      [username]
    );
   
    if (user.length == 0) {
      return new Response(
        JSON.stringify({
          message: `We don't have your account. Please do register`,
        }),
        { status: 401 }
      );
    }
    const isPasswordMatch =
      user &&
      user[0].password &&
      (await bcrypt.compare(password, user[0].password));

    if (isPasswordMatch) {
      return new Response(
        JSON.stringify(user[0]),
        { status: 200 }
      );
    } else {
      return new Response(JSON.stringify({ message: "Invalid credentials" }), {
        status: 401,
      });
    }
  } catch (err) {
    await connection.rollback();
    console.log(err);
    return new Response(JSON.stringify({ message: "Error during login" }), {
      status: 500,
    });
  } finally {
    await connection.release();
  }
}


