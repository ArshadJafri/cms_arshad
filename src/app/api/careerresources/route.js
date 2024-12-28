import db from "@/db";

export async function POST(req) {
  console.log("Received CareerResources POST Request");
  const body = await req.json();
  const resource = body.resource;
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const [result] = await connection.query(
      "INSERT INTO careerresources (title, description, link, type) VALUES (?, ?, ?, ?)",
      [resource.title, resource.description, resource.link, resource.type]
    );
    await connection.commit();

    return new Response(
      JSON.stringify({ message: "Resource added successfully" }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    await connection.rollback();
    console.log(err);
    return new Response(
      JSON.stringify({
        message: "Error adding Resources",
        errormsg: err.message,
      }),
      {
        status: 500,
      }
    );
  } finally {
    connection.release();
  }
}
export async function GET(req) {
  try {
    const [result] = await db.query(
      "SELECT * FROM careerresources"
    );
    
    return new Response(
      JSON.stringify({ result }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        message: "Error fetching CareerResources.",
        errormsg: err.message,
      }),
      {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
