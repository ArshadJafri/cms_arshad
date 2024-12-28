import db from "@/db";

export async function POST(req) {
  console.log("Received MeetingFlag POST Request");
  const body = await req.json();
  const meetingflag = body;
  console.log("This is meeting flag", JSON.stringify(meetingflag));
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const [existing] = await connection.query(
      "SELECT * FROM meetingflag WHERE conference_id = ?",
      [meetingflag.selectedConferenceId]
    );

    if (existing.length > 0) {
      await connection.query(
      "UPDATE meetingflag SET started = ? WHERE conference_id = ?",
      [meetingflag.started, meetingflag.selectedConferenceId]
      );
    } else {
      await connection.query(
      "INSERT INTO meetingflag (conference_id, started) VALUES (?, ?)",
      [meetingflag.selectedConferenceId, meetingflag.started]
      );
    }

    await connection.commit();

    return new Response(
      JSON.stringify({ message: "Resource processed successfully" }),
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

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const conference_id = url.searchParams.get("conference_id");
    const connection = await db.getConnection();
    const [result] = await connection.query(
      "SELECT started FROM meetingflag WHERE conference_id = ?",
      [conference_id]
    );
    console.log("this is result",  result);

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
        message: "Error fetching meetingflag.",
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
