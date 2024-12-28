import db from "@/db";

export async function GET(req) {
  try {
    const [conferences] = await db.query("SELECT * FROM conferences");
    
    return new Response(JSON.stringify(conferences), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Error fetching conferences" }),
      {
        status: 500,
      }
    );
  }
}

export async function POST(req) {
  console.log("Received Conferences POST Request");

  const body = await req.json();
  const {
    name,
    conf_description,
    startDate,
    endDate,
    location,
    max_tickets,
    ticketTypes
  } = body;
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const [conferenceResult] = await connection.query(
      "INSERT INTO conferences (name, conf_description, start_date, end_date, location, max_tickets) VALUES (?, ?, ?, ?, ?, ?)",
      [name, conf_description, startDate, endDate, location, max_tickets]
    );

    const conferenceId = conferenceResult.insertId;

    for (const ticketType of ticketTypes) {
      await connection.query(
        "INSERT INTO ticket_types (conference_id, ticket_type, price) VALUES (?, ?, ?)",
        [conferenceId, ticketType.type, ticketType.price]
      );
    }

    await connection.commit();

    return new Response(
      JSON.stringify({ message: "Conference added successfully" }),
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
      JSON.stringify({ message: "Error adding conference", errormsg: err.message }),
      {
        status: 500,
      }
    );
  }finally{
    connection.release();
  }
}
