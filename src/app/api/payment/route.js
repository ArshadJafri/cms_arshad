// pages/api/createPaymentIntent.js

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req, res) {
  console.log("Received POST request for Payment");
  const body = await req.json();
  const { amount } = body;
  console.log(amount);

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Amount in cents
      currency: "usd",
    });
    return new Response(
      JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    //res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        error: "Payment initiation failed",
        errorMsg: error.message,
      }),
      {
        status: 500,
      }
    );
    //res.status(500).json({ error: "Payment initiation failed" });
  }
}
