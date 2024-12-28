import db from "@/db";
import { NextResponse } from "next/server";

export async function PUT(req, res) {
  console.log("Received PUT request from Users Management");
  const url = new URL(req.url);
  const email = url.searchParams.get("email");
  const role = url.searchParams.get("role");

  if (!email || !role) {
    return NextResponse.json(
      { message: "Email and Role are required" },
      { status: 400 }
    );
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const query = `
          UPDATE users
          SET 
              role = ?
          WHERE
              email = ?
      `;
    const [result] = await connection.execute(query, [role, email]);
    await connection.commit();
    if (result.affectedRows > 0) {
      return NextResponse.json({ message: "User Role Updated Successfully" });
    } else {
      return NextResponse.json({ message: "User not found " }, { status: 404 });
    }
  } catch (err) {
    await connection.rollback();
    console.error("Error Updating User Role:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}
