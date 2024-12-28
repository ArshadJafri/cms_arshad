import db from "@/db";
import { NextResponse } from "next/server";
export async function POST(req, res) {
  console.log("Received sessions POST Request");

  const body = await req.json();
  const {
    conference_id,
    agenda,
    presentation_topics,
    speaker,
    start_time,
    end_time,
    live_streaming_link,
    recording_link,
  } = body;
  if (
    !conference_id ||
    !agenda ||
    !presentation_topics ||
    !speaker ||
    !start_time ||
    !end_time
  ) {
    return NextResponse.json(
      {
        error:
          "All fields except live_streaming_link and recording_link are required.",
      },
      { status: 400 }
    );
  }
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const [result] = await connection.query(
      " INSERT INTO sessions (conference_id, agenda, presentation_topics, speaker, start_time, end_time, live_streaming_link, recording_link) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        conference_id,
        agenda,
        presentation_topics,
        speaker,
        start_time,
        end_time,
        live_streaming_link || null,
        recording_link || null,
      ]
    );
    console.log(result);
    await connection.commit();
    return NextResponse.json({
      message: "Session added successfully!",
      sessionId: result.insertId,
    });
  } catch (err) {
    await connection.rollback();
    console.error("Error adding session:", err);
    return NextResponse.json(
      { error: "Failed to add session." },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}
export async function GET(req, res) {
  const url = new URL(req.url);
  const conference_id = url.searchParams.get("conference_id");
  try {
    const [sessions] = await db.query(
      "SELECT * FROM sessions WHERE conference_id = ?",
      [conference_id]
    );
    return NextResponse.json(sessions);
  } catch (err) {
    console.error("Error retrieving sessions:", error);
    return NextResponse.json(
      { error: "Failed to retrieve sessions." },
      { status: 500 }
    );
  }
}
export async function PUT(req, res) {
  const url = new URL(req.url);
  const session_id = url.searchParams.get("session_id");
  const conference_id = url.searchParams.get("conference_id");

  if (!session_id || !conference_id) {
    return NextResponse.json(
      { message: "Session ID and Conference ID are required" },
      { status: 400 }
    );
  }
  const {
    agenda,
    presentation_topics,
    speaker,
    start_time,
    end_time,
    live_streaming_link,
    recording_link,
  } = await req.json();
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const query = `
        UPDATE sessions
        SET 
            agenda = ?,
            presentation_topics = ?,
            speaker = ?,
            start_time = ?,
            end_time = ?,
            live_streaming_link = ?,
            recording_link = ?
        WHERE
            id = ? AND conference_id = ?
    `;
    const [result] = await connection.execute(query, [
      agenda,
      presentation_topics,
      speaker,
      start_time,
      end_time,
      live_streaming_link,
      recording_link,
      session_id,
      conference_id,
    ]);
    await connection.commit();
    if (result.affectedRows > 0) {
      return NextResponse.json({ message: "Session updated successfully" });
    } else {
      return NextResponse.json(
        { message: "Session not found or no changes made" },
        { status: 404 }
      );
    }
  } catch (err) {
    await connection.rollback();
    console.error("Error updating session:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}
