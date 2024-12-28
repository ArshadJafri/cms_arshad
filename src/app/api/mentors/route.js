import db from "@/db";

export async function POST(req, res) {
  try {
    const data = await req.json();
    const {
      name,
      email,
      title,
      description,
      expertise,
      cost_per_session,
      meeting_link,
      profile_picture,
      slots,
    } = data;
    const binaryData = Buffer.from(profile_picture, "base64");

    const [mentorResult] = await db.execute(
      `INSERT INTO mentors (name, email, title, description, expertise, cost_per_session, meeting_link, profile_picture)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        email,
        title,
        description,
        expertise,
        cost_per_session,
        meeting_link,
        binaryData,
      ]
    );

    const mentorId = mentorResult.insertId;

    if (slots && Array.isArray(slots)) {
      const slotPromises = slots.map((slot) => {
        const { day_of_week, time } = slot;
        return db.execute(
          `INSERT INTO mentor_slots (mentor_id, day_of_week, time) VALUES (?, ?, ?)`,
          [mentorId, day_of_week, time]
        );
      });
      await Promise.all(slotPromises);
    }

    return new Response(
      JSON.stringify({ message: "Mentor created successfully" }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Error creating mentor and slots" }),
      { status: 500 }
    );
  }
}
export async function GET(request, response) {
  console.log("Received GET Request for Mentors");
  const url = new URL(request.url);
  const searchText = url.searchParams.get("search");
  if (searchText) {
    try {
      const [rows] = await db.execute(
        `SELECT  m.id AS mentor_id,
          m.name,
          m.email,
          m.title,
          m.description,
          m.expertise,
          m.cost_per_session,
          m.meeting_link,
          m.profile_picture,
          FROM mentors m WHERE m.name LIKE ? OR m.expertise LIKE ?`,
        [`%${searchText}%`, `%${searchText}%`]
      );
      const mentors = {};
      
      rows.forEach((row) => {
        const mentorId = row.mentor_id;

        if (!mentors[mentorId]) {
          mentors[mentorId] = {
            mentor_id: row.mentor_id,
            name: row.name,
            email: row.email,
            title: row.title,
            description: row.description,
            expertise: row.expertise,
            cost_per_session: row.cost_per_session,
            meeting_link: row.meeting_link,
            profile_picture: row.profile_picture,
            slots: [],
          };
        }

        if (row.day_of_week && row.time) {
          mentors[mentorId].slots.push({
            day: row.day_of_week,
            time: row.time,
          });
        }
      });
      return new Response(JSON.stringify(Object.values(mentors)), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      return new Response(
        JSON.stringify({ message: "Error fetching mentors" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  } else {
    try {
      const [rows] = await db.query(`SELECT 
          m.id AS mentor_id,
          m.name,
          m.email,
          m.title,
          m.description,
          m.expertise,
          m.cost_per_session,
          m.meeting_link,
          m.profile_picture
        FROM mentors m`);
      const mentors = {};

      rows.forEach((row) => {
        const mentorId = row.mentor_id;

        if (!mentors[mentorId]) {
          mentors[mentorId] = {
            mentor_id: row.mentor_id,
            name: row.name,
            email: row.email,
            title: row.title,
            description: row.description,
            expertise: row.expertise,
            cost_per_session: row.cost_per_session,
            meeting_link: row.meeting_link,
            profile_picture: row.profile_picture,
            slots: [],
          };
        }

        if (row.day_of_week && row.time) {
          mentors[mentorId].slots.push({
            day: row.day_of_week,
            time: row.time,
          });
        }
      });
      return new Response(JSON.stringify(Object.values(mentors)), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      return new Response(
        JSON.stringify({ message: "Error fetching mentors" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  }
}