import db from "@/db";

export async function POST(req) {
  try {
    console.log("Received POST request for Peer Review");
    const { score, feedback, paper_id, email } = await req.json();

    if (!score || !paper_id || !email) {
      return new Response(
        JSON.stringify({
          message: "Error: Score, paper_id, and email are required",
        }),
        { status: 400 }
      );
    }

    const [result] = await db.query(
      "INSERT INTO PeerReviews (score, feedback, paper_id, email) VALUES (?, ?, ?, ?)",
      [score, feedback, paper_id, email]
    );

    return new Response(
      JSON.stringify({
        message: "Review submitted successfully",
        review_id: result.insertId,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting review:", error);
    return new Response(
      JSON.stringify({ message: "Error: submitting review" }),
      { status: 500 }
    );
  }
}
