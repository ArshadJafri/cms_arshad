import db from "@/db";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
export async function POST(req){
  const body = await req.json();
  const {
    conference_id,
    email,
    ticket_type,
    ticket_price,
    institution
  } = body;


  if(conference_id === -1){
    const msg = {
      to: email, 
      from: "rmakshaykumar08@gmail.com", 
      subject: "Mentee registration!!",
      text: `A mentee has registered with the email: ${email}.\n Please check the database for more details.`,
      attachments: [],
    };
    try {
      await sgMail.send(msg);
      return new Response(JSON.stringify({ message: `Registration Successful!!` }),{
        status: 200,
      });
    } catch (error) {
      console.error("Error sending email:", JSON.stringify(error));
      return new Response(JSON.stringify({ message: `Failed to send Email for your Registration.\n Though Your Registration was captured` }), { status: 500 });
    }
    return ;
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const [result] = await connection.query(
      "INSERT INTO registrations (conference_id, email, ticket_type, ticket_price, institution) VALUES (?, ?, ?, ?, ?)",
      [ conference_id, email, ticket_type, ticket_price, institution]
    );

    const [conference] = await connection.query(
      "SELECT * FROM conferences WHERE id = ?",
      [ conference_id]
    );

    await connection.commit();

    if(result){
      const msg = {
        to: email, 
        from: "rmakshaykumar08@gmail.com", 
        subject: "Here is Your Ticket details!!",
        text: `Thank you for registering for conference. \n Your Purchase details:\n TicketType: ${ticket_type} \n Price: ${ticket_price}`,
        attachments: [],
      };
      try {
        await sgMail.send(msg);
        return new Response(JSON.stringify({ message: `Registration Successful!!\n You will receive an email of the ticket details.` }),{
          status: 200,
        });
      } catch (error) {
        console.error("Error sending email:", JSON.stringify(error));
        return new Response(JSON.stringify({ message: `Failed to send Email for your Registration.\n Though Your Registration was captured` }), { status: 500 });
      }
    }
    else{
      return NextResponse.json(
        { message: "Error in Processing Your Registration" },
        { status: 500 }
      );
    }
  } catch (err) {
    await connection.rollback();
    console.log(err);
    return new Response(
      JSON.stringify({ message: "Error in Processing Your Registration", errormsg: err.message }),
      {
        status: 500,
      }
    );
  }finally{
    connection.release();
  }
}
export async function GET(req) {
  const url = new URL(req.url);
  const conference_id = url.searchParams.get("conference_id");
  try {
    const [ticketTypes] = await db.query(
      "SELECT * FROM ticket_types WHERE conference_id = ?",
      [conference_id]
    );
    return new Response(JSON.stringify({ ticketTypes }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({
        message: "Error fetching TicketTypes.",
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
