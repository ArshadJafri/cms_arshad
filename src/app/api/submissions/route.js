import db from "@/db";
import sgMail from "@sendgrid/mail";
import { NextResponse } from "next/server";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
export async function POST(req) {
  try {
    const { filename, file, conference_id, paper_title, author_name, email } =
    await req.json();

    const fileBuffer = Buffer.from(file);

    const query =
      "INSERT INTO submissions (conference_id, paper_title, author_name, email, paper_file) VALUES (?, ?, ?, ?, ?)";
    await db.execute(query, [
      conference_id,
      paper_title,
      author_name,
      email,
      fileBuffer,
    ]);

    const msg = {
      to: email, 
      from: "rmakshaykumar08@gmail.com", 
      subject: "Your Paper got Submitted!!",
      text: `Your Submission for paper ${paper_title} got submitted successfully.`,
      attachments: [
      ],
    };
    try {
      await sgMail.send(msg);
      return new Response(JSON.stringify({ message: "Your submission was successful and you will receive a email for the confirmation." }),{
        status: 200,
      });
    } catch (error) {
      console.error("Error sending email:", error);
      return new Response(JSON.stringify({ message: "Failed to Send confirmation email. But we received your submission." }), { status: 500 });
    }
  } catch (error) {
    console.error("Upload error:", error);
    return new Response(JSON.stringify({ error: "File upload failed" }), {
      status: 500,
    });
  }
}

export async function GET(req, res) {
  const url = new URL(req.url);
  const conference_id = url.searchParams.get("conference_id");
  const email = url.searchParams.get("email");
  if (conference_id) {
    try {
      const [submissions] = await db.query(
        "SELECT id, paper_title, author_name, email, created_at FROM submissions WHERE conference_id = ?",
        [conference_id]
      );
      return NextResponse.json(submissions);
    } catch (err) {
      console.error("Error retrieving submissions:", err);
      return NextResponse.json(
        { error: "Failed to retrieve submissions." },
        { status: 500 }
      );
    }
  }
  if (email) {
    console.log(email);
    try {
      const [result] = await db.query(
        "SELECT paper_file FROM submissions WHERE email = ?",
        [email]
      );
      if (result && result[0].paper_file) {
        
        const msg = {
          to: email, 
          from: "rmakshaykumar08@gmail.com", 
          subject: "Your PDF Submission",
          text: "Please find your PDF submission attached.",
          attachments: [
            {
              content: result[0].paper_file.toString("base64"),
              filename: "paper_file.pdf",
              type: "application/pdf",
              disposition: "attachment",
            },
          ],
        };
        try {
          await sgMail.send(msg);
          return new Response(JSON.stringify({ message: "Paper Sent to your Email Successfully!!" }),{
            status: 200,
          });
        } catch (error) {
          console.error("Error sending email:", error);
          return new Response(JSON.stringify({ message: "Failed to send Paper to your email" }), { status: 500 });
        }
      }
      else{
        return NextResponse.json(
          { message: "Error fetching file by email" },
          { status: 500 }
        );
      }
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        { message: "Error fetching file by email" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json(
    { error: "Invalid query parameter" },
    { status: 400 }
  );
}
