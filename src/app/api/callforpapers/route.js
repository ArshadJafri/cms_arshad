import db from "@/db";

export async function POST(req, res) {
  console.log("Received CallForPaper POST Request");

  const body = await req.json();
  const { conference_id, submission_guidelines, importantDates, faqs } = body;
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const [callForPaperResult] = await connection.query(
      "INSERT INTO callforpaper (conference_id, submission_guidelines) VALUES (?, ?)",
      [conference_id, submission_guidelines]
    );

    const callforpaper_id = callForPaperResult.insertId;

    for (const date of importantDates) {
      await connection.query(
        "INSERT INTO important_dates (callforpaper_id, event_name, event_date) VALUES (?, ?, ?)",
        [callforpaper_id, date.event_name, date.event_date]
      );
    }

    for (const faq of faqs) {
      await connection.query(
        "INSERT INTO faqs (callforpaper_id, question, answer) VALUES (?, ?, ?)",
        [callforpaper_id, faq.question, faq.answer]
      );
    }
    await connection.commit();
    return new Response(
      JSON.stringify({ message: "Call for Papers created successfully!" }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    await connection.rollback();
    return new Response(
      JSON.stringify({
        message: "Failed to create Call for Papers",
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
    const url = new URL(req.url);
    const conference_id = url.searchParams.get('conference_id');

  try {
    const [callForPaper] = await db.query(
      "SELECT * FROM callforpaper WHERE conference_id = ?",
      [conference_id]
    );

    if (callForPaper.length === 0) {
      return new Response(
        JSON.stringify({
          message: "No Call for Papers found for this conference.",
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const callforpaper_id = callForPaper[0].id;

    console.log(callForPaper);
    const [importantDates] = await db.query(
      "SELECT * FROM important_dates WHERE callforpaper_id = ?",
      [callforpaper_id]
    );

    const [faqs] = await db.query(
      "SELECT * FROM faqs WHERE callforpaper_id = ?",
      [callforpaper_id]
    );

    return new Response(
      JSON.stringify({ callforpaper: callForPaper[0], importantDates, faqs }),
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
        message: "Error fetching Call for Papers data.",
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
